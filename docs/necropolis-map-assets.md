# The Necropolis — Asset Tasks

What I need from you to build the procedural fantasy map. Each section is one
deliverable — do them in any order. Mark ✅ when done or write "skip" if you
want me to generate a placeholder instead.

---

## 1. Region Names (text only)

Confirm or revise these. I'll use them as labels on the map and in tooltips.

| Category     | Proposed Name           | Your call |
|-------------|------------------------|-----------|
| Reading     | The Catacombs of Ink    |           |
| Design & UX | The Atelier             |           |
| Tools       | The Ossuary Forge       |           |
| Portfolios  | The Gallery of the Dead |           |
| Social      | The Haunting Grounds    |           |
| Video       | The Phantom Theatre     |           |
| News        | The Herald's Tower      |           |
| Shopping    | The Bone Market         |           |
| Jobs        | The Guild Hall          |           |
| Events      | The Gathering Stones    |           |
| Travel      | The Docks               |           |
| Other       | The Wasteland           |           |

Also: should empty regions (0 tabs) be hidden, greyed/fogged, or always shown?

---

## 2. Terrain Icons (per region)

Small SVG symbols (~40×40px) that repeat inside each region to convey terrain.
I can generate simple geometric versions procedurally, but hand-drawn ones
would look much better on parchment.

If you want to provide these:
- Format: SVG, single color (I'll tint them with the parchment palette)
- One icon per region, listed below with suggested motifs

| Region               | Suggested motif                        | Asset file              |
|---------------------|----------------------------------------|------------------------|
| Catacombs of Ink    | Stacked books / scroll                 | `icons/scriptorium.svg` |
| The Atelier         | Compass / pen nib / grid               | `icons/atelier.svg`     |
| Ossuary Forge       | Anvil / gear / hammer                  | `icons/forge.svg`       |
| Gallery of the Dead | Portrait frame / bust                  | `icons/gallery.svg`     |
| Haunting Grounds    | Speech bubbles / whisper marks         | `icons/haunting.svg`    |
| Phantom Theatre     | Mask / screen / curtain                | `icons/theatre.svg`     |
| Herald's Tower      | Tower / scroll / raven                 | `icons/herald.svg`      |
| Bone Market         | Market stall / skull / lantern         | `icons/market.svg`      |
| Guild Hall          | Shield / contract / quill              | `icons/guild.svg`       |
| Gathering Stones    | Standing stones / campfire             | `icons/stones.svg`      |
| The Docks           | Ship / anchor / compass                | `icons/docks.svg`       |
| The Wasteland       | Dead tree / fog wisps / cracked ground | `icons/wasteland.svg`   |

**If you write "skip":** I'll use simple geometric shapes (triangles for
mountains, circles for towers, etc.) and we can swap in real icons later.

---

## 3. Compass Rose

A decorative compass rose for the bottom-right corner of the map.

- Format: SVG, max ~200×200px
- Style: gothic / ornate — think old nautical charts with skull or bone motifs
- Single color is fine (I'll tint it)

**If you write "skip":** I'll generate a simple procedural one with basic
cardinal points.

---

## 4. Sea Monsters / Edge Decorations

Optional flourishes for the ocean areas around the continent.

- 1–3 small SVG illustrations: sea serpent, kraken tentacle, whale skeleton
- Format: SVG, single color
- Placed in empty ocean space to fill the map edges

**If you write "skip":** I'll add wavy line patterns and "Here be dragons"
text in the empty ocean areas.

---

## 5. Color Palette Approval

The map will use a parchment/sepia palette that contrasts with the dark app
theme. Proposed:

| Element             | Color          | Hex       |
|--------------------|----------------|-----------|
| Parchment base     | Warm off-white | `#f4e8c1` |
| Ink / borders      | Dark sepia     | `#3c2415` |
| Region fill (active)| Warm tan      | `#d4b896` |
| Region fill (empty)| Fog grey       | `#c4b89a` at 30% opacity |
| Water / ocean      | Faded blue     | `#8fa5a0` |
| Accent (glow)      | Gold           | `#c9a84c` (matches app gold) |
| Text labels        | Dark brown     | `#2a1a0a` |

**Your call:** approve, tweak, or point me at a reference image.

---

## 6. Font Choice for Map Labels

Currently the app uses **Cinzel** for headings. For the map labels I'd
suggest one of:

- **Cinzel Decorative** — same family, more ornate serifs
- **MedievilSharp** (Google Fonts) — blackletter-adjacent, readable
- **IM Fell English** (Google Fonts) — old-style serif, very cartographic

Pick one, or write "same as app" to keep Cinzel.

---

## Summary

| #  | Asset                    | Effort  | Can I generate a placeholder? |
|---|--------------------------|---------|-------------------------------|
| 1 | Region names             | 5 min   | Yes (use table above as-is)   |
| 2 | Terrain icons (×12)      | 1–2 hrs | Yes (geometric shapes)        |
| 3 | Compass rose             | 30 min  | Yes (simple procedural)       |
| 4 | Sea monsters             | 30 min  | Yes (wavy lines + text)       |
| 5 | Color palette            | 2 min   | Yes (use defaults above)      |
| 6 | Font choice              | 1 min   | Yes (default to Cinzel)       |

I can start building the procedural map immediately using placeholders for
everything. Just reply with your choices as you make them and I'll swap in
the real assets.
