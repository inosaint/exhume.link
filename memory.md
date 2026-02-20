# Share Card Redesign, Flow A Refinements, Volume Suffix Tiers

Date: 2026-02-09
Agent/Model: Claude Opus 4.6 (claude-code)

## Summary
Major overhaul of the Share page, share modal, and Numbers/Cemetery refinements for Flow A.

### Share Page & Modal
- Changed page title from "Trading Card" to "Your Archetype"
- Removed duplicate PersonalityCard section below the TradingCard3D preview
- Removed "Download & Share" button and hint text (footer "Share with Your Cult" is the sole CTA)
- Made card fit viewport on all devices using `min()` with `svh`-derived width constraint
- Fixed scroll issue by changing `.share-section` from `min-height: 100vh` to `height: 100%`
- Removed subtitle text from share page
- Renamed phase label from "The Rite" to "Archetype Binding" in config + App
- **Replaced canvas-rendered share card** with `html-to-image` capture of the actual TradingCard3D DOM element
- Redesigned share modal: removed card preview, replaced rectangular buttons with 3×3 square tile grid
- Added Bluesky and Instagram share options, removed LinkedIn
- Styled native "Share via..." as a tile matching social options

### TradingCard3D
- Removed Repeat Domains and Locations Mapped stats
- Renamed stat labels to Ledger terms: Graves Dug, Bloodlines Buried, Restless Spirits
- Removed top domain separator line (both CSS and canvas)

### Numbers Page (Ledger)
- Added hover/tap tooltips to stat cards with black bg, border, shadow
- Added "The Rot" stat from GrimReport (stale tab percentage)
- Moved Rot stat next to Restless Spirits
- Changed subtitle to "Are you ready to ask for forgiveness?"
- Aligned "Popular Haunts" text to top, bottom-aligned count text
- Changed stats grid from 6-column to 4-column to fit 4 cards in first row

### Cemetery Page
- Added favicons to gravestones via Google Favicon API with fallback to cross
- Added info icon tooltips to category titles with region descriptions
- Stacked burial count below title in center-aligned layout
- Commented out subtitle "Each stone marks a tab. Click to resurrect."

### Flow A Navigation
- Commented out grimreport from SECTIONS_A (cemetery → share directly)
- Updated cemetery footer CTA to "Bind Your Archetype ↓"

### Volume Suffix Tiers (finalized)
Updated `scorePersonality()` with 6 tiers:
- 0–9: The Unburdened (prefix), 10–49: of the Shadows, 50–99: of the Cult
- 100–249: of the Dark Legion, 250–499: of the Horde, ≥500: of the Endless Horde
Updated `docs/personality-scoring.md` to match.

## Files Created
- *(none)*

## Files Updated
- `src/sections/Share.tsx` — Title, removed subtitle/buttons
- `src/components/ShareCard.tsx` — Replaced canvas with html-to-image, new tile UI
- `src/components/ShareCard.css` — Square tile grid layout
- `src/components/TradingCard3D.tsx` — Reduced stats, renamed labels
- `src/components/TradingCard3D.css` — Viewport-height-aware sizing, removed separator
- `src/sections/sections.css` — 4-column stats grid, tooltips, cemetery tooltips, share section height fix
- `src/sections/Numbers.tsx` — Added grimReport prop, subtitle text
- `src/components/StatsGrid.tsx` — Tooltips, Rot stat, skull icon
- `src/App.tsx` — Passes grimReport to Numbers, phase label, footer CTA text
- `src/sections/config.ts` — Commented out grimreport, renamed share label
- `src/sections/Cemetery.tsx` — Commented out subtitle, added info tooltips
- `src/components/Gravestone.tsx` — Favicon loading via Google API
- `src/components/Gravestone.css` — Favicon overlay styles
- `src/data/tabsAnalysis.ts` — 6-tier volume suffix logic
- `docs/personality-scoring.md` — Updated volume suffix table
- `package.json` / `package-lock.json` — Added html-to-image

## Flow A is now:
Surface → Unearthing → The Verdict → The Ledger → Cemetery → **Archetype Binding** (Share)
*(Grim Report commented out — skipped for now)*

## Notes
- `npm run build` passes clean.
- html-to-image captures the TradingCard3D DOM element at 2× pixel ratio for retina-quality downloads.
- Instagram share downloads the card image (no web share intent available).

---

# The Grim Report — Behavioral Analysis Section + Progress Rail Fix

Date: 2026-02-08
Agent/Model: Claude Opus 4.6 (claude-code)

## Summary
- Replaced the Necropolis map in Flow A with **The Grim Report** — a behavioral analysis page that surfaces insights from the user's tab data (spirals, consumption/creation ratio, stale tabs, unfinished business, domain drift).
- Added `GrimReport` interface and `computeGrimReport()` to the analysis pipeline, extracting behavioral signals from data already being parsed.
- Includes a template-generated **verdict** paragraph that synthesizes all findings into a closing narrative.
- Renamed the Share section label to **"The Verdict"** in Flow A's config.
- **Fixed the progress rail** — moved visible dot rendering from `::after` (which conflicted with tooltip at 768px breakpoint) to `.rail-dot__inner` (already in HTML). `::after` is now exclusively for tooltips at all breakpoints. Hit targets are properly sized (32px desktop, 44px tablet, 28px narrow).

## Files Created
- `src/sections/GrimReport.tsx` — The Grim Report section: insight cards (Spiral, Ratio, Rot, Unfinished Business, Drift) + verdict + CTA
- `src/sections/grimreport.css` — Dark card layout, gold accents, consumption/creation bar, staggered fade-in, responsive

## Files Updated
- `src/data/tabsAnalysis.ts` — Added `GrimReport` interface, `computeGrimReport()`, updated `ExhumeSession` to include `grimReport`
- `src/sections/config.ts` — Added `'grimreport'` to `SectionId`, replaced `worldmap` with `grimreport` in `SECTIONS_A`, renamed Share label to "The Verdict"
- `src/App.tsx` — Imported `GrimReport`, added `grimreport` to `PHASE_TITLES` ("Bone Reading"), render case, footer nav condition, updated CTA text ("Read the Report →", "Deliver the Verdict →")
- `src/App.css` — Rewrote progress rail: `.rail-dot__inner` is the visible dot, `.rail-dot` is the invisible hit target, `::after` is always the tooltip. Fixed connecting line alignment. Cleaned up mobile breakpoints.
- `memory.md` — This entry

## Flow A is now:
Surface → Unearthing → The Dead → The Ledger → Cemetery → **The Grim Report** → **The Verdict** (Share)

## Notes
- `npm run build` passes clean.
- `npm run lint` passes clean.
- Flow B and Flow C are unchanged — they still use WorldMap and HexMap respectively.
- NecropolisMap.tsx and necropolis.css remain in the codebase (used by Flow C's tab view).

---

# Hex Map Polish — Landscape, Colors, Wavy Labels, 2x Zoom

Date: 2026-02-07
Agent/Model: Claude Opus 4.6 (claude-code)

## Summary
- Changed hex map to landscape layout (1400×600 viewBox, was 1000×700)
- Added distinct dark gothic color palette per category (burgundy for reading, teal for design, purple for social, etc.) — defined in `hexTileLayout.ts` so Flow A Necropolis colors are untouched
- Added landscape-spread cluster center positions so categories form one connected organic mass horizontally
- Default zoom now 2x centered (was 1:1) — caters to both horde and fledgling tab counts
- Replaced flat text labels with wavy SVG `<textPath>` labels that undulate through cluster centroids
- Labels have dark stroke outline (`paintOrder: stroke fill`) for readability on any hex color
- Fixed section label: "Hex Map" → "Necropolis" in SECTIONS_C config
- Kept hexbin mode toggle untouched for comparison

## Files Updated
- `src/lib/hexTileLayout.ts` — MAP_W/MAP_H, HEX_COLORS, HEX_CENTERS, getCategoryMeta override
- `src/sections/HexMap.tsx` — Landscape dims, 2x initial zoom, wavy textPath labels, dark stroke
- `src/sections/hexmap.css` — Aspect ratio 1400/600, label text drop-shadow
- `src/sections/config.ts` — SECTIONS_C label fix

## Notes
- `npm run build` passes clean.
- `necropolisRegions.ts` NOT modified — Flow A Necropolis Map unaffected.

---

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

---

# Mobile Section Scroll Fix

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Switched general sections to use `min-height: 100%` so tall content can scroll on mobile.
- Kept the cemetery section at fixed height to preserve its internal parallax scroll container.

## Files Updated
- `src/sections/sections.css`

## Notes
- `npm run lint` fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Progress Rail Mobile Refinement

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added rail sizing variables and alignment to keep the connector line centered on dots.
- Reduced mobile dot size while preserving tap target, and removed the oversized active background.

## Files Updated
- `src/App.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Flow B Landing Layout + Copy Update

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added a Flow B-specific landing layout with left-aligned title, top-right file actions, and a bottom CTA.
- Updated Flow B landing copy to frame the user on the surface facing the graves.
- Adjusted Flow B form structure and labels; CTA now disables until input is provided.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`
- `src/App.tsx`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Progress Rail Gating + Hover Label Fix

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Disabled progress-rail hover labels (active label only) to prevent overlap on hover.
- Prevented user navigation to the processing/Unearthing step via the rail.
- Enforced input requirement before starting analysis in both flows.

## Files Updated
- `src/App.css`
- `src/App.tsx`
- `src/sections/Landing.tsx`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Flow B Landing Actions Moved Into Panel

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Moved the Flow B file/sample actions into the paste panel header instead of beside the title.
- Added panel header layout styles to keep the label and actions aligned.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Flow B Landing Actions Embedded In Textarea Shell

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Moved Flow B action buttons into the textarea shell and added a shared border/background wrapper.
- Added focus-within styling for the shell; removed textarea border for the integrated look.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Installed Agentation Dependency

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Installed `agentation` via npm for in-app annotation tooling.

## Files Updated
- `package.json`
- `package-lock.json`

## Notes
- Installation required network access to npm.

---

# Flow B Landing Copy + Centered Tagline

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Updated Flow B paste label copy to mention file types.
- Centered the Flow B surface tagline while keeping the layout left-aligned elsewhere.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Flow B Landing Panel Wrapper Removal

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Removed the extra Flow B panel wrapper so the input shell is the only container.
- Kept label/actions/textarea/meta/error inside the input shell for a single integrated box.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Agentation MCP Server (Local)

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Started `agentation-mcp` server in the background on the default port (4747).
- Log output captured at `/tmp/agentation-mcp.log`.

## Files Updated
- None

## Notes
- Server is an API endpoint (no UI). Root path returns `{"error":"Not found"}`.

---

# Agentation Toolbar Wired (Dev Only)

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added the Agentation React toolbar in dev mode and pointed it to the local MCP server at `http://localhost:4747`.

## Files Updated
- `src/App.tsx`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Flow B Input Panel Restyle

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Reworked the Flow B input panel to match the reference: label on top, textarea with its own border, and a bottom row with file/sample buttons.
- Simplified the input shell styling to be the primary panel (surface background + padding).

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity). Build succeeds.

---

# Gravestone Input Panel + Agentation Server Stop

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Gave the Flow B input panel a gravestone silhouette using a domed top border radius and full-width layout.
- Stopped the local Agentation MCP server running on port 4747.

## Files Updated
- `src/sections/sections.css`

## Notes
- Agentation MCP server was stopped (no process on 4747).

---

# Revert Gravestone Panel Shape

Date: 2026-02-06
Agent/Model: GPT-5.2 (Codex)

## Summary
- Reverted the domed gravestone border radius and padding on the Flow B input shell.

## Files Updated
- `src/sections/sections.css`

---

# Hex Map — Flow C Prototype (d3-force + d3-hexbin)

Date: 2026-02-06
Agent/Model: Claude Opus 4.6 (claude-code)

## Summary
- Added Flow C (`?flow=c`) with a hex tile map where each tab is an individual hexagon, clustered by category.
- Two layout modes togglable in the UI: **d3-force** (organic clustering via force simulation) and **d3-hexbin** (regular hex grid with nearest-center assignment).
- Reuses category colors and cluster center positions from `necropolisRegions.ts`.
- Basic interactions: hover tooltip (domain + category), click opens URL, D3 zoom (+/-/reset).
- Legend below map shows category colors sorted by count.
- This is a minimal prototype — polish items deferred to "Hex Map Backlog" section in `todo.md`.

## Files Created
- `src/lib/hexTileLayout.ts` — Hex geometry, force layout, hexbin layout
- `src/sections/HexMap.tsx` — Main component with mode toggle, zoom, tooltip, legend
- `src/sections/hexmap.css` — Styles for hex tiles, tooltip, controls, legend

## Files Updated
- `src/sections/config.ts` — Added Flow C variant and SECTIONS_C
- `src/App.tsx` — Import HexMap, add flow=c routing, render hexmap section, update footer nav
- `todo.md` — Added "Hex Map Backlog" section
- `package.json` / `package-lock.json` — Added d3-force, d3-hexbin, @types/d3-force, @types/d3-hexbin

## Notes
- `npm run build` passes clean.
- Access via `?flow=c` in the URL.
- The hexbin layout uses a greedy nearest-center assignment which may not produce ideal clusters for very uneven category sizes. Force layout generally looks better.

---

# Tombstone Landing Page + Input Validation + Mobile Responsive Fixes

Date: 2026-02-06
Agent/Model: Claude Opus 4.6 (claude-code)

## Summary
- Redesigned the landing page for **both Flow A and Flow B** into a unified tombstone-shaped container with an arched top (`border-radius: 280px 280px 0 0`).
- Removed the separate Flow B landing layout — both flows now share the same tombstone design (they still diverge at the map stage: Necropolis for A, WorldMap for B).
- Tombstone contains: gold "EXHUME.LINK" title (Cinzel), four-line epitaph, bordered input panel with textarea + file upload + test dataset buttons.
- CTA button and privacy note sit below the tombstone.
- Added **URL validation**: CTA button only enables when textarea contains a valid URL or a file is attached.
- Added **blood-drip error toast**: if analysis fails, user is returned to landing with a fixed-position error toast styled with CSS blood-drip animations.
- Epitaph has a horizontal separator (border-bottom) between it and the input panel.
- **Mobile responsive fixes**:
  - Progress rail connecting line now uses `--rail-hit-size` for vertical alignment, fixing line floating above dots on mobile.
  - Synced actual padding with `--rail-pad-y` variable at 768px breakpoint.
  - Added 480px narrow-screen breakpoint: smaller rail dots (28px hit / 8px visual), hidden dot labels, tighter gaps.
  - Added 480px tombstone breakpoint: smaller arch, `text-lg` title, `text-sm` epitaph, reduced CTA sizing.
- Cleaned up all unused Flow B landing-specific CSS classes.

## Files Updated
- `src/sections/Landing.tsx` — Unified tombstone layout, removed `variant` prop, added URL regex validation
- `src/sections/sections.css` — Tombstone styles, error toast, removed Flow B landing classes, added 480px breakpoint
- `src/App.tsx` — Removed `variant={flow}` prop from Landing
- `src/App.css` — Fixed rail line alignment, synced mobile padding, added 480px narrow-screen rules

## Notes
- `npm run build` passes clean.
- Flow variant logic unchanged — still uses `resolveFlowVariant()` for A/B section selection at the map stage.

---

# Necropolis Tabs + Hex Map Horizontal Flow

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added a tab switch on the Necropolis page to toggle between the fantasy cartography map and the Hex Map.
- Reworked the Hex Map into a panel with a fixed top bar + bottom legend, closer default zoom, and straight (non-wavy) region labels.
- Widened the hex map layout for horizontal flow (larger map + hexes, updated centers, hexbin extent).

## Files Updated
- `src/sections/NecropolisMap.tsx`
- `src/sections/necropolis.css`
- `src/sections/HexMap.tsx`
- `src/sections/hexmap.css`
- `src/lib/hexTileLayout.ts`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity).
- `npm run build` passes.

---

# Hex Map Borders + Hexbin Default

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Set Flow C hex map default layout to Hexbin.
- Made hex tiles transparent with colored borders; hover now brightens stroke and glow.

## Files Updated
- `src/sections/HexMap.tsx`
- `src/sections/hexmap.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity).
- `npm run build` passes.

---

# Force Layout Continent Squeeze (Flow C)

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Switched Flow C default hex layout back to d3-force.
- Pulled force-layout cluster centers closer together with a squeeze toward map center for a more continent-like mass.

## Files Updated
- `src/sections/HexMap.tsx`
- `src/lib/hexTileLayout.ts`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity).
- `npm run build` passes.

---

# Force Cluster Tightening + Global Gravity

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Tightened force-layout clustering by increasing center squeeze on X while leaving Y spread unchanged.
- Added a light global gravity (stronger on X, weaker on Y) to keep the blob more contiguous without flattening vertically.

## Files Updated
- `src/lib/hexTileLayout.ts`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity).
- `npm run build` passes.

---

# Flow C Obsidian Background + Runes

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added a Flow C-only atmospheric background for the Hex Map section: obsidian stone texture, mist, glowing rune pattern, and vignette.

## Files Updated
- `src/sections/hexmap.css`

## Notes
- `npm run lint` still fails due to existing `Math.random` usage in `src/sections/NecropolisMap.tsx` (react-hooks/purity).
- `npm run build` passes.

---

# Lint Fix: Deterministic Terrain Icon Scale

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Replaced `Math.random` in NecropolisMap terrain icon scale with deterministic FBM-based noise for lint purity.

## Files Updated
- `src/sections/NecropolisMap.tsx`

## Notes
- `npm run lint` now passes.
- `npm run build` passes.

---

# Flow C SVG Background (Arcane Stone)

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Moved the atmospheric background to the Hex Map SVG itself (stone texture, mist, runes, vignette) and scoped it to Flow C via a `backgroundVariant` prop.
- Restored the section-level background to neutral so only the map canvas changes in Flow C.

## Files Updated
- `src/sections/HexMap.tsx`
- `src/sections/NecropolisMap.tsx`
- `src/sections/hexmap.css`

## Notes
- `npm run lint` passes.
- `npm run build` passes.

---

# Hex Map Background + Filled Tiles

Date: 2026-02-07
Agent/Model: GPT-5.2 (Codex)

## Summary
- Moved the Hex Map background layers to be viewport-locked (no visible edge on pan/zoom) and removed rune overlay.
- Restored filled hex tiles with a subtle dark stroke and hover glow.

## Files Updated
- `src/sections/HexMap.tsx`
- `src/sections/hexmap.css`

## Notes
- `npm run lint` passes.
- `npm run build` passes.

---

# Landing Modal Click Guard (Safari)

Date: 2026-02-19
Agent/Model: GPT-5.2 (Codex)

## Summary
- Prevented form submission/propagation from the “How to export tabs” and “Privacy policy” buttons so modal state updates can render reliably.
- Left existing Safari debug logging intact for verification.

## Files Updated
- `src/sections/Landing.tsx`

## Notes
- `npm run lint` fails due to pre-existing issues in `src/App.tsx` and `src/sections/Cemetery.tsx`.
- `npm run build` passes.

---

# Safari Modal Root + Overflow Guard

Date: 2026-02-20
Agent/Model: GPT-5.2 (Codex)

## Summary
- Added a dedicated `#modal-root` and routed landing modals through it.
- Switched modal overlay to `position: absolute` inside the fixed modal root to avoid Safari fixed-position clipping.
- Toggled `modal-open` on both `html` and `body` while a modal is open to override overflow clipping in Safari.
- Cleaned modal click handlers to remove debug logging.

## Files Updated
- `index.html`
- `src/index.css`
- `src/sections/sections.css`
- `src/sections/Landing.tsx`

## Notes
- Safari click/overlay issues likely tied to overflow/scrollbar suppression; avoid `::-webkit-scrollbar { display: none; }` in scroll containers.

---

# Modal Class Rename + Safari Transform Override

Date: 2026-02-20
Agent/Model: GPT-5.2 (Codex)

## Summary
- Renamed modal classes from `privacy-modal*` to generic `modal*` across landing modals and styles.
- Added a modal-open override to remove `translateZ(0)` transforms on `.section-slide` and `.section-viewport` while a modal is open to avoid Safari overlay clipping.

## Files Updated
- `src/sections/Landing.tsx`
- `src/sections/sections.css`
- `src/App.css`

---

# Unused Code/Data Review

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Reviewed current branch for unused components, data, assets, and deps.
- Flagged dead sections (Overview/Privacy/GrimReport), unused mock exports, and orphaned assets/deps for removal.
- No code changes made beyond logging this review.

## Files Updated
- `memory.md`

---

# Remove Unused Dependency (agentation)

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Removed unused `agentation` dependency from the project.
- Updated lockfile accordingly.

## Files Updated
- `package.json`
- `package-lock.json`
- `memory.md`

---

# Lich Easter-Egg Dataset

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Added a Lich-tuned sample URL list for the title-click easter egg.
- Wired the landing sample import to use the new Lich dataset.
- Lint still fails on pre-existing App/Cemetery issues; build passes.

## Files Updated
- `browserdata/lich_tabs.txt`
- `src/App.tsx`
- `memory.md`

---

# Scripts Pointed to Lich Dataset

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Updated local debug/verify scripts to use `browserdata/lich_tabs.txt` as the sample input.
- Adjusted expected scorer output to Lich of the Shadows.

## Files Updated
- `scripts/verify-scorer.ts`
- `scripts/debug-categories.ts`
- `scripts/debug-other.ts`
- `memory.md`

---

# Project Timeline Doc

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Generated a git-history-based timeline document with milestones and commit list.
- Added flow A/B/C screenshot guidance and capture steps.

## Files Updated
- `docs/project-timeline.md`
- `memory.md`

---

# Timeline Note on Playwright Screenshots

Date: 2026-02-20
Agent/Model: GPT-5 (Codex)

## Summary
- Added an explicit optional note about Playwright-based automated screenshots in the timeline doc.

## Files Updated
- `docs/project-timeline.md`
- `memory.md`
