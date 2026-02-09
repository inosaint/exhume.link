# Personality Scoring System — exhume.link

How we assign one of 6 archetypes to a user based on their browser tab data.
Everything here is rule-based, extracted from URL structure and domain matching alone.

---

## Step 1: Extract Raw Signals from URLs

For each URL in the dataset we pull these signals. All are countable from the URL
itself — no external API or page-fetch required.

### Domain-level signals

| Signal | Rule | What it tells us |
|---|---|---|
| **Breadth ratio** | `unique_domains / total_tabs` | High = scattered browsing. Low = revisiting the same places |
| **Homepage-only tabs** | URL path is empty or `/` | "I want to remember this person/brand" — identity-checking, not reading |
| **Repeat domains** | Domains appearing 3+ times | The sites someone actually returns to |

### Content-type signals

Each URL is bucketed into one or more of these content types by domain + path matching:

| Content type | Example domains / signals |
|---|---|
| Reading platforms | medium.com, *.substack.com, beehiiv newsletters |
| Long-form blogs | Individual blogs, brainpickings, ribbonfarm, astralcodexten |
| Books | goodreads, bookshop.org, amazon book listings, book publishers |
| News | reuters, bbc, axios, theatlantic, bloomberg, livemint, economictimes |
| Design & UX | uxdesign.cc, dribbble, .design TLDs, design studio sites |
| Tools & productivity | figma, notion, github, chatgpt, gemini, cursor |
| Portfolios | .design TLDs, /portfolio or /about paths on personal domains, designer homepages |
| Shopping | amazon, /dp/ or /product paths, online stores |
| Social | twitter/mobile.twitter, reddit, instagram, linkedin |
| Video | youtube, vimeo, spotify |
| Gaming | steam, pcgamesn, itch.io, myanimelist |
| Travel | tripadvisor, travel blogs, .lk domains |
| Health & wellness | longevity books, therapy articles, health guides |
| Events | luma.com invites, conference sites |
| Jobs & hiring | greenhouse.io, otta, talentify, career blogs |

### Behavioral signals

These are pattern-level, not single-URL:

| Signal | How to detect | What it tells us |
|---|---|---|
| **Unresolved searches** | Google search tabs still open | Curiosity fired but never closed. Typos in the query = fired fast, didn't bother to fix |
| **Rabbit holes** | Same topic appearing on 2+ platforms (e.g. a book on bookshop.org AND the same book's essay on Medium) | Person follows an idea across platforms |
| **Series read-throughs** | Multiple tabs from the same Medium publication or author | Deliberate, sequential reading |
| **Wikipedia fiction chains** | Multiple Wikipedia tabs all about novels / films / music | Browsing by cultural association |
| **Evergreen retention** | Tabs with dates pre-2018 that are well-known classics (kitchensoap "on being a senior engineer", johnsalvatier "reality has a surprising amount of detail") | Person keeps timeless content, doesn't purge old tabs |

---

## Step 2: Score 8 Dimensions

Aggregate the raw signals into 8 normalized scores (each 0–1, relative to the dataset):

| # | Dimension | Inputs |
|---|---|---|
| 1 | **Depth** | Inverted breadth ratio + repeat domain weight + rabbit hole count |
| 2 | **Reading Mass** | Medium + Substack + blogs + books + PDFs + long-form news tab count |
| 3 | **Action Mass** | Tools + portfolios (as workspace, not consumption) + shopping + jobs tab count |
| 4 | **Social Pull** | Twitter + Reddit + Instagram + LinkedIn tab count |
| 5 | **Unresolved Curiosity** | Open Google searches + homepage-only tabs + broken shortlinks |
| 6 | **Rabbit Hole Depth** | Cross-platform topic follows + repeat authors + series reads + Wikipedia chains |
| 7 | **Scout Activity** | Portfolio tabs + job boards + event tabs + count of distinct news outlets |
| 8 | **Evergreen Retention** | Pre-2018 tabs that are evergreen classics / total tabs with dates |

---

## Step 3: Map to 3 Primary Axes

The 8 dimensions collapse into 3 independent axes that drive archetype assignment:

```
Axis A: DEPTH ←————————————→ BREADTH
          (dims 1, 6)            (dim 1 inverted)

Axis B: CONSUMPTION ←————————→ ACTION
          (dim 2)                (dim 3)

Axis C: RESOLVED ←————————————→ UNRESOLVED
          (dim 7)                (dim 5)
```

Each user gets a position on all 3 axes. The archetype is determined by which
corner of this space they land in.

---

## Step 4: The 6 Archetypes + 2 Special Cards

8 corners exist in a 3-axis space but only 6 represent real browsing patterns.
The two that don't occur naturally: Deep + Action + Unresolved, and
Broad + Consumption + Resolved (without Scout Activity, that's just "read the news
and stopped" — not a persistent tab behavior).

Two additional special cards override the scoring entirely based on tab count:
**The Unburdened** (<10 tabs) and **Mor'tab the Unending** (≥1000 tabs).

### The Necromancer
**Deep · Consumption · Resolved**

*"You exhume knowledge on purpose. Your tabs are grimoires — long reads, old essays,
and sources that still matter. You finish what you open. Nothing here is accidental."*

High reading mass. High evergreen retention — keeps classics from 2012 open because
they still matter. Low open searches; when curious, finishes the thread.
Books, long-form essays, newsletters read cover to cover.

**Key signals:** Reading Mass high, Evergreen Retention high, Unresolved Curiosity low,
Rabbit Hole Depth moderate.

---

### The Warlock
**Deep · Action · Resolved**

*"Your tabs are instruments of work. Tools, references, and opportunities bound by
intent. You open with purpose, act decisively, and close the pact when the task is done."*

Tabs are a workspace. Design tools, portfolios open for reference, job boards
being actively worked. High scout activity — knows what's out there because they
looked deliberately.

**Key signals:** Action Mass high, Scout Activity high, Social Pull low,
Depth high.

---

### The Wraith
**Deep · Consumption · Unresolved**

*"You followed one idea too far. Rabbit holes, half-read books, endless related
tabs — all circling something you haven't named yet. The knowledge lingers. You do too."*

The rabbit holler. Falls into a topic — a book, an idea, a person — and opens
everything related to it across multiple platforms. But never quite closes the loop.
Open Google searches with typos. Half-finished series. The tab count grows.

**Key signals:** Rabbit Hole Depth high, Reading Mass high, Unresolved Curiosity high,
Breadth moderate (focused breadth within rabbit holes).

---

### The Bone Cleric
**Broad · Action · Resolved**

*"You survey the dead and decide what rises. News, tools, markets, and signals pass
through you. You evaluate, choose, and move on. Wide vision. Clean cuts."*

The generalist professional. Tabs span news, design, tools, portfolios, events,
jobs — all relevant, all intentional, all spread wide. Not chasing rabbit holes;
surveying the landscape on purpose.

**Key signals:** Scout Activity high, Breadth high, Reading Mass moderate,
Action Mass moderate, Social Pull low.

---

### The Zombie
**Broad · Consumption · Unresolved**

*"You didn't mean to open these tabs. They spread anyway. Social links, homepages,
forgotten searches — all open, none finished. You wander. The tabs multiply."*

High social pull — most tabs arrived via Twitter or Reddit links, not direct
navigation. High breadth, low depth. Lots of homepage-only tabs that were never
clicked into. Open searches with typos that were never revisited.

**Key signals:** Social Pull high, Unresolved Curiosity high, Breadth high,
Depth low, Rabbit Hole Depth low.

---

### The Lich
**Broad · Action · Unresolved**

*"You accumulate power but never release it. Carts filled, tools bookmarked,
decisions deferred. Everything is collected. Nothing is committed."*

Shopping tabs, tool homepages, product pages — all open, none acted on.
High breadth but shallow: lots of first-visits, few return trips.
The digital equivalent of a museum visitor who reads every plaque but buys nothing
from the gift shop. Except they fill the cart.

**Key signals:** Shopping tabs high, Homepage-only tabs high, Action Mass high,
Unresolved Curiosity high, Depth low.

---

### The Unburdened *(Special Card)*
**<10 Tabs · Default State**

*"Fewer than ten tabs. You travel light through the digital world — or you just
got here. Either way, the graves are shallow."*

Not enough signal to classify. This card is assigned automatically when the user
has fewer than 10 tabs, bypassing the scoring system entirely.

---

### Mor'tab the Unending *(Special Card)*
**≥1000 Tabs · Ascended State**

*"You have crossed the threshold. A thousand tabs or more, all coexisting in
impossible equilibrium. Not chaos — something older. You no longer manage tabs.
They orbit you."*

Assigned automatically when the user has 1000 or more tabs, bypassing the
scoring system entirely. An ascended state beyond the normal archetypes.

---

## Step 5: Volume Suffix + Special Overrides

Tab count determines special card overrides and volume suffixes:

| Total tabs | Result | Example |
|---|---|---|
| 0–9 | **The Unburdened** *(special card, bypasses scoring)* | The Unburdened |
| 10–49 | "of the Shadows" | Warlock of the Shadows |
| 50–99 | "of the Cult" | Wraith of the Cult |
| 100–249 | "of the Dark Legion" | Bone Cleric of the Dark Legion |
| 250–499 | "of the Horde" | Zombie of the Horde |
| 500–999 | "of the Endless Horde" | Necromancer of the Endless Horde |
| ≥ 1000 | **Mor'tab the Unending** *(special card, bypasses scoring)* | Mor'tab the Unending |

The two special cards (Unburdened and Mor'tab) override the entire scoring
pipeline — no axes are computed, no archetype is assigned. They are standalone
cards with their own art, title, and description.

---

## Calibration: Expected Result for the Sample Dataset

The sample dataset (689 tabs, design-heavy, 40+ portfolio tabs, 24 news outlets,
16 open searches, 21 different Substacks):

- Action Mass: high (tools + portfolios + jobs)
- Scout Activity: high (40+ portfolios, 24 news outlets, 4 Luma events)
- Depth: moderate-high (breadth ratio 0.705, some rabbit holes)
- Social Pull: low (25 social tabs out of 689)
- Unresolved Curiosity: moderate (16 open searches)

**Primary archetype: The Warlock** (Deep · Action · Resolved)
**Strong secondary: The Bone Cleric** (Broad · Action · Resolved)
**Volume suffix: "of the Endless Horde"** (689 ≥ 500)
**Final title: Warlock of the Endless Horde**
