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
- No app scaffolding yet. Next step is to set up the Vite + React + TS project.
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

This is the scoring rubric that drives the archetype assignment. Defined before any UI work begins.

### Categories
URLs are bucketed by extracting the domain and matching against keyword/domain lists:

| # | Category | Example domains / signals |
|---|---|---|
| 1 | Design & UX | uxdesign.cc, dribbble, figma.com, design blogs, portfolio .design TLDs |
| 2 | Reading & Articles | medium.com (non-design pubs), substack, long-form blogs, brainpickings |
| 3 | Tech & Engineering | dev.to, github.com, engineering blogs, simonwillison, kitchensoap |
| 4 | AI & Tools | chatgpt.com, gemini.google.com, fal.ai, cursor, ai-2027.com |
| 5 | Entertainment & Media | youtube, spotify, vimeo, gaming (steam, pcgamesn), anime (myanimelist) |
| 6 | Social & News | twitter, reddit, reuters, axios, bbc, theatlantic, livemint |
| 7 | Shopping & Commerce | amazon, online stores, product pages |
| 8 | Travel & Lifestyle | tripadvisor, travel blogs, Sri Lanka content, food/recipe sites |
| 9 | Books & Literature | goodreads, bookshop.org, book publishers, re-press |
| 10 | Career & Professional | job boards (greenhouse), career blogs, salary sites, leadership newsletters |

### Archetypes

**The Necromancer** — "You dig deep. Your tabs are archaeological digs, not bookmarks."
- Person who actually reads the things they open. Long-form, books, research, newsletters.
- Tabs are slow, intentional, deep.

**The Resurrectionist** — "You build with what others have buried."
- Person whose tabs are a workspace. Tools, design, engineering, portfolios.
- Tabs are functional, purposeful, layered.

**The Wandering Zombie** — "Still searching. Still hungry. Still have 847 tabs open."
- Person who opens tabs like breathing. Social, entertainment, shopping, high breadth.
- Tabs are chaotic, impulsive, sprawling.

### Scoring Matrix

Each URL in a category awards weighted points to each archetype:

| Category            | Necromancer | Resurrectionist | Wandering Zombie |
|---------------------|-------------|-----------------|------------------|
| Design & UX         | 1           | 3               | 0                |
| Reading & Articles  | 3           | 1               | 1                |
| Tech & Engineering  | 1           | 3               | 1                |
| AI & Tools          | 0           | 3               | 1                |
| Entertainment/Media | 0           | 0               | 3                |
| Social & News       | 1           | 0               | 2                |
| Shopping/Commerce   | 0           | 0               | 2                |
| Travel & Lifestyle  | 2           | 1               | 1                |
| Books & Literature  | 3           | 1               | 0                |
| Career/Professional | 1           | 2               | 1                |

### Modifiers (applied after raw scores are totalled)

1. **Depth modifier** — ratio of (unique domains / total tabs)
   - ratio > 0.85 → Zombie score +15% (high breadth = zombie pattern)
   - ratio < 0.60 → Necromancer score +15% (revisiting = depth pattern)

2. **Tab volume flavor** — does not change the archetype, only the title suffix:
   - total tabs >= 500 → append "of the Horde" (e.g. "The Necromancer of the Horde")
   - total tabs < 50  → append "the Fledgling"
   - otherwise → no suffix

3. **Normalize**: divide each archetype's total by the sum of all three, producing percentages.
   The highest percentage wins. Ties broken by: Necromancer > Resurrectionist > Zombie.

### Calibration check against this dataset
With 689 tabs, ~107 design, ~85 reading, ~27 entertainment, ~19 AI tools, ~14 social,
~15 shopping, ~10 books: expected winner is **Resurrectionist** (design + tools weight dominates),
with Necromancer as close second (reading + books). Unique/total ratio ~0.73 → no modifier fires.
Suffix: "of the Horde" (689 >= 500).
Result: **The Resurrectionist of the Horde**

---

## Backlog (not in current phases)
- Shareable URL: encode processed JSON into compressed URL param or localStorage session
- Open Graph meta tags that update dynamically for social share previews
- Ambient soundscape (opt-in audio, reverb-heavy atmosphere)
- Input screens (paste URLs / upload CSV) — steps 1 & 2 of the original narrative
- LLM-powered categorization as a v2 option
