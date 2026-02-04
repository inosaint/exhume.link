# exhume.link — Build Phases

Read `claude.md` first. It has all design decisions, the scoring rubric, and data file locations.

---

## Phase 0: Foundation & Scoring ← START HERE

- [ ] Set up Vite + React + TypeScript project (`npm create vite`)
- [ ] Install deps: react, react-dom, typescript, vite
- [ ] Implement URL parser: extract domain from raw URL, dedupe, count
- [ ] Implement category classifier: domain → category (10 categories, see claude.md)
- [ ] Implement personality scorer: category tallies → weighted scores → archetype + suffix
- [ ] Wire up: load `browserdata/all_tabs_clean.txt` as static import, run parser + scorer, log output
- [ ] Verify: scorer produces expected result against known dataset (Resurrectionist of the Horde)

## Phase 1: Visual Shell & Navigation

- [ ] Dark gothic design system: CSS custom properties for color palette, spacing scale
- [ ] Typography: Google Fonts — Cinzel (headings), Inter (body). Import in index.html
- [ ] Section shell: 5 sections rendered, click-based Next / Prev navigation
- [ ] Section titles: Landing, Processing, Overview, Cemetery, World Map
- [ ] `prefers-reduced-motion` media query: disable all CSS transitions and animations globally when set
- [ ] Responsive layout scaffold: mobile breakpoint at 768px

## Phase 2: Processing Beat

- [ ] Processing section: fake staged loading with flavor text
  - "Unearthing your digital remains..."
  - "Cross-referencing the dead..."
  - "Preparing the resurrection..."
- [ ] Staged reveal: each line appears on a timer (~600ms apart), auto-advances to Overview after ~2s
- [ ] Motion-reduced fallback: skip animation, show all text, add manual "Continue" button

## Phase 3: Overview & Personality Reveal

- [ ] Stats cards: Total Tabs, Unique Domains, Browsers (Safari / Quiche), Top Domain
- [ ] Personality card: archetype name in Cinzel, flavor subtitle, short description
- [ ] Stats cards animate in on section enter (counter tick-up). Motion fallback: show final number immediately
- [ ] Visual style: stats as tombstone-shaped cards on dark ground

## Phase 4: The Cemetery (Category Scene)

- [ ] Gravestone SVG component: base shape, category icon slot, hover states
- [ ] Hover behavior: slight rotation (3-5deg) + glow (box-shadow) + shadow shift. Motion fallback: glow only
- [ ] Click behavior: opens the URL in a new tab
- [ ] Group gravestones by category. Each group has a category header
- [ ] Desktop: grid layout within each category group
- [ ] Mobile: each category group is a horizontal scrollable row
- [ ] Parallax depth on scroll within this section (background layers shift at different speeds). Motion fallback: static layers

## Phase 5: The World Map

- [ ] Domain-to-region mapping: static lookup table (top ~20 domains → approximate lat/lng)
  - e.g. medium.com → San Francisco, youtube.com → Mountain View, amazon.in → Bangalore, reddit.com → San Francisco
- [ ] Render world map (SVG-based, react-simple-maps or hand-rolled)
- [ ] Plot grave markers at mapped locations. Cluster nearby graves
- [ ] Mobile: pinch-to-zoom or zoom buttons
- [ ] Hover on grave marker: tooltip with domain name + tab count

## Phase 6: Share Card

- [ ] Canvas-rendered summary card (1200x630 for OG)
- [ ] Card contents: "exhume.link" logo text, archetype, top 3 stats, a few category icons
- [ ] Gothic dark aesthetic on the card, Cinzel font rendered to canvas
- [ ] "Share" button: renders card → copies PNG to clipboard + offers download
- [ ] Share button placement: end of the Overview section (after personality reveal)

---

## Backlog (not scheduled)

- [ ] Shareable URL: encode processed JSON → compressed base64 URL param. Recipient loads URL and sees the same data without uploading
- [ ] Open Graph / Twitter Card meta tags: dynamically set based on the rendered data so link previews show the card
- [ ] Ambient soundscape: opt-in toggle, looping low-reverb audio. Plays across all sections. Mutes on `prefers-reduced-motion`
- [ ] Input screens: paste URLs into textarea or upload CSV. Runs the same parser pipeline. Replaces the static data load
- [ ] LLM categorization: optional v2 mode where categories are assigned via API call instead of rule-based matching
