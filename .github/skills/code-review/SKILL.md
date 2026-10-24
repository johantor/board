---
name: code-review
description: Review a pull request or diff in the board plugin — the Bash hook, the Node server and reducer, the browser page, the manifest and changelog. Use when asked to review code, a PR, or a diff in this repository.
---

# Reviewing a board change

This repo ships one Bash hook, a Node server with no dependencies, and a static page. `AGENTS.md` is
the contributor guide and wins on conflict; `CLAUDE.md` is the code map and its gotchas. This file
is the one rubric and owns the output format; code rules are the `engineering-principles` skill
(`.github/skills/engineering-principles/SKILL.md`); Copilot reads it directly and Claude Code's
`board-review` skill loads it. Adapted from the crew rubric (johantor/crew).

## Scope: one full pass, then only what changed

- **First review: every changed hunk ends as a finding or a Passed line.** Also read what the
  diff makes newly reachable: a new route, a new record kind, a new field the page renders.
- **Re-review after a push: review the new commits.** Raise an old, unchanged hunk only if it is
  Blocking. Never reopen a resolved thread with the same point reworded.
- **One root cause, one finding.** When findings share a cause, report the cause once.

## Severity: earn it with an input

- **Blocking** needs a concrete payload, request, log line or file state, and the wrong result it
  gives that the base branch did not. No input, no Blocking.
- **A known gap is not a finding.** The README's *Known gaps* and `CLAUDE.md`'s *Gotchas* are
  accepted on purpose. Flag only a change that widens one.
- **Prefer less code.** When a fix grows a parser or a special case for one edge, say so and
  suggest the smaller rule or accepting the gap in *Known gaps*.
- Style-only notes are not findings unless they break a written convention.

## The hook (`hooks/capture.sh`, `server/capture.mjs`)

- **It never blocks or fails a session.** Every path exits 0: no Node, bad JSON, an unwritable
  log. A change that can exit non-zero, hang, or run longer than its `timeout` is Blocking.
- **Async by default.** Only `PermissionRequest` and `SessionEnd` run in the foreground
  (`capture.test.sh` asserts the split). A new foreground hook needs the reason in `CLAUDE.md`.
- **One line stays under 4 KiB**, so appends from several sessions do not interleave. A new field
  is clipped like the others.
- **No fork per event.** Read files directly (`.git/HEAD` as a file, through `readSmall`); never
  spawn `git` or a shell from the hook path.

## The reducer (`server/reduce.mjs`)

- **No transition may depend on the order of async events** (`CLAUDE.md`, *Gotchas*). Order that
  matters comes from a foreground hook. A rule that assumes `PreToolUse` lands before its
  `PermissionRequest` is Blocking: give the two orders as the input.
- **History never overrides a hook record.** Backfill fills gaps only.
- **One answer never hides another.** A record closes only its own question (by `call` or `aid`).
- **Old logs keep loading.** A renamed or reshaped record kind orphans existing lines; that is
  why `archive` stays in the API.

## The server and the page (`server/board.mjs`, `server/public/`)

- **Security pass, always.** The server listens on 127.0.0.1, checks the `Host` header, and
  needs the token for session data, as a header (or `?t=` on the stream only), never a cookie. A
  route that serves session data without the token, a widened host allow-list, or the token in a
  log or a URL other than the stream is Blocking.
- **Prompts and replies are untrusted.** The page builds DOM with `textContent`, never
  `innerHTML` with session text. The CSP is `default-src 'self'`: no inline script or style.
- **The copied resume command is single-quoted**, and a directory with a character outside the
  safe set gets no `cd` (`resume.mjs`). A change there needs a test with a hostile folder name.
- **No dependency.** Node's standard library only, on the server and the page. A new dependency
  is Blocking unless the PR names and justifies it.
- **Rebuild only what changed.** A push arrives every second while a session works; the page
  must keep focus and scroll.

## Release, tests, docs

- **Shipped change without a bump** (anything `check-changelog.sh` does not exclude; AGENTS.md,
  *Releasing*, lists them): Warning; Blocking if users miss a fix.
- **A behavior change without a test** that would fail on the base code is a Warning: the hook
  in `capture.test.sh`, everything else in `tests/board.test.mjs`.
- **`CLAUDE.md` must match the code** in the same PR, and the README's *Known gaps* must match
  what the code still does not handle.
- **The site** (`docs/`): its `style.css` is a copy of crew's; a change to one names the other.

## Verbosity is a finding

- **One rationale, one place.** The reason lives in `AGENTS.md` or `CLAUDE.md`; code comments
  explain *why* in one or two lines and point there. The same explanation in three files is a
  Warning.
- Comments that restate the code, and PR bodies over the template's budget, are nits.

## Output

`## Blocking`, `## Warnings`, `## Passed`. One bullet per finding: `path:line` — defect —
failing input — smallest fix. A Warning should be fixed but does not block merge. Under Passed,
one line per lens applied.

**Every Blocking or Warning finding is a review thread on its line.** A finding that exists only
in the summary cannot be replied to or resolved.
