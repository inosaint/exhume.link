# exhume.link — Project Context for Claude

## What this is
A narrative data visualization app that takes a user's browser tabs and turns them into a
gothic "exhumation" story. Think Spotify Wrapped, but for your tab addiction, with gravestones.

## Theme & Tone
Necromancy / resurrection / archaeological dig. Tabs are "buried" — we are "exhuming" them.
Copy should be dry, slightly unsettling, occasionally funny. Never campy.

## Current state (as of session 2026-02-04)
- Repo has raw URL data in `browserdata/` (689 URLs across Safari + Quiche browser)
- `browserdata/browser_tabs_viz_complete.html` is a flat PoC with pre-computed stats — use it as a reference for accurate numbers
- Personality scoring design is DONE — 6 archetypes, 8 dimensions, 3 axes. Full spec lives in `docs/personality-scoring.md`. Read that before touching scorer code.
- No app scaffolding yet. Next step is Vite + React + TS scaffold, then Phase 1 visual shell.
- `todo.md` has the phased build plan. Read it before starting work.

## Settled design decisions
- **Navigation**: Click-driven between sections (Next/Prev). Scroll-driven parallax WITHIN the cemetery/gravestone scene only. `prefers-reduced-motion` disables all parallax and transitions — sections still navigate, gravestones still show, everything just becomes static.
- **Mobile**: Gravestones become a horizontal scrollable row. World map becomes zoomable.
- **Gravestone hover**: slight rotation + glow + shadow shift. Tactile, physical feel. Motion-reduced fallback: just the glow, no rotation.
- **Processing page**: Keep it as a transition beat even in v1 (we load static data). Flavor text like "Unearthing your digital remains..." with a staged fake delay (~2s). Skippable.
- **Categorization**: Rule-based from domain extraction. No LLM for v1.

## Tech stack (chosen, not yet scaffolded)
- Vite + React + TypeScript
- Google Fonts: **Cinzel** for headings/titles (gothic gravestone feel), **Inter** for body
- D3.js or react-simple-maps for the world map
- Canvas API for the shareable card image
- No CSS framework — custom dark theme, hand-written

## Data files
- `browserdata/all_tabs_clean.txt` — 689 combined URLs (one per line)
- `browserdata/safari_tabs.txt` — 500 Safari URLs
- `browserdata/quiche_tabs.txt` — 189 Quiche browser URLs
- `browserdata/browser_tabs_data.json` — metadata only (counts, file paths)
- `browserdata/browser_tabs_viz_complete.html` — PoC with pre-computed stats. Key numbers:
  - Total tabs: 689, Unique domains: 500+, Safari: 500, Quiche: 189
  - Top domains: Medium (44), YouTube (27), Google (22), Twitter (14), Amazon (11), Reddit (9), UXDesign.cc (6)
  - Design/UX tabs: ~107 combined

---

## Personality Scoring System

Full spec is in `docs/personality-scoring.md`. Read that file for the complete rubric.

**Summary:** 6 archetypes (Necromancer, Resurrectionist, Séance Master, Plague Doctor,
Wandering Zombie, Lich). Scored via 8 dimensions that collapse onto 3 axes
(Depth↔Breadth, Consumption↔Action, Resolved↔Unresolved). Volume suffix applied
last (≥500 tabs = "of the Horde", <50 = "the Fledgling").

Expected result for the sample dataset: **The Resurrectionist of the Horde**.

---

## Backlog (not in current phases)
- Shareable URL: encode processed JSON into compressed URL param or localStorage session
- Open Graph meta tags that update dynamically for social share previews
- Ambient soundscape (opt-in audio, reverb-heavy atmosphere)
- Input screens (paste URLs / upload CSV) — steps 1 & 2 of the original narrative
- LLM-powered categorization as a v2 option
