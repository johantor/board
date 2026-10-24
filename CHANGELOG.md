# Changelog

All notable changes to the `board` plugin are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-10-24

### Changed

- The plugin moved to its own repository, `johantor/board`. The marketplace moved to
  `johantor/plugins`; the install id stays `board@johantor`.

## [0.1.1] - 2026-10-23

### Changed

- A card whose session stopped while its subagents run stays in Working, with "Waiting for N subagents" (johantor/crew#319).
- Archive is now Hide, and the Archived filter is Hidden (johantor/crew#319).
- A card's activity is a quote with a bar in its state color, up to 5 lines at 12px (johantor/crew#319).
- Cards sort by age group (30 s, 1 min, 30 min, 1 h, 6 h, a day, then per day), then by session start, so busy sessions keep their place (johantor/crew#319).
- A new look in the crew site's palette and type, with Phosphor icons, `/` to search, a Needs me
  column that stands out, empty-state messages, and minor badges moved under More (johantor/crew#319).
- Prompts and replies keep their line breaks, and the card shows them as rows (johantor/crew#319).

### Removed

- The Crew and manual filter; the Crew badge stays (johantor/crew#319).

### Fixed

- Hide and More no longer scroll the page to the top (johantor/crew#319).

## [0.1.0] - 2026-10-21

### Added

- A local kanban of every Claude Code session; hooks log to `~/.claude/board/events.jsonl` (johantor/crew#318).
- `/board:open` starts the server on 127.0.0.1, behind a per-user token.
- Transcripts in `~/.claude/projects` fill the board with sessions from before the plugin.
- Subagents show on their session's card; a Crew run gets a Crew badge.
- Copy resume copies `cd '<dir>'; claude --resume <id>`; light, dark or browser theme.

---

Releases up to 0.1.1 were made in johantor/crew, so their PR numbers point there.
