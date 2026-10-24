# Security

board shows prompts and replies, which can hold client code and secrets, so its boundary matters:
the server listens on 127.0.0.1, checks the `Host` header, and serves session data only with the
token from `~/.claude/board/token`. The README's *Privacy* and *Known gaps* sections describe what
it does and does not protect against.

Report a way around that boundary (session data without the token, the token reaching another
origin or port, a hook that blocks or fails a session) privately through
[a security advisory](https://github.com/johantor/board/security/advisories/new), not in a public
issue.
