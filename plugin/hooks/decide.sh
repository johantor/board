#!/usr/bin/env bash
# Waits for an Allow or Deny clicked on the board (server/decide.mjs). The terminal
# prompt stays open meanwhile; the first answer wins. Always exits 0: with no
# decision printed, the terminal decides.
command -v node >/dev/null 2>&1 || exit 0
node "$(dirname "${BASH_SOURCE[0]}")/../server/decide.mjs" || true
exit 0
