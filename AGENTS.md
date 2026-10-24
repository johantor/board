# Contributing to board

`board` is a Claude Code plugin. The plugin is the repository root; it is listed in the
`johantor` marketplace ([johantor/plugins](https://github.com/johantor/plugins)). The code map
and gotchas are in [CLAUDE.md](CLAUDE.md). Keep it accurate: a PR that changes anything it states
updates it in the same commit.

## Validating changes

Run what CI runs (`.github/workflows/validate.yml`) before you push:

```bash
shellcheck hooks/*.sh tests/*.sh scripts/*.sh
bash tests/capture.test.sh          # hook end to end, then the Node suite
scripts/check-changelog.sh main     # shipped change => version bump
```

Node and `jq` are required.

## Releasing

**A shipped change bumps the version.** Shipped means everything except `tests/`, `scripts/`,
`.github/`, `CLAUDE.md`, `AGENTS.md` and `CHANGELOG.md`; `README.md` counts. Patch for a fix,
minor for an addition, major for a break.

1. Bump `version` in `.claude-plugin/plugin.json` and add a matching `## [X.Y.Z]` entry to
   `CHANGELOG.md` in the same PR.
2. Merge to `main`. `auto-release.yml` creates the `v<version>` tag and a GitHub Release from that
   changelog section.

Changelog entries are one bullet per change, one line, with the PR as `(#N)`.

## Conventions

- Hooks never block a session: `capture.sh` always exits 0, and only `PermissionRequest` and
  `SessionEnd` run synchronously (CLAUDE.md, *Gotchas*).
- The server binds to 127.0.0.1 only and needs the token for session data.
- No runtime dependencies beyond Node's standard library.
