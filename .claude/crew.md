---
frontendMode: headless
backendStack: node
backendSkill: unset
frontendStack: other
frontendSkill: none
frontendE2eTool: none
frontendUnitTestTool: unset
backendLanePaths: plugin/hooks/
frontendLanePaths: plugin/server/public/
backendTestCommand: for t in tests/*.test.sh; do bash "$t" || exit 1; done
frontendTestCommand: none
backendBuildCommand: none
frontendBuildCommand: none
backendLintCommand: shellcheck plugin/hooks/*.sh tests/*.sh scripts/*.sh
frontendLintCommand: none
formatMatrix: none
baseBranch: main
branchNaming: <type>/<issue>-<slug>
runUrl: none
planDirectory: unset
---

The crew configuration for developing board with the `crew` plugin; `/crew:init` reconciles it.
The plugin is `plugin/`: a Bash hook and a Node server with no dependencies, so
`backendStack` is `node` and there is no build. The page under `plugin/server/public/` is a view with no
framework, so `frontendStack` is `other` (no crew skill, `frontendSkill: none`) in `headless` mode:
it renders from the server's JSON stream, with no server template. Both sides are JavaScript, so
lane paths split them: `frontend` owns `plugin/server/public/`, `backend` owns `plugin/hooks/`, and the server
modules beside `public/` are open to both. There is no e2e suite (`frontendE2eTool: none`); the
page's modules are tested by the Node suite. The test command runs every `tests/*.test.sh`, as CI
does; the lint command is CI's shellcheck step.

`planDirectory` is `unset`, so plans land in the `.claude/` fallback, which this repo does not
track.
