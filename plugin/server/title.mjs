// Title hook entry: hands a title set on the board to Claude Code as the hook's
// `sessionTitle` output, which has the effect of /rename. Synchronous by need:
// Claude Code ignores that field from an async hook. Never fails the hook.
import fs from 'node:fs';
import path from 'node:path';
import { isMain, SID_RE, titlesDir } from './paths.mjs';

// SessionStart applies a title only on these sources; on /clear or a compact the
// title keeps waiting for the next prompt.
const STARTS = new Set(['startup', 'resume', 'fork']);

// Payload → the hook's stdout, or '' when no title waits for this session.
export function takeTitle(p) {
  if (!p || typeof p.session_id !== 'string' || !SID_RE.test(p.session_id)) return '';
  const e = p.hook_event_name;
  if (e !== 'UserPromptSubmit' && !(e === 'SessionStart' && STARTS.has(p.source))) return '';
  const file = path.join(titlesDir(), p.session_id);
  let title;
  try {
    // A plain file only: the board writes one, and a FIFO would hang the prompt.
    if (!fs.lstatSync(file).isFile()) return '';
    title = fs.readFileSync(file, 'utf8').trim();
    fs.rmSync(file);
  } catch {
    return '';
  }
  if (!title) return '';
  return JSON.stringify({ hookSpecificOutput: { hookEventName: e, sessionTitle: title } });
}

function main() {
  try {
    const out = takeTitle(JSON.parse(fs.readFileSync(0, 'utf8')));
    if (out) process.stdout.write(out);
  } catch {
    // A title that does not land must never block the prompt.
  }
}

if (isMain(process.argv[1], import.meta.url)) main();
