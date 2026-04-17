# DevOps Visual Learn — Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a free, visual learning platform for Docker, Kubernetes, and Docker Compose with interactive diagrams, simulated terminals, quizzes, and i18n.

**Architecture:** Single Next.js 15 App Router app. MDX for lesson content, React Flow for diagrams, custom terminal simulator, localStorage for progress. No auth, no database.

**Tech Stack:** Next.js 15, React Flow, Tailwind CSS, next-mdx-remote, next-intl, Vitest

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`
- Create: `src/types/index.ts`

- [ ] Initialize Next.js 15 project with TypeScript, Tailwind CSS, App Router
- [ ] Install dependencies: `@xyflow/react`, `next-mdx-remote`, `next-intl`, `react-icons`
- [ ] Install dev dependencies: `vitest`, `@testing-library/react`, `@vitejs/plugin-react`
- [ ] Set up dark theme base in `globals.css` and `tailwind.config.ts`
- [ ] Create `src/types/index.ts` with core type definitions (Lesson, Module, Quiz, Challenge, Diagram, Progress)
- [ ] Commit: `feat: scaffold Next.js 15 project with dependencies`

---

### Task 2: Core Types and Data Layer

**Files:**
- Create: `src/types/index.ts`
- Create: `src/data/modules.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/progress.ts`

- [ ] Define TypeScript types for Lesson, Module, Quiz, QuizQuestion, Challenge, ChallengeTask, DiagramConfig, ProgressState
- [ ] Create `src/data/modules.ts` — module registry with topic metadata (Docker, Compose, K8s, DevOps), levels, lesson slugs
- [ ] Create `src/lib/content.ts` — helper to load and parse MDX lesson content by locale and slug
- [ ] Create `src/lib/progress.ts` — localStorage read/write helpers for progress tracking (lesson status, quiz scores, challenge completion)
- [ ] Write tests for progress helpers (getProgress, updateLessonStatus, getQuizBestScore)
- [ ] Commit: `feat: add types, module data, and utility libraries`

---

### Task 3: Layout and Navigation

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/app/[locale]/layout.tsx`

- [ ] Build `Navbar` — logo, topic links (Docker, Compose, K8s, DevOps), playground link, language toggle
- [ ] Build `Sidebar` — lesson list for current topic with progress indicators
- [ ] Build `Footer` — simple footer with links
- [ ] Create locale-aware layout at `src/app/[locale]/layout.tsx` wrapping children with Navbar and Sidebar
- [ ] Commit: `feat: add layout components with navigation`

---

### Task 4: Landing Page

**Files:**
- Create: `src/app/[locale]/page.tsx`
- Create: `src/components/progress/ModuleCard.tsx`
- Create: `src/components/progress/ProgressBar.tsx`
- Create: `src/components/progress/LevelBadge.tsx`

- [ ] Build `LevelBadge` — beginner/intermediate/advanced indicator component
- [ ] Build `ProgressBar` — visual progress bar taking a percentage
- [ ] Build `ModuleCard` — card showing topic, level, lesson count, progress
- [ ] Build landing page with hero section, module cards grid, and "continue where you left off" section
- [ ] Commit: `feat: add landing page with module cards`

---

### Task 5: Module List Pages

**Files:**
- Create: `src/app/[locale]/learn/page.tsx`
- Create: `src/app/[locale]/learn/docker/page.tsx`
- Create: `src/app/[locale]/learn/compose/page.tsx`
- Create: `src/app/[locale]/learn/kubernetes/page.tsx`
- Create: `src/app/[locale]/learn/devops/page.tsx`

- [ ] Build `/learn` page — learning path overview with all topics and progress
- [ ] Build each topic list page — lesson cards with level badges, duration estimates, completion status
- [ ] Commit: `feat: add module list pages`

---

### Task 6: MDX Content System

**Files:**
- Create: `src/lib/mdx.ts`
- Create: `src/components/mdx/MdxComponents.tsx`
- Create: `content/en/docker/containers-101.mdx`
- Create: `content/ar/docker/containers-101.mdx`
- Create: `src/app/[locale]/learn/docker/[module]/page.tsx`
- Create: `src/app/[locale]/learn/compose/[module]/page.tsx`
- Create: `src/app/[locale]/learn/kubernetes/[module]/page.tsx`
- Create: `src/app/[locale]/learn/devops/[module]/page.tsx`

- [ ] Set up MDX processing with `next-mdx-remote` — create `src/lib/mdx.ts` for serializing and rendering MDX
- [ ] Create `MdxComponents` — mapping of custom component tags (TerminalSimulator, DiagramCanvas, QuizComponent) to React components
- [ ] Write first lesson MDX: `content/en/docker/containers-101.mdx` with frontmatter and embedded component references
- [ ] Write Arabic version: `content/ar/docker/containers-101.mdx`
- [ ] Build dynamic lesson page routes that load MDX by locale and slug, render with custom components
- [ ] Commit: `feat: add MDX content system and lesson pages`

---

### Task 7: Lesson Layout

**Files:**
- Create: `src/components/layout/LessonLayout.tsx`

- [ ] Build `LessonLayout` — lesson page template with: title, level badge, duration, content area, diagram section, terminal challenge section, quiz section, navigation (prev/next)
- [ ] Wire lesson pages to use `LessonLayout`
- [ ] Commit: `feat: add lesson layout component`

---

### Task 8: Terminal Simulator

**Files:**
- Create: `src/components/terminal/TerminalSimulator.tsx`
- Create: `src/components/terminal/CommandParser.ts`
- Create: `src/components/terminal/ChallengePanel.tsx`
- Test: `src/components/terminal/__tests__/CommandParser.test.ts`

- [ ] Build `CommandParser` — parses user input into command + args, maps to simulated output
- [ ] Write tests for CommandParser (valid commands, invalid commands, command history)
- [ ] Build `TerminalSimulator` — terminal UI with prompt, command input, output display, history navigation (up/down arrows)
- [ ] Build `ChallengePanel` — shows task list, validates task completion against command history
- [ ] Style terminal with monospace font, dark background, green text, syntax highlighting
- [ ] Commit: `feat: add terminal simulator and challenge panel`

---

### Task 9: Interactive Diagrams

**Files:**
- Create: `src/components/diagram/DiagramCanvas.tsx`
- Create: `src/components/diagram/nodes/ContainerNode.tsx`
- Create: `src/components/diagram/nodes/PodNode.tsx`
- Create: `src/components/diagram/nodes/ServiceNode.tsx`
- Create: `src/components/diagram/nodes/VolumeNode.tsx`
- Create: `src/components/diagram/nodes/NetworkNode.tsx`
- Create: `src/components/diagram/edges/DataFlowEdge.tsx`
- Create: `src/components/diagram/edges/VolumeMountEdge.tsx`
- Create: `src/components/diagram/edges/NetworkEdge.tsx`
- Create: `src/data/diagrams/docker-container-basics.ts`

- [ ] Build custom React Flow node types: ContainerNode (blue), PodNode (green), ServiceNode (orange), VolumeNode (purple), NetworkNode (teal)
- [ ] Build custom edge types: DataFlowEdge (animated dashes), VolumeMountEdge (dotted), NetworkEdge (colored)
- [ ] Build `DiagramCanvas` — React Flow wrapper with custom nodes/edges, sidebar on node click, "Run" button animation
- [ ] Create first diagram data: `docker-container-basics.ts` showing a simple container with port mapping
- [ ] Commit: `feat: add interactive diagram components`

---

### Task 10: Quiz Component

**Files:**
- Create: `src/components/quiz/QuizComponent.tsx`
- Create: `src/data/quizzes/docker-basics-quiz.ts`
- Test: `src/components/quiz/__tests__/QuizComponent.test.tsx`

- [ ] Build `QuizComponent` — multiple choice with option selection, submit, correct/incorrect feedback with explanations, score display
- [ ] Create first quiz data: `docker-basics-quiz.ts` with 5 questions about Docker basics
- [ ] Write tests for quiz logic (answer selection, score calculation, completion state)
- [ ] Commit: `feat: add quiz component`

---

### Task 11: First Complete Lesson

**Files:**
- Update: `content/en/docker/containers-101.mdx`
- Update: `src/data/diagrams/docker-container-basics.ts`
- Create: `src/data/challenges/docker-ps-challenge.ts`

- [ ] Create terminal challenge data: `docker-ps-challenge.ts` with simulated state, valid commands, and task list
- [ ] Update lesson MDX to wire in diagram, terminal challenge, and quiz references
- [ ] Verify the full lesson flow renders: content → diagram exploration → terminal challenge → quiz
- [ ] Commit: `feat: complete first Docker lesson with all interactive features`

---

### Task 12: Progress Tracking

**Files:**
- Update: `src/lib/progress.ts`
- Create: `src/hooks/useProgress.ts`
- Create: `src/context/ProgressContext.tsx`

- [ ] Build `ProgressContext` — React context providing progress state and update methods
- [ ] Build `useProgress` hook — wraps context, exposes get/set helpers for lesson status, quiz scores, challenge completion
- [ ] Wire progress context into app layout
- [ ] Update ModuleCard and lesson list pages to show real progress from localStorage
- [ ] Commit: `feat: add progress tracking with context and hooks`

---

### Task 13: Internationalization

**Files:**
- Create: `src/i18n/en.json`
- Create: `src/i18n/ar.json`
- Create: `src/i18n/config.ts`
- Create: `src/i18n/request.ts`
- Create: `src/middleware.ts`
- Update: `next.config.ts`

- [ ] Set up `next-intl` — config, middleware for locale detection and routing, request handler
- [ ] Create English UI strings: `src/i18n/en.json` (navbar labels, button text, level names, error messages)
- [ ] Create Arabic UI strings: `src/i18n/ar.json`
- [ ] Add RTL layout support in locale layout for Arabic
- [ ] Update all components to use `useTranslations()` instead of hardcoded strings
- [ ] Commit: `feat: add i18n with English and Arabic`

---

### Task 14: Placement Quiz Page

**Files:**
- Create: `src/app/[locale]/level-test/page.tsx`
- Create: `src/data/quizzes/placement-quiz.ts`

- [ ] Create placement quiz data — 10 questions spanning Docker, Compose, and K8s basics to determine starting level
- [ ] Build placement quiz page — renders quiz, calculates result (beginner/intermediate/advanced), recommends starting modules
- [ ] Save placement result to progress tracking
- [ ] Commit: `feat: add placement quiz page`

---

### Task 15: Playground and Cheatsheet

**Files:**
- Create: `src/app/[locale]/playground/page.tsx`
- Create: `src/app/[locale]/cheatsheet/page.tsx`
- Create: `src/data/cheatsheet.ts`

- [ ] Build playground page — free-form terminal simulator with Docker/K8s commands available, no specific challenge
- [ ] Build cheatsheet page — quick reference tables for Docker, Compose, and K8s commands, searchable/filterable
- [ ] Create cheatsheet data: `src/data/cheatsheet.ts` — command categories, commands, descriptions, examples
- [ ] Commit: `feat: add playground and cheatsheet pages`

---

### Task 16: Additional Lessons (Batch)

**Files:**
- Create: `content/en/docker/dockerfile-basics.mdx`
- Create: `content/en/docker/volumes-networks.mdx`
- Create: `content/en/compose/yaml-basics.mdx`
- Create: `content/en/compose/multi-service.mdx`
- Create: `content/en/kubernetes/pods-deployments.mdx`
- Create: `content/en/kubernetes/services-ingress.mdx`
- Create: `src/data/diagrams/*.ts` (5+ diagrams)
- Create: `src/data/challenges/*.ts` (5+ challenges)
- Create: `src/data/quizzes/*.ts` (5+ quizzes)
- Create: Arabic equivalents under `content/ar/`

- [ ] Write MDX content for 5+ additional lessons across topics
- [ ] Create diagram data files for each lesson
- [ ] Create challenge data files for each lesson
- [ ] Create quiz data files for each lesson
- [ ] Create Arabic translations for each lesson
- [ ] Commit: `feat: add content for 6 additional lessons`

---

### Task 17: Polish and Deployment

**Files:**
- Update: `next.config.ts`
- Create: `vercel.json` (if needed)
- Update: `src/app/globals.css`

- [ ] Add SEO metadata to all pages (title, description, Open Graph)
- [ ] Add loading states and error boundaries
- [ ] Optimize fonts and assets
- [ ] Add responsive design tweaks for mobile
- [ ] Configure Vercel deployment settings
- [ ] Test full app flow end-to-end
- [ ] Commit: `feat: polish and deployment config`