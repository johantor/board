// Where the board keeps its log, and where Claude Code keeps its transcripts. A
// fixed directory, not CLAUDE_PLUGIN_DATA: a server started from a terminal must
// find the same file the hooks write.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Node resolves import.meta.url through symlinks and junctions, but argv[1] keeps
// the path as typed: a symlinked ~/.claude or --plugin-dir must still match.
export function isMain(argv1, metaUrl) {
  if (!argv1) return false;
  try {
    return fs.realpathSync(argv1) === fs.realpathSync(fileURLToPath(metaUrl));
  } catch {
    return false;
  }
}

export function boardDir() {
  return process.env.CLAUDE_BOARD_DIR || path.join(os.homedir(), '.claude', 'board');
}

export function eventsFile() {
  return path.join(boardDir(), 'events.jsonl');
}

// Present only after `/board:autostart on`: SessionStart then starts the server.
export function autostartFile() {
  return path.join(boardDir(), 'autostart');
}

// A title set on the board waits here, one file per session, until the title hook
// hands it to Claude Code.
export function titlesDir() {
  return path.join(boardDir(), 'titles');
}

// A board answer to a permission prompt waits here as <sid>.<call> until the
// decide hook, which waits for it, takes it.
export function decisionsDir() {
  return path.join(boardDir(), 'decisions');
}

// capture.mjs's callKey(): 16 hex characters.
export const CALL_RE = /^[0-9a-f]{16}$/;

// A session id that is also a safe file name: no separator, no dot.
export const SID_RE = /^[A-Za-z0-9_-]{1,128}$/;

export function projectsDir() {
  const config = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
  return path.join(config, 'projects');
}
