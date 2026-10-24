# Privacy Policy

**Effective date:** 2026-10-24

This policy covers the `board` plugin published from this repository and distributed through the
`johantor` marketplace.

## The short version

The plugin collects nothing. It runs on your machine, there is no server behind it, no account and
no telemetry, and no data of yours reaches the maintainers.

## Data processed on your machine

The hooks write one short line per session event to `~/.claude/board/events.jsonl` (mode 600):
the session id, the working directory, the repo and branch, at most the first 200 characters of a
prompt and 300 of a reply, and a short summary of each tool call. The server reads that file and
the first and last 256 KiB of each transcript under `~/.claude/projects`. It writes to the log only
when you hide a card, and creates `~/.claude/board/token` (mode 600) once.

## Data that leaves your machine

None, from the plugin. The server listens on 127.0.0.1 only, refuses requests that name another
host, and serves session data only with the token. It makes no outbound requests. Claude Code
itself sends your prompts to Anthropic, under
[Anthropic's Privacy Policy](https://www.anthropic.com/legal/privacy), with or without this plugin.

## Third parties

The maintainers share no data with anyone, because they receive none.

## Changes to this policy

Changes are made in this file, and its history is public in this repository's git log.

## Contact

Questions about this policy: open an issue at <https://github.com/johantor/board/issues>. To
report a security vulnerability, follow [SECURITY.md](SECURITY.md) instead.
