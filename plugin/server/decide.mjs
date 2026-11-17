// Decide hook entry, on PermissionRequest: waits for an Allow or Deny clicked on the
// board and returns it as the hook's decision. The terminal prompt stays open
// meanwhile, and Claude Code applies whichever answer comes first, so the hook
// stops as soon as the log shows the call answered (CLAUDE.md, Map). Never fails
// the hook: on any error it returns no decision, and the terminal decides.
import fs from 'node:fs';
import path from 'node:path';
import { createTail, isBoard, parseArgs } from './board.mjs';
import { callKey } from './capture.mjs';
import { boardDir, CALL_RE, decisionsDir, eventsFile, isMain, SID_RE } from './paths.mjs';

const POLL_MS = 300;
// Under the hook's 600 s timeout in hooks.json, so the hook ends on its own.
const MAX_WAIT_MS = 590 * 1000;
const ENDS_TURN = new Set(['Stop', 'StopFailure', 'UserPromptSubmit', 'SessionEnd']);

// Whether a log record shows this prompt answered in the terminal.
export function answered(rec, sid, call, aid) {
  if (!rec || rec.sid !== sid) return false;
  if (rec.call === call && (rec.e === 'PostToolUse' || rec.e === 'PostToolUseFailure')) return true;
  if (aid) return rec.e === 'SubagentStop' && rec.aid === aid;
  return ENDS_TURN.has(rec.e) || (rec.e === 'Notification' && rec.ntype === 'idle_prompt');
}

// The board's answer, taken once: renamed before the read, as titles are.
function take(file) {
  const claimed = `${file}.${process.pid}.taken`;
  try {
    if (!fs.lstatSync(file).isFile()) return '';
    fs.renameSync(file, claimed);
    return fs.readFileSync(claimed, 'utf8').trim();
  } catch {
    return '';
  } finally {
    fs.rmSync(claimed, { force: true });
  }
}

export function output(answer) {
  const decision = answer === 'allow' ? { behavior: 'allow' } : { behavior: 'deny', message: 'Denied on the board.' };
  return JSON.stringify({ hookSpecificOutput: { hookEventName: 'PermissionRequest', decision } });
}

async function boardRunning() {
  try {
    const token = fs.readFileSync(path.join(boardDir(), 'token'), 'utf8').trim();
    return await isBoard(parseArgs([]).port, token);
  } catch {
    return false;
  }
}

export async function wait(p, { pollMs = POLL_MS, maxMs = MAX_WAIT_MS } = {}) {
  if (!p || p.hook_event_name !== 'PermissionRequest' || !SID_RE.test(p.session_id ?? '')) return '';
  const call = callKey(p.tool_name, p.tool_input);
  if (!CALL_RE.test(call)) return '';
  // No board, no button to click: give the terminal the prompt at once.
  if (!(await boardRunning())) return '';
  const name = `${p.session_id}.${call}`;
  const file = path.join(decisionsDir(), name);
  // The newest hook for a call owns it: the same call asked again (a terminal Deny,
  // then a retry) starts a new hook, and the older one must not take its answer.
  // The server accepts a click only while a waiter file exists.
  const waiter = path.join(decisionsDir(), `${name}.wait`);
  const me = `${process.pid}:${Date.now()}`;
  fs.mkdirSync(decisionsDir(), { recursive: true, mode: 0o700 });
  // A click left over from an earlier prompt of the same call answers nothing now.
  fs.rmSync(file, { force: true });
  fs.writeFileSync(waiter, me, { mode: 0o600 });
  const mine = () => {
    try {
      return fs.readFileSync(waiter, 'utf8') === me;
    } catch {
      return false;
    }
  };
  let size = 0;
  try {
    size = fs.statSync(eventsFile()).size;
  } catch {
    // No log yet: read it from the start once it appears.
  }
  const tail = createTail(eventsFile(), size);
  const end = Date.now() + maxMs;
  try {
    while (Date.now() < end && mine()) {
      const answer = take(file);
      if (answer === 'allow' || answer === 'deny') return output(answer);
      if (tail.read().records.some((rec) => answered(rec, p.session_id, call, p.agent_id))) return '';
      await new Promise((r) => setTimeout(r, pollMs));
    }
    return '';
  } finally {
    if (mine()) fs.rmSync(waiter, { force: true });
  }
}

async function main() {
  try {
    const out = await wait(JSON.parse(fs.readFileSync(0, 'utf8')));
    if (out) process.stdout.write(out);
  } catch {
    // No decision: the terminal prompt still answers.
  }
}

if (isMain(process.argv[1], import.meta.url)) main();
