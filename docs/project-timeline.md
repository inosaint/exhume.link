# Project Timeline (from Git history)

This timeline is derived directly from `git log` and grouped by date. The goal is to give you a clean, article-ready narrative of how the project formed over time.

**Milestones**
1. 2026-02-04: Project bootstrapped, design system established, and Phases 1-6 implemented (Processing -> Overview -> Cemetery -> World Map -> Share Card).
2. 2026-02-06: Large integration drop: analysis pipeline, Necropolis map, flow variants (A/B/C), debug scripts, and major asset updates.
3. 2026-02-08 to 2026-02-10: Trading card evolution, share UX iterations, narrative revisions, new archetypes, and PostHog analytics.
4. 2026-02-10 to 2026-02-11: Mobile Safari fixes, Chrome autoplay/debug work, and removal of Flow B/C in favor of Flow A only.
5. 2026-02-14 to 2026-02-20: Safari modal fixes and landing UX refinements; sample data moved to title easter egg.

**Full Commit Timeline**
- 2026-02-04 0605655 Initial commit
- 2026-02-04 66cd9c2 Uploading Claude.ai's initial proof of concept
- 2026-02-04 312a3f1 Add project planning docs: claude.md and todo.md
- 2026-02-04 546964c Add 6-archetype personality scoring spec, update planning docs
- 2026-02-04 2b554a0 Phase 1: Vite + React + TS scaffold with gothic design system
- 2026-02-04 92138e4 Fix nav footer below-fold bug
- 2026-02-04 f363ca7 Merge pull request #1 from inosaint/claude/browser-tabs-visualization-ARrHr
- 2026-02-04 87757c0 Phase 2: Processing Beat - staged flavor-text reveal
- 2026-02-04 04ec603 Merge pull request #2 from inosaint/claude/check-uncommitted-changes-4O0hD
- 2026-02-04 47ee720 Phase 3: Overview & Personality Reveal
- 2026-02-04 3b3ff65 Merge pull request #3 from inosaint/claude/add-personality-placeholder-image-A7wID
- 2026-02-04 fe9bd4a Add mock data structure for Cemetery and World Map sections
- 2026-02-04 3bfd954 Phase 4: The Cemetery - category scene with gravestones
- 2026-02-04 18688b2 Phase 5: The World Map - domain location visualization
- 2026-02-04 22776ac Phase 6: Share Card - Canvas-rendered summary image
- 2026-02-04 5424405 Updating images
- 2026-02-04 0b84ba8 Merge branch 'main' of https://github.com/inosaint/exhume.link
- 2026-02-05 839b45e Updating images
- 2026-02-06 74746c0 Updating all the changes
- 2026-02-06 4978241 Merge origin/main - resolve binary PNG conflicts (keep branch versions)
- 2026-02-06 d7ef7a4 Fixing PNG duplication
- 2026-02-06 d13852b Merge pull request #4 from inosaint/claude/check-uncommitted-work-YqZ32
- 2026-02-06 3aebad5 Fixing build errors
- 2026-02-06 3921b2b Merge pull request #5 from inosaint/claude/check-uncommitted-work-YqZ32
- 2026-02-06 71faa8c Update Images and landing page
- 2026-02-06 61d4e11 Merge pull request #6 from inosaint/landing-page-tombstone
- 2026-02-08 04c03d8 Making some narrative changes
- 2026-02-08 915889b Merge pull request #7 from inosaint/hex-maps
- 2026-02-08 00c51c1 Add 3D trading card design and social network sharing
- 2026-02-08 a282531 Update holographic gradient to gothic color palette
- 2026-02-09 6ff3e68 Redesign trading card with cleaner UI and add preview
- 2026-02-09 88ab808 Add interactive 3D trading card to Share page
- 2026-02-09 a354b99 Add advanced holographic effects to 3D trading card
- 2026-02-09 f065903 Merge pull request #8 from inosaint/claude/trading-card-share-design-YBWqy
- 2026-02-09 c00b123 Redesign share card to match preview archetype card
- 2026-02-09 76d16dd Update package-lock.json after npm install
- 2026-02-09 744c27b Constrain share card to fit within viewport on all devices
- 2026-02-09 a655b2a Fix share section scroll by removing min-height: 100vh
- 2026-02-09 e24f4ca Add stat tooltips, Rot stat, and refine trading card & Share page
- 2026-02-09 0e32c41 Add gravestone favicons, category tooltips, and UI refinements
- 2026-02-09 ad97a75 Redesign share modal with square tiles, use html-to-image for card capture
- 2026-02-09 518e451 Add finalized volume suffix tiers for archetype titles
- 2026-02-09 a1d8a55 Update personality-scoring.md with 6-tier volume suffix and update memory.md
- 2026-02-09 43542b8 Merge pull request #9 from inosaint/claude/fix-share-card-design-tpk1o
- 2026-02-09 bddf109 Replace archetypes: Resurrectionist->Warlock, Seance Master->Wraith, Plague Doctor->Bone Cleric
- 2026-02-09 2720ec1 Redesign trading card to match Figma mockup
- 2026-02-09 fb49bc2 Add bottom fade mask on portrait and give text more room
- 2026-02-10 8ef1466 Merge pull request #10 from inosaint/claude/figma-mcp-access-70NoQ
- 2026-02-09 55bdd27 Redesign trading card to match Figma mockup
- 2026-02-09 dad99af Add bottom fade mask on portrait and give text more room
- 2026-02-10 0f103bc Adding 2 new archetypes
- 2026-02-10 939df1d Merge branch 'claude/trading-card-design-J49xr' of https://github.com/inosaint/exhume.link into claude/trading-card-design-J49xr
- 2026-02-09 d88c553 Add Unburdened-specific verdict template
- 2026-02-09 01709c7 Add Mor'tab the Unending verdict template
- 2026-02-09 0e486d4 Add Mor'tab verdict + skip Unburdened to share card
- 2026-02-10 32bb8a7 Merge pull request #11 from inosaint/claude/trading-card-design-J49xr
- 2026-02-10 8421753 Add PostHog analytics with privacy policy
- 2026-02-10 2c5d80f Merge pull request #12 from inosaint/claude/add-posthog-analytics-8egUZ
- 2026-02-10 4ff6496 Update deployment workflow to include PostHog environment variables
- 2026-02-10 6ff756c Expose PostHog globally in development for debugging
- 2026-02-10 9c51939 Enable PostHog debug mode and localhost tracking in development
- 2026-02-10 e7e2353 Merge pull request #13 from inosaint/claude/posthog-analytics-pr-26sUX
- 2026-02-10 21d4ac2 Fix privacy modal styling for Safari compatibility
- 2026-02-10 b60054f Fix janky transition from Processing to Personality section
- 2026-02-10 601ef2b Fix unburdened archetype to use correct image
- 2026-02-10 bce9301 Fix mortab archetype to use correct image
- 2026-02-10 75b210a Add rarity-based border colors to trading cards
- 2026-02-10 1d9e0b7 Fix PostHog archetype tracking to use full titles
- 2026-02-10 54775e1 Add gold highlighting to verdict text for better readability
- 2026-02-10 24da031 Enhance trading card 3D depth and update legendary color
- 2026-02-10 749e18d Fix description text overflow on trading cards
- 2026-02-10 244c74d Swap rarity colors for better thematic fit
- 2026-02-10 3e546ef Delay footer appearance on personality section to prevent layout jump
- 2026-02-10 ad1894b Change unburdened (common) border to rich brown
- 2026-02-10 aa8d400 Implement thematic rarity colors with luminosity scaling
- 2026-02-10 9b5bc1e Revert to gold borders and text, comment out rarity colors
- 2026-02-10 d0fd67a Fix rarity badge text vertical centering and letter-spacing
- 2026-02-10 cc16888 Slow down verdict text fade and delay button appearance
- 2026-02-10 bc1d116 Sync button appearance with verdict text fade-in
- 2026-02-10 3756817 Reduce gap between stat icons and labels
- 2026-02-10 843757f Apply tighter stat icon spacing only on desktop
- 2026-02-10 fe75634 Remove letter-spacing from stat labels on desktop
- 2026-02-10 25edc8a More images and test cases added
- 2026-02-10 ebaac06 Merge pull request #14 from inosaint/claude/fix-privacy-modal-styling-wCjCN
- 2026-02-10 96c8429 Fix card visibility for rot value of 0 and resolve TypeScript build errors
- 2026-02-10 1c1415f Remove analytics text from landing page to fix Safari scroll issue
- 2026-02-10 54ccda0 Add null fallbacks to all ledger cards and reduce landing padding
- 2026-02-10 15c4b1b Revert tombstone padding back to original
- 2026-02-10 c4df38b Reduce landing page top padding with inline style to fix Safari scroll
- 2026-02-10 4189616 Merge pull request #15 from inosaint/claude/fix-card-visibility-build-GHAYo
- 2026-02-10 45f0291 Fix mobile Safari scroll, touch, and performance issues
- 2026-02-10 4ed0e55 Remove flow B/C variants - only flow A is used
- 2026-02-10 e926132 Fix Chrome stuck on Unearthing stage
- 2026-02-10 a3d8553 Remove dead code from flow B/C removal
- 2026-02-11 a552935 Merge pull request #16 from inosaint/claude/fix-mobile-safari-issues-XuqVg
- 2026-02-11 ce02979 Add comprehensive debugging for Chrome autoplay and cemetery visibility issues
- 2026-02-11 92935ed Improve card layout and replace share modal with direct download
- 2026-02-11 f58c05d Fix handleDownload reference error by reordering hooks
- 2026-02-11 2ebe625 Merge pull request #17 from inosaint/claude/fix-chrome-autoplay-bug-AevFz
- 2026-02-11 023f348 Fix dig detection threshold - lower from 0.12 to 0.02
- 2026-02-11 1e977fd Merge pull request #18 from inosaint/claude/fix-chrome-autoplay-bug-AevFz
- 2026-02-11 516edfa Fix Safari mobile rendering issues with content truncation
- 2026-02-12 6e83017 Updating readme.md
- 2026-02-12 82ff75b Update Readme.md
- 2026-02-12 971cb60 Merge pull request #19 from inosaint/read-me
- 2026-02-14 58571af Make footer fixed position on mobile Safari
- 2026-02-14 f360e4a Merge pull request #20 from inosaint/claude/fix-safari-render-issue-LrGHn
- 2026-02-19 f430057 Replace 'Test dataset' with 'How to export tabs' guide, move sample data to title easter egg
- 2026-02-19 6d2286f Hide scrollbar on landing page
- 2026-02-19 8739a43 Fix How To modal links not working in Safari
- 2026-02-19 53cef12 Fix modal width and Safari click/tap issues
- 2026-02-19 53fbc17 Fix Safari click breakage caused by scrollbar hiding
- 2026-02-19 8568297 Remove PostHog debug logging
- 2026-02-19 730706c Add Safari click debug logging
- 2026-02-19 db631a2 Remove Agentation dev tool
- 2026-02-19 b195455 Fix Safari modal visibility: remove transform hack, add render logs
- 2026-02-19 478a566 Fix Safari modal invisibility: remove overflow:hidden from body
- 2026-02-20 1b42371 Trying out a fix
- 2026-02-20 30e2844 fixing the safari modal bug

**Flow Explorations & Screenshot Targets**
1. Flow A (current): use your current HEAD.
2. Flow B: use commit `74746c0` ("Updating all the changes"). This is where `?flow=b` is introduced.
3. Flow C (Hex Map): use commit `915889b` ("Merge pull request #7 from inosaint/hex-maps").

**Screenshot Capture Steps (manual)**
1. `git worktree add /tmp/exhume-flow-b 74746c0`
2. `cd /tmp/exhume-flow-b`
3. `npm install`
4. `npm run dev`
5. Open `http://localhost:5173/?flow=b` and capture Flow B.
6. Repeat with Flow C: `git worktree add /tmp/exhume-flow-c 915889b` then open `http://localhost:5173/?flow=c`.
7. For Flow A, use current repo (`npm run dev`) and open `http://localhost:5173/`.

**Optional (automation)**
- I can add a Playwright-based screenshot capture script if you want automated screenshots. It requires installing Playwright browsers locally (network access).

Note: If you want me to generate screenshots automatically, I can set up a Playwright capture script, but it requires installing Playwright browsers locally (network access).
