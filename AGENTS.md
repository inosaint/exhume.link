# exhume.link — Agent Notes

## Coordination (read first)
- Start every session by reading `memory.md` to avoid duplicate or conflicting work.
- If you make a change that affects developer workflow or file locations, update any references in agent docs (e.g., `claude.md`, `todo.md`).

## Update log (required)
After finishing any task (even small refactors):
- Append a new entry to `memory.md` with:
  - Date (YYYY-MM-DD)
  - Which model/agent was used (e.g., “GPT-5.2 (Codex)”, “Claude Code”)
  - Summary (1–5 bullets)
  - Files updated (bulleted list)
  - Notes/decisions (optional)
- Then explicitly tell the user that `memory.md` was updated so they can review it.

## Project context
- Narrative tone, UX decisions, and dataset notes live in `claude.md` — read it before touching copy/visual theme.
- Roadmap lives in `todo.md`.
- Personality scoring spec lives in `docs/personality-scoring.md` — read it before changing any scoring/archetype logic.

## Theme & UX constraints (quick refs)
- Tone: necromancy/exhumation; dry, slightly unsettling; occasionally funny; never campy.
- Motion: respect `prefers-reduced-motion` (parallax/transitions off; content still accessible).
- Navigation: click-driven between sections; scroll/parallax only within the cemetery scene.
- v1 categorization is rule-based (no LLM in the loop).

## Dev workflow
- Prefer small, focused PR-sized changes.
- Run `npm run lint` and `npm run build` after changes that touch TS/React/CSS.
