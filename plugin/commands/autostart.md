---
description: "Turn autostart on or off: with it on, the board's server starts with each Claude Code session."
argument-hint: "on | off"
---

`$ARGUMENTS` must be `on` or `off`. If it is anything else, or empty, ask the user which one they
want and stop.

Run this one command with the Bash tool, with `on` or `off` in place of `<on|off>`:

```bash
node "${CLAUDE_PLUGIN_ROOT}/server/board.mjs" --autostart <on|off>
```

Report what it prints in one line. With `on`, add that the server starts at the next session
start, and that `/board:open` starts it now and opens it.

If it fails with `node: command not found`, the board needs Node.js 18 or later. Say so and stop.
