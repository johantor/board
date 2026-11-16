#!/usr/bin/env bash
# Hands a title set on the board to Claude Code (server/title.mjs). It runs in the
# foreground before each prompt, so it starts Node only while a title waits for
# this session. The fallback mirrors boardDir() in server/paths.mjs.
titles="${CLAUDE_BOARD_DIR:-$HOME/.claude/board}/titles"
set -- "$titles"/*
[ -e "$1" ] || exit 0
payload="$(cat)"
# A quote inside a string is escaped in JSON, so only the real key matches;
# title.mjs checks the payload again.
[[ $payload =~ \"session_id\"[[:space:]]*:[[:space:]]*\"([A-Za-z0-9_-]+)\" ]] || exit 0
[ -f "$titles/${BASH_REMATCH[1]}" ] || exit 0
command -v node >/dev/null 2>&1 || exit 0
printf '%s' "$payload" | node "$(dirname "${BASH_SOURCE[0]}")/../server/title.mjs" || true
exit 0
