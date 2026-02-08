# exhume.link — Build Phases

Read `claude.md` first. It has all design decisions, the scoring rubric, and data file locations.

---

## Phase 0: Foundation & Scoring

Scoring **design** is done — 6 archetypes, 8 dimensions, 3 axes. Full spec in
`docs/personality-scoring.md`. The items below are the **implementation** work.

- [x] Define personality scoring rubric — see `docs/personality-scoring.md`
- [x] Set up Vite + React + TypeScript project (`npm create vite`)
- [x] Install deps: react, react-dom, typescript, vite
- [x] Implement URL parser: extract domain from raw URL, dedupe, count
- [x] Implement category classifier: domain → content-type buckets (see docs/personality-scoring.md §Step 1)
- [x] Implement 8-dimension scorer: content-type counts → dimension scores → 3-axis position → archetype + suffix
- [x] Wire up: load `browserdata/all_tabs_clean.txt` as static import, run parser + scorer, log output
- [x] Verify: scorer produces expected result against known dataset (Resurrectionist of the Horde) ✅

## Phase 1: Visual Shell & Navigation

- [x] Dark gothic design system: CSS custom properties for color palette, spacing scale
- [x] Typography: Google Fonts — Cinzel (headings), Inter (body). Import in index.html
- [x] Section shell: 7 sections rendered, click-based Next / Prev navigation
- [x] Section titles: Surface, Unearthing, The Dead, The Ledger, Cemetery, The Map, Share
- [x] `prefers-reduced-motion` media query: disable all CSS transitions and animations globally when set
- [x] Responsive layout scaffold: mobile breakpoint at 768px

## Phase 2: Processing Beat

- [x] Processing section: staged loading with flavor text tied to real analysis steps
  - "Gathering the bones…"
  - "Listening for links…"
  - "Scraping rust from URLs…"
  - "Counting the haunts…"
  - "Sorting remains into plots…"
  - "Pinning souls to the globe…"
  - "Consulting the archetypes…"
- [x] Staged reveal: each line appears as analysis progresses, auto-advances when done
- [x] Motion-reduced fallback: skip animation, show all text, add manual "Continue" button

## Phase 3: Personality Reveal + The Ledger

- [x] Dedicated archetype reveal page: full-screen personality card with art, title, description
- [x] "Dig Deeper →" CTA to advance to stats
- [x] Stats cards on separate "Ledger" page: Total Tabs, Unique Domains, Haunts, Unresolved Searches, Mapped Locations, Top Domain
- [x] Stats cards animate in on section enter (counter tick-up). Motion fallback: show final number immediately

## Phase 4: The Cemetery (Category Scene)

- [x] Gravestone SVG component: base shape, category icon slot, hover states
- [x] Hover behavior: slight rotation (3-5deg) + glow (box-shadow) + shadow shift. Motion fallback: glow only
- [x] Click behavior: opens the URL in a new tab
- [x] Group gravestones by category. Each group has a category header
- [x] Desktop: grid layout within each category group
- [x] Mobile: each category group is a horizontal scrollable row
- [x] Parallax depth on scroll within this section (background layers shift at different speeds). Motion fallback: static layers

## Phase 5: The Necropolis (Fantasy Map) — Flow A

- [x] Perlin noise utility: 2D noise, FBM, noisy polygon generation, smooth SVG path output
- [x] Region definitions: 12 categories → fantasy regions with positions, terrain types, fill colors
- [x] Procedural continent coastline: convex hull of all regions + noise-based organic edges
- [x] Individual region polygons: Perlin-noise boundaries, sized by tab count
- [x] Terrain icons: geometric placeholder symbols per region type (books, compass, anvil, etc.)
- [x] Compass rose: procedural SVG with cardinal/intercardinal points
- [x] Edge decorations: wavy ocean lines, "Here be dragons" text, sea serpent hint
- [x] Map cartouche: "THE NECROPOLIS" title banner
- [x] Parchment texture: SVG filter (feTurbulence), vignette gradient, sepia palette
- [x] Region tooltips: hover shows name, description, tab count, top domains
- [x] Legend: interactive region list below map, sorted by count, hover-linked to map
- [x] Zoom controls (+/−/reset) via D3 zoom
- [x] Wired into Flow A, replacing geographic WorldMap (Flow B keeps WorldMap)

## Phase 5b: The World Map — Flow B (geographic, retained)

- [x] Domain-to-region mapping: known domains + ccTLD fallback for geo-location
- [x] Render world map (D3 geo + TopoJSON)
- [x] Plot grave markers at mapped locations. Cluster by city
- [x] Zoom controls (+/−/reset)
- [x] Hover on grave marker: tooltip with domain name + tab count

## Phase 6: Share Card

- [x] Canvas-rendered summary card (1200x630 for OG)
- [x] Card contents: archetype art, title, description, top stats
- [x] Gothic dark aesthetic on the card, Cinzel font rendered to canvas
- [x] "Share with Your Cult" button: opens modal with copy/download/link options
- [x] Shareable URL with encoded JSON snapshot

---

## Next up

- [ ] Mobile testing on real device — CSS fixes are in, needs visual QA
- [ ] DNS: point `exhume.link` A records to GitHub Pages IPs (185.199.108–111.153) and set custom domain in repo Settings → Pages

## Hex Map Backlog (Flow C — `?flow=c`)

Basic hex map prototype is live with two layout modes (force / hexbin). Toggle between them in the UI.
Polish and advanced features below:

- [ ] Wasteland gap-fill + drift behavior: split "other" hexes into gap-fillers (weak center pull) and drifters (outward push + fading opacity)
- [ ] Parchment background filter (reuse `ParchmentDefs` from NecropolisMap)
- [ ] Compass rose decoration (reuse `CompassRose` from NecropolisMap)
- [ ] Legend hover highlighting: dim all non-hovered-category hexes to `opacity: 0.3`
- [ ] Category labels: improve positioning (avoid overlap, offset from cluster centroid)
- [ ] Opacity fading on outer wasteland hexes (distance-from-center gradient)
- [ ] `prefers-reduced-motion`: disable hover scale transitions
- [ ] Mobile: long-press tooltip, initial zoom level adjustment
- [ ] Edge decorations and map border styling
- [ ] Performance: test with 2000+ tabs, consider canvas fallback if SVG lags
- [ ] Decide on final layout (force vs hexbin) and remove the other
- [ ] Hex tile click feedback animation (brief flash)
- [ ] Shared-domain bridges between clusters (optional visual connection)

## Backlog (not scheduled)

- [ ] Open Graph / Twitter Card meta tags: dynamically set based on the rendered data so link previews show the card
- [ ] Ambient soundscape: opt-in toggle, looping low-reverb audio. Plays across all sections. Mutes on `prefers-reduced-motion`
- [ ] LLM categorization: optional v2 mode where categories are assigned via API call instead of rule-based matching
- [ ] Necropolis map: replace geometric terrain icons with hand-drawn SVGs (see `docs/necropolis-map-assets.md`)
- [ ] Necropolis map: add custom compass rose SVG
- [ ] Necropolis map: add sea monster / edge decoration SVGs
- [ ] Necropolis map: finalize color palette and font choice with user
- [ ] Necropolis map: click region to show all tabs in that category
- [ ] Improve category classifier to reduce "other" bucket (currently ~248/689 for sample data)
- [ ] "How to export your tabs" guide — step-by-step instructions for Chrome, Safari, Firefox, Arc, etc. (copy tab URLs, use built-in export, or third-party tools like OneTab). Show on landing page or as a help link next to the paste input
