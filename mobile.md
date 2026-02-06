# Mobile Responsiveness and Usability Improvements

## High Impact
- Increase tap targets to at least 44px for `.rail-dot`, `.worldmap__control`, `.nav-btn`, and `.share-card-button` in `src/App.css`, `src/sections/sections.css`, and `src/components/ShareCard.css`.
- Show progress labels on touch devices by revealing `.rail-dot__label` under `@media (hover: none)` in `src/App.css`.
- Make the share modal scroll on short screens by adding `max-height: 90svh` and `overflow: auto` to `.share-card-modal__content` in `src/components/ShareCard.css`.
- Improve map tooltip legibility on small screens by rendering the tooltip outside the SVG or switching to a bottom sheet for selections in `src/sections/WorldMap.tsx` and `src/sections/sections.css`.
- Add safe-area padding for notches/home indicators using `env(safe-area-inset-*)` for `.progress-rail`, `.nav-footer`, and modal panels in `src/App.css`, `src/sections/sections.css`, and `src/components/ShareCard.css`.

## Layout and Scrolling
- Enable momentum scrolling on iOS by adding `-webkit-overflow-scrolling: touch` to `.section-viewport` and `.cemetery__scroll-container` in `src/App.css` and `src/sections/sections.css`.
- Use `100svh` (with fallback) for `.app` to reduce iOS address bar jumpiness in `src/App.css`.
- Add a narrow breakpoint (around 480px) to stack `.nav-footer` into a column layout so long labels do not collide in `src/App.css`.

## Typography and Content Density
- Increase small-text sizes or use `clamp()` for labels so text remains legible on narrow screens in `src/index.css` and `src/sections/sections.css`.
- Reduce the landing title letter spacing on small screens in `src/sections/sections.css`.

## Map Usability
- Increase map control size and consider relocating controls to the bottom-right on mobile in `src/sections/sections.css`.
- Revisit `touch-action: none` on `.worldmap__svg` to allow vertical scroll with `touch-action: pan-y pinch-zoom` if map drag is too sticky on mobile in `src/sections/sections.css`.

## Cards and Imagery
- Make the portrait responsive by using a `min(60vw, 220px)` width and allowing height to auto-scale to reduce aggressive cropping on phones in `src/sections/sections.css`.

## Share UX
- Add `navigator.share` as a primary option on supported mobile browsers with clipboard/download as fallbacks in `src/components/ShareCard.tsx`.
