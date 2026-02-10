
Special Cases (Test First)
Archetype	Tabs Needed	Test Data
Unburdened	< 10 tabs	Any 5-9 URLs
Mor'tab the Unending	≥ 1000 tabs	Any 1000+ URLs (overrides all other logic)
The 6 Main Archetypes
Each archetype is determined by 3 axes:

Axis A: DEEP (>0.5) vs BROAD (<0.5)
Axis B: ACTION (>0.5) vs CONSUMPTION (<0.5)
Axis C: RESOLVED (<0.5) vs UNRESOLVED (>0.5)
1. NECROMANCER (Deep + Consumption + Resolved)
Test Data: 50-100 tabs
- 40+ long-form reading: medium.com, substack.com, longform.org, aeon.co
- 10+ blogs/essays: paulgraham.com, waitbutwhy.com
- Few domains repeated (same domain 5-10 times)
- NO Google searches, NO social media, NO shopping

2. WARLOCK (Deep + Action + Resolved)
Test Data: 50-100 tabs
- 30+ tools: github.com, figma.com, notion.so, vercel.com, aws.amazon.com
- 15+ work platforms: linear.app, slack.com, docs.google.com
- 5+ portfolios: dribbble.com, behance.net
- Same domains repeated (deep engagement)
- NO Google searches, NO social media

3. WRAITH (Deep + Consumption + Unresolved)
Test Data: 50-100 tabs
- 30+ long-form reading with SAME topics (rabbit holes)
- 15+ Google searches (unresolved curiosity)
- 5+ Wikipedia pages (deep dives)
- Few domains but repeated heavily
- Examples: 10x medium.com on AI, 8x aeon.co on philosophy

4. BONE CLERIC (Broad + Action + Resolved)
Test Data: 50-100 tabs
- 20+ diverse news sources: nytimes.com, bbc.com, reuters.com, wsj.com
- 15+ tools/platforms: github.com, figma.com, notion.so
- 10+ job boards: linkedin.com/jobs, wellfound.com, indeed.com
- 5+ portfolios/events
- Many UNIQUE domains (breadth)
- NO repeated domains, NO searches

5. ZOMBIE (Broad + Consumption + Unresolved)
Test Data: 50-100 tabs
- 20+ social media: twitter.com, reddit.com, instagram.com, linkedin.com
- 15+ Google searches
- 10+ homepage-only tabs: reddit.com, twitter.com, youtube.com
- 5+ random links
- Scattered, aimless browsing
- NO tools, NO work platforms

6. LICH (Deep/Broad + Action + Unresolved)
Test Data: 50-100 tabs
- 20+ shopping: amazon.com, etsy.com (carts filled, never checked out)
- 15+ tools bookmarked but unused
- 10+ Google searches about tools/products
- 5+ job boards (looking but not applying)
- Action-oriented but indecisive

🏆 How to Get Epic/Legendary Badges
The rarity system is purely volume-based (from TradingCard3D.tsx:68-73):

Badge	Tab Count	Example
LEGENDARY 🌟	1000+ tabs	Create 1000+ URLs of any type
EPIC ⚡	501-999 tabs	Create 600 URLs
RARE 💎	101-500 tabs	Create 200 URLs
UNCOMMON 🔹	51-100 tabs	Create 75 URLs
COMMON ⚪	0-50 tabs	Create 25 URLs
To get LEGENDARY: Just paste 1000+ URLs. The archetype will automatically become "Mor'tab the Unending" regardless of content.

🧪 Practical Test Strategy
Quick Tests (5 minutes each):
Unburdened: 7 random URLs
Common Zombie: 30 social media + search URLs
Rare Necromancer: 150 medium.com articles
Epic Warlock: 600 github.com/figma.com/notion.so URLs
Legendary Mor'tab: 1000+ any URLs
Dimension Testing:
To isolate specific dimensions, create focused datasets:

High depth: Repeat same 3-5 domains 20-30 times each
High breadth: Use 50+ unique domains (no repeats)
High reading: medium.com, substack.com, longform.org, aeon.co
High action: github.com, figma.com, notion.so, aws.amazon.com
High unresolved: Add 15+ google.com/search?q= URLs