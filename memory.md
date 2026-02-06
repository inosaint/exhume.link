# Placeholder Image Update Summary

Date: 2026-02-05

## Summary
- Replaced the personality card placeholder SVG with the Resurrectionist PNG illustration.
- Updated the image alt text to match the archetype name.

## Files Updated
- `src/sections/Overview.tsx`

## Notes
- The new image source points to `/resurrectionist.png` in `public/`.

---

# Overview Stat Card Alignment

Date: 2026-02-05

## Summary
- Centered stat card content vertically to fix the misalignment between the compact and wide cards.
- Refined the domain stat card’s vertical rhythm with consistent line-height and spacing.

## Files Updated
- `src/sections/sections.css`

---

# Navigation Updates

Date: 2026-02-05

## Summary
- Limited the bottom nav to the three results sections (`overview`, `cemetery`, `worldmap`) and removed it from landing/processing.
- Removed the skip button from the unearthing (processing) page and cleaned up its styles.

## Files Updated
- `src/App.tsx`
- `src/sections/Processing.tsx`
- `src/sections/sections.css`

---

# Map & UI Enhancements

Date: 2026-02-05

## Summary
- Reworked the world map to use D3 geo + TopoJSON land data for accurate projection and markers.
- Added d3-zoom controls with overlaid UI and improved drag/zoom behavior.
- Converted map markers to tiny gravestones, added hover tooltip with “View all links” modal.
- Implemented clustering to reduce overlapping markers and aggregated cluster metadata.
- Updated map subtitle to clarify marker size meaning and removed the legend.
- Fixed ShareCard canvas letter spacing and added ESLint flat config; cleaned related lint issues.
- Adjusted app layout to keep bottom nav visible and made the middle pane scroll.

## Files Updated
- `src/sections/WorldMap.tsx`
- `src/sections/sections.css`
- `src/components/ShareCard.tsx`
- `src/sections/Overview.tsx`
- `src/sections/Processing.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `package.json`
- `public/worldIndiaHigh.svg`
- `eslint.config.js`

---

# Share Flow + Personality Card Reuse

Date: 2026-02-05

## Summary
- Added a final Share section and wired the progress rail/nav to include it.
- Reworked sharing: preview uses the same personality card component as The Dead page; share actions live in a modal triggered by “Share with Your Cult”.
- Added a copyable share link that encodes a compact JSON snapshot into the URL.
- Cleaned visual accents (removed top gold line), tightened spacing on The Dead page, and balanced personality text wrapping.
- Updated favicon to use `public/favicon.svg`.

## Files Updated
- `src/App.tsx`
- `src/App.css`
- `src/sections/config.ts`
- `src/sections/Share.tsx`
- `src/sections/Overview.tsx`
- `src/sections/sections.css`
- `src/components/ShareCard.tsx`
- `src/components/ShareCard.css`
- `src/components/PersonalityCard.tsx`
- `src/data/mockData.ts`
- `index.html`

---

# Flow B + User URL/CSV Input

Date: 2026-02-06

## Summary
- Updated “Surface” to accept real user data: paste a bunch of URLs or upload a CSV/text file.
- Added a real analysis pass (runs locally in the browser) and expanded the “Unearthing” page into a multi-step progress sequence that advances when analysis finishes.
- Added a second story flow (Flow B) for A/B testing:
  - Surface → Unearthing → Archetype (card-only) → The Ledger (numbers) → Cemetery → The Web (spiderweb geo view) → Share
- Default is Flow A for now; Flow B is previewable with `?flow=b`.
- Refactored results pages to use the computed session (stats, personality, categories, mapped locations) rather than hardcoded mock values.
- Build + lint now pass.

## Files Updated
- `src/App.tsx`
- `src/App.css`
- `src/sections/config.ts`
- `src/sections/Landing.tsx`
- `src/sections/Processing.tsx`
- `src/sections/Overview.tsx`
- `src/sections/Cemetery.tsx`
- `src/sections/WorldMap.tsx`
- `src/sections/sections.css`
- `src/sections/Share.tsx`
- `src/sections/Personality.tsx`
- `src/sections/Numbers.tsx`
- `src/components/PersonalityCard.tsx`
- `src/components/StatsGrid.tsx`
- `src/components/ShareCard.tsx`
- `src/components/Gravestone.tsx`
- `src/data/tabsAnalysis.ts`
- `src/types/vendor.d.ts`
- `package.json`
- `package-lock.json`

## Notes
- `.venv` is now ignored by git via `.gitignore` (it’s a Python virtual environment and isn’t needed for the app).

---

# Cemetery Tombstone Centering

Date: 2026-02-06

## Summary
- Centered cemetery tombstone rows by switching the grid to fixed-width tracks that can be centered as a group.
- Centered the mobile gravestone row when it doesn't overflow.

## Files Updated
- `src/sections/sections.css`
- `src/components/Gravestone.css`

---

# Agent Coordination Docs

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Renamed `docs/codex.md` → `memory.md` (repo root) to be the shared agent log.
- Added root `AGENTS.md` with coordination rules (read `memory.md` first; append a log entry after each completed task and include which model/agent was used).
- Updated `claude.md` to point to `memory.md`.

## Files Updated
- `AGENTS.md`
- `claude.md`
- `memory.md`

---

# The Necropolis — Procedural Fantasy Map for Flow A

Date: 2026-02-06
Agent/Model: Claude (claude-code)

## Summary
- Built a procedural fantasy map ("The Necropolis") to replace the geographic WorldMap in Flow A.
- Each of the 12 tab categories maps to a fantasy region on a parchment-style continent.
- Continent shape is a convex hull of all region centers with Perlin noise organic coastlines.
- Individual region polygons use FBM noise for natural-looking borders, sized proportionally to tab count.
- Geometric placeholder terrain icons per region type (books, compass, anvil, frame, whisper, mask, tower, stall, shield, stones, ship, dead-tree).
- Includes compass rose, title cartouche, edge decorations (wavy lines, "Here be dragons", sea serpent hint).
- Parchment aesthetic via SVG filters (feTurbulence fractalNoise), vignette gradient, sepia palette.
- Interactive: hover regions for tooltips (name, description, tab count, top domains), legend below map links to regions.
- D3 zoom controls (+/−/reset).
- Flow B retains the geographic WorldMap unchanged.
- Section label in progress rail updated from "The Map" to "Necropolis".
- Cemetery→Necropolis CTA updated to "Enter the Necropolis →".

## Files Created
- `src/lib/noise.ts` — Perlin noise, FBM, noisy polygon generation, smooth SVG path utility
- `src/lib/necropolisRegions.ts` — 12 region definitions (category→fantasy region mapping with positions, terrain types)
- `src/sections/NecropolisMap.tsx` — Main component: coastline generation, region polygons, terrain icons, compass, tooltips, legend
- `src/sections/necropolis.css` — Parchment-on-dark styling, responsive, motion-safe
- `docs/necropolis-map-assets.md` — Asset task list for user (region names, terrain icons, compass rose, sea monsters, color palette, font)

## Files Updated
- `src/App.tsx` — Import NecropolisMap, conditionally render for Flow A; update CTA text
- `src/sections/config.ts` — Flow A worldmap label changed to "Necropolis"
- `todo.md` — Phase 5 split into 5 (Necropolis) and 5b (WorldMap); backlog updated
