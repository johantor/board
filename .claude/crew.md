---
frontendMode: unset
backendStack: node
backendSkill: unset
frontendStack: none
frontendSkill: unset
frontendE2eTool: unset
frontendUnitTestTool: unset
backendLanePaths: unset
frontendLanePaths: unset
backendTestCommand: bash tests/capture.test.sh
frontendTestCommand: none
backendBuildCommand: none
frontendBuildCommand: none
backendLintCommand: shellcheck hooks/*.sh tests/*.sh scripts/*.sh
frontendLintCommand: none
formatMatrix: none
baseBranch: main
branchNaming: unset
runUrl: none
planDirectory: unset
---

The crew configuration for developing board with the `crew` plugin; `/crew:init` reconciles it.
The plugin is the repository root: a Bash hook and a Node server with no dependencies, so
`backendStack` is `node` and there is no build. The page under `server/public/` is plain files the
server serves, so `frontendStack` is `none` and `backend` owns it. The test command runs the hook
suite and then the Node suite; the lint command is the shellcheck step from CI.

`planDirectory` is `unset`, so plans land in the `.claude/` fallback, which this repo does not
track.
