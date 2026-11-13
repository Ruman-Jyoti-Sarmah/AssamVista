# Website Changes Summary — Axom (Assam Web Project)

This folder contains a summary of all website changes made to the repository.

## Source
- **Repo:** https://github.com/Ruman-Jyoti-Sarmah/Axom.git
- **Branch:** `main`
- **Latest commit:** `4ac477b` — "Add section introductions to homepages"

## Recent Commit History (last 10 commits)

| Commit | Message |
|--------|---------|
| `4ac477b` | Add section introductions to homepages |
| `558fd6f` | Rename travel hero video asset |
| `2b7c438` | Add local media updates |
| `9d169cb` | Update culture components, data, styles, and tests |
| `eac2a0a` | Refactor: restructure components, data, and scripts into organized directories |
| `2391c53` | Refactor: restructure components, data, and scripts into organized directories |
| `70a8f62` | Culture navbar: add Home button to primary navigation |
| `5db7b55` | Culture navbar: fix Home button visibility on mobile |
| `111e69a` | Culture navbar: fix Home button visibility |
| `51c6f80` | Culture page navbar: add Home button that opens Culture home page |

## Latest Commit Details (`4ac477b`)

**Message:** Add section introductions to homepages

**Files changed (4 files, 48 insertions, 4 deletions):**

| File | Change |
|------|--------|
| `src/components/culture/Homepage/CultureHome.jsx` | 5 changed |
| `src/components/travel/Homepage/TravelHomepageContent.jsx` | 2 added |
| `src/data/i18n.js` | 42 added |
| `src/styles/index.css` | 3 changed |

## Aggregate Changes (HEAD~5 → HEAD)

**Total: 97 files changed, 1,883 insertions, 2,864 deletions**

### Major restructures
- **Navbar removed:** `src/components/common/Navbar.jsx` (226 lines deleted)
- **ExperiencesHub removed:** `src/components/culture/ExperiencesHub.jsx` (311 lines deleted)
- **Hero removed:** `src/components/culture/Hero.jsx` (197 lines deleted)
- **HomeFacts removed:** `src/components/culture/HomeFacts.jsx` (179 lines deleted)
- **TravelHub removed:** `src/pages/Travel/TravelHub.jsx` (234 lines deleted)
- **Attractions removed:** `src/pages/Travel/Attractions.jsx` (219 lines deleted)
- **JourneyPlanner page removed:** `src/pages/Travel/JourneyPlanner.jsx` (304 lines deleted)
- **Districts page rewritten:** `src/pages/Travel/Districts.jsx` (295 lines deleted) → new `src/components/travel/Districts/DistrictsContent.jsx` (296 lines added)
- **JourneyPlanner component rewritten:** `src/components/travel/JourneyPlanner/JourneyPlannerContent.jsx` (303 lines added)
- **Stays component added:** `src/components/travel/Stays/StaysContent.jsx` (105 lines added)
- **Styles updated:** `src/styles/index.css` (317 lines changed)

### New data files
- `src/data/culture/assam/communities.js` (212 lines added)
- `src/data/i18n.js` (54 lines added across commits)

### New test files
- `tests/assamCommunities.test.js` (22 lines added)

### Media changes
- `public/img/hero-brahmaputra-sm.jpg` — removed (was 23,409 bytes)
- `public/img/hero-brahmaputra-sm.webp` — removed (was 24,368 bytes)
- `public/video/hero-1.mp4` — reduced from 47,720,612 bytes to 134 bytes
- Added: `IMG-20261002-WA0004.jpg` (232,699 bytes)
- Added: 3 screenshot PNG files
- Added: `index.html.bak` (47 lines)

### Scripts
- `scripts/verify-river-i18n.mjs` — updated (19 lines changed)
- `src/lib/useContent.js` — reduced (23 lines deleted)

## How to view full diffs

```bash
# See all changes in the last 5 commits
git diff HEAD~5 HEAD --stat

# See the full diff
git diff HEAD~5 HEAD

# See a specific commit
git show <commit-hash>
```

## Folder contents

- `CHANGES.md` — this file
- `diff-stat.txt` — raw `git diff --stat` output (HEAD~5 → HEAD)
