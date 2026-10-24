# Contributing to board

`board` is a Claude Code plugin. The plugin lives in `plugin/`, the directory the marketplace
installs, so the repo tooling around it never reaches users. It is listed in the
`johantor` marketplace ([johantor/plugins](https://github.com/johantor/plugins)). The code map
and gotchas are in [CLAUDE.md](CLAUDE.md). Keep it accurate: a PR that changes anything it states
updates it in the same commit.

The review rubric and the shared rules are adapted from
[johantor/crew](https://github.com/johantor/crew). When one changes there, check whether it applies
here.

## Repository layout

- `plugin/`: the plugin: `.claude-plugin/`, `hooks/`, `server/`, `commands/`, and the icons'
  `THIRD-PARTY-NOTICES.md` (CLAUDE.md, *Map*). `README.md` and `CHANGELOG.md` stay at the root.
- `tests/`: the hook suite (`capture.test.sh`, harness in `lib.sh`), the Node suite, and
  `release.test.sh` for the release scripts.
- `scripts/`: repo tooling, never part of the plugin's behaviour: `check-changelog.sh` (the
  release gate) and `release-notes.sh` (used by `auto-release.yml`).
- `docs/`: the site on GitHub Pages. `style.css` is an exact copy of crew's `docs/style.css`;
  board-only layouts go in `board.css`.
- `.github/`: `workflows/` (CI and release), `skills/` (the repo's own skills, never shipped:
  `code-review`, the one rubric Copilot reads through `copilot-instructions.md`;
  `engineering-principles`, a copy of crew's; and `writing-style`), the PR and issue templates.
  `.claude/skills/` holds thin wrappers for Claude Code (`board-review` adds the shell steps;
  `steward` says how a session drives a PR).
- `.claude/crew.md`: the crew configuration, for developing board with the `crew` plugin.

## Validating changes

Run what CI runs (`.github/workflows/validate.yml`) before you push:

```bash
shellcheck plugin/hooks/*.sh tests/*.sh scripts/*.sh
bash tests/capture.test.sh          # hook end to end, then the Node suite
bash tests/release.test.sh          # the changelog gate and the release notes
scripts/check-changelog.sh main     # a change under plugin/ => version bump
```

Node and `jq` are required.

## Releasing

**A change under `plugin/` bumps the version.** Only `plugin/` reaches users, so nothing else
counts. Patch for a fix, minor for an addition, major for a break.

1. Bump `version` in `plugin/.claude-plugin/plugin.json` and add a matching `## [X.Y.Z]` entry to
   `CHANGELOG.md` in the same PR. `check-changelog.sh` (the same script as crew's) fails a change
   under `plugin/` without one.
2. Merge to `main`. `auto-release.yml` creates the `v<version>` tag and a GitHub Release from that
   changelog section.

Changelog entries are one bullet per change, one line, with the PR as `(#N)`.

## Conventions

- Hooks never block a session: `capture.sh` always exits 0, and only `PermissionRequest` and
  `SessionEnd` run synchronously (CLAUDE.md, *Gotchas*).
- The server binds to 127.0.0.1 only and needs the token for session data.
- No runtime dependencies beyond Node's standard library.
- Code follows the `engineering-principles` skill (`.github/skills/engineering-principles/`).
- Code comments explain *why* in one or two lines; a longer rationale lives once, in `CLAUDE.md`
  or here, and the comment points to it.
- Keep diffs minimal-scope; list unrelated improvements rather than bundling them.
- **Self-review the diff before every PR and every push to one.** Use the rubric,
  `.github/skills/code-review/SKILL.md` (the `board-review` skill runs it with the checks), and fix
  every Blocking and Warning first. Copilot reviews with the same rubric.
- PR titles follow Conventional Commits, `type(scope): summary`, with `(vX.Y.Z)` when the PR bumps.
- **PR descriptions have a hard budget**: summary 150 words and 5 bullets at most, whole body
  under 400 words. Verification is a result ("ran X, all green"), not a transcript.
- **Every review comment gets a reply, then the thread is resolved.** A correct finding is fixed
  and pushed now, whatever its label; decline only a finding that is wrong, and say why.
- One branch and PR per issue, from the latest `main`; link the issue with `Closes #N`.
- **Name the branch for what it changes**: `<type>/<issue>-<slug>`, with the Conventional
  Commits type and a slug of three to five words, such as `fix/12-stale-badge-after-esc`. With no
  issue, drop `<issue>-`: `docs/readme-crew-structure`. A generated name such as
  `claude/vigilant-keller-vvje0k` says nothing in the branch list; rename it before you push.
- READMEs, changelogs, PR bodies and issues follow the `writing-style` skill
  (`.github/skills/writing-style/SKILL.md`).
