# Skill Tree + Motivation System Design

## Goal
Replace the homepage with an interactive React Flow skill tree that visualizes learning progress, plus XP/levels, daily streaks, and achievement badges — creating a Duolingo-style motivation loop for Gen-Z learners.

## Architecture

### 4 Connected Units

1. **Skill Tree Page** (replaces homepage) — React Flow canvas with custom `SkillNode` nodes and `UnlockEdge` edges. Vertical scrolling layout. Fixed nodes (not draggable). Clicking an unlocked node navigates to the lesson.

2. **Progress Engine** (extends existing `src/lib/progress.ts`) — Adds XP tracking, streak counting, level calculation, and badge unlocking logic to the existing localStorage-based system. Feeds data into the tree to determine node states.

3. **Streak & XP Header Widget** — Compact bar below navbar showing: fire streak count, XP bar with level number, and a trophy icon that opens a badge drawer. Visible on every page.

4. **Badge Drawer** — Slide-out panel showing all badges (earned + locked). Each badge has a name, icon, and unlock condition.

## Skill Tree Design

### SkillNode (custom React Flow node)

- 3 states: `locked` (dimmed, gray), `available` (pulsing glow, outlined), `completed` (filled, bright)
- Each node shows: lesson icon (emoji from modules.ts), lesson title, difficulty badge
- Completed nodes also show quiz score (e.g. "90%")
- Click on `available` or `completed` node → navigates to that lesson page
- Click on `locked` node → tooltip saying "Complete [prerequisite] to unlock"

### UnlockEdge (custom edge)

- Dimmed dashed line for locked connections
- Solid gradient line for completed connections
- Animated pulse along the edge when a new node just unlocked

### Tree Layout

- 4 vertical branches (Docker, Compose, K8s, DevOps) side by side
- Each branch flows top-to-bottom from beginner → advanced
- Starting node at the very top is "Containers 101" (always unlocked)
- DevOps branch starts at intermediate (its prerequisites are the K8s beginner nodes)
- Horizontal connections between branches where lessons cross-reference each other

### Tree Top Bar

- Shows total completion % and a "Reset Progress" button (with confirmation)

## Progress Engine

### XP System

| Action | XP |
|--------|----|
| Complete lesson | +50 XP |
| Pass quiz (70%+) | +30 XP |
| Score 90%+ on quiz | +20 XP bonus |
| Complete terminal challenge | +40 XP |
| First action of the day | +10 XP |
| Custom exam (per question) | +15 XP |

### Level System

| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Docker Trainee |
| 2 | 100 | Container Operator |
| 3 | 300 | Image Builder |
| 4 | 600 | Compose Commander |
| 5 | 1000 | Pod Pilot |
| 6 | 1500 | Cluster Admin |
| 7 | 2200 | Helm Navigator |
| 8 | 3000 | CI/CD Architect |
| 9 | 4000 | DevOps Engineer |
| 10 | 5000 | Platform Overlord |

Each level has a title shown next to the XP bar.

### Streak System

- Track consecutive days with at least 1 action (lesson view, quiz attempt, challenge)
- Streak resets at midnight local time if no action that day
- Streak multiplier: 3+ days = 1.5x XP, 7+ days = 2x XP
- Streak shown as fire icon + number in the header widget

### Badge System (15 badges)

| Badge | Condition |
|-------|-----------|
| First Steps | Complete 1 lesson |
| Container Rookie | Complete all Docker beginner lessons |
| Compose Up | Complete all Compose lessons |
| Pod Master | Complete all K8s lessons |
| Pipeline Builder | Complete all DevOps lessons |
| Full Stack | Complete all 20 lessons |
| Quiz Ace | Score 90%+ on any quiz |
| Perfect Score | Score 100% on any quiz |
| Streak Starter | 3-day streak |
| Streak Blazer | 7-day streak |
| Streak Inferno | 30-day streak |
| Exam Cracker | Complete a custom exam |
| Terminal Hero | Complete a terminal challenge |
| Explorer | Visit all 4 topic pages |
| Level 10 | Reach max level |

### Unlock Mechanic

Must score 70%+ on a lesson's quiz to unlock the next node in the skill tree.

## Streak & XP Header Widget

- Below navbar, on every page
- Left: Fire icon + streak count (e.g. "5")
- Center: Level number + title + XP progress bar (filled/total, e.g. "L5 Pod Pilot — 850/1000 XP")
- Right: Trophy icon that opens the badge drawer
- Compact: single row, ~40px tall, dark bg with subtle border
- On mobile: collapses to just streak + level number, tap to expand

## Badge Drawer

- Triggered by clicking trophy icon in header
- Overlay panel, ~350px wide, slides from right
- Top: "X / 15 Badges Earned" with progress ring
- Grid of badge cards (3 columns)
- Earned badges: full color, with name + unlock date
- Locked badges: grayscale, with lock icon + condition text ("Complete all K8s lessons")
- Close button or click outside to dismiss

## Data Flow

1. User completes an action (views lesson, passes quiz, etc.)
2. `useProgress()` context calls `addXP(amount)`, `updateStreak()`, checks badge conditions
3. New state written to localStorage (`devops-learn-progress` key — extended, not replaced)
4. Skill tree reads progress state to determine node/edge appearance
5. Header widget reads same state reactively
6. Badge drawer reads badge unlock state from progress

## Error Handling

- localStorage full: catch QuotaExceededError, show toast "Progress save failed — clear browser storage"
- Streak: use `Date()` locally, store last-action date as `YYYY-MM-DD`
- XP never decreases, badges never un-earn
- If progress data corrupt on load: reset to defaults, show toast

## Files to Create

| File | Purpose |
|------|---------|
| `src/components/skill-tree/SkillTreeCanvas.tsx` | React Flow canvas with skill tree layout |
| `src/components/skill-tree/SkillNode.tsx` | Custom React Flow node (locked/available/completed) |
| `src/components/skill-tree/UnlockEdge.tsx` | Custom React Flow edge (dashed/solid/animated) |
| `src/components/skill-tree/skill-tree-data.ts` | Node positions, edges, and prerequisite map |
| `src/components/progress/StreakXPBar.tsx` | Header widget (streak, level, XP bar, trophy) |
| `src/components/progress/BadgeDrawer.tsx` | Slide-out badge collection panel |
| `src/components/progress/BadgeCard.tsx` | Individual badge card (earned/locked states) |
| `src/data/badges.ts` | Badge definitions (id, name, icon, condition) |
| `src/data/levels.ts` | Level thresholds and titles |
| `src/lib/xp.ts` | XP calculation, level lookup, streak multiplier |
| `src/app/[locale]/page.tsx` | Homepage rewrite — render SkillTreeCanvas + StreakXPBar |

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/progress.ts` | Extend ProgressState with xp, level, streak, badges; add addXP(), updateStreak(), checkBadges() |
| `src/context/ProgressContext.tsx` | Expose new progress functions (addXP, updateStreak, getLevel, getBadges) |
| `src/types/index.ts` | Add SkillNodeState, Badge, Level types |
| `src/components/layout/Navbar.tsx` | No change — StreakXPBar sits below navbar in layout |
| `src/app/[locale]/layout.tsx` | Add StreakXPBar below Navbar |
| `src/components/lesson/LessonContent.tsx` | Call addXP + updateStreak on lesson view |
| `src/components/quiz/QuizComponent.tsx` | Call addXP on quiz completion, pass score to unlock check |
| `src/components/terminal/TerminalSimulator.tsx` | Call addXP on challenge completion |

## Technical Notes

- React Flow is already a project dependency (`@xyflow/react` v12)
- Custom node types follow the same pattern as existing diagram nodes (DiagramCanvas.tsx)
- All progress state remains localStorage-only (no backend, no auth)
- Skill tree node positions are fixed (not auto-calculated) — defined in skill-tree-data.ts
- Streak detection uses local date comparison, no server time needed