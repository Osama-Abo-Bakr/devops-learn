# DevOps Visual Learn — Design Spec

## Context

Build a free, visual learning platform for Docker, Kubernetes, and Docker Compose that teaches concepts from beginner to advanced through interactive diagrams, simulated terminals, quizzes, and terminal challenges. Inspired by claude.nagdy.me (a Claude Code learning site). Built with Next.js and deployed on Vercel.

## Architecture

**Single Next.js app** (App Router) with all content and features in one codebase.

### Tech Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | Next.js 15 (App Router) | SSG for performance, file-based routing |
| Diagrams | React Flow | Interactive node-graph diagrams, well-maintained |
| Terminal | Custom React component | Full control over simulation logic |
| Content | MDX (next-mdx-remote) | Write lessons in Markdown, embed React components |
| i18n | next-intl | Mature, supports RTL for Arabic |
| Styling | Tailwind CSS | Dark theme, rapid development |
| Progress | localStorage | No auth needed, client-side tracking |
| Deployment | Vercel | Free tier, automatic PR previews |

### Routing

```
/                           Landing page (hero + module cards)
/learn                      Learning path overview
/learn/docker               Docker module list
/learn/docker/[module]      Individual Docker lesson
/learn/compose              Compose module list
/learn/compose/[module]     Individual Compose lesson
/learn/kubernetes            K8s module list
/learn/kubernetes/[module]   Individual K8s lesson
/learn/devops               Advanced DevOps module list
/learn/devops/[module]       Individual DevOps lesson
/playground                 Terminal sandbox (free practice)
/cheatsheet                 Quick reference
/level-test                 Placement quiz
```

Locale prefix: `/en/...` and `/ar/...`

## Interactive Diagrams

**Library:** React Flow

**Custom Node Types:**
- `ContainerNode` — Docker container with name, image, status, ports
- `PodNode` — K8s pod with containers inside
- `ServiceNode` — K8s service exposing pods
- `VolumeNode` — Storage volume
- `NetworkNode` — Docker network connecting containers

**Custom Edge Types:**
- `DataFlowEdge` — Animated dashes showing data flow
- `VolumeMountEdge` — Dotted line for volume mounts
- `NetworkEdge` — Colored line for network connections

**Interactions:**
- Click node → sidebar with details (env vars, config, commands)
- Hover edge → tooltip with protocol/port/type
- "Run" button on ContainerNode → animation of container starting, then data flows animate
- Diagrams are predefined per lesson — users explore, not build

**Data format:** Each diagram defined as a TypeScript object with nodes and edges arrays, referenced by lesson frontmatter.

## Terminal Simulator

**Custom React component** simulating a real terminal.

**Core behavior:**
- Prompt: `$` or `user@docker-learn`
- User types commands, gets simulated output
- Each lesson defines valid commands and responses
- Invalid commands get helpful error messages
- Command history with up/down arrows
- Each lesson starts in a predefined state (containers running, files present)

**Challenge system:**
- Each lesson has specific tasks (e.g., "Stop the nginx container")
- Terminal tracks command history and validates task completion
- Completing all tasks unlocks the quiz

**Data format:** Terminal scenarios defined as TypeScript objects with initial state, valid commands, and challenge tasks.

## Content System

**Lessons:** MDX files with frontmatter, stored under `/content/{locale}/{topic}/`

```mdx
---
title: "Docker Containers 101"
module: docker
level: beginner
duration: "30 min"
diagram: docker-container-basics
challenge: docker-ps-challenge
quiz: docker-basics-quiz
---
Lesson content with embedded React components...
```

**Diagrams:** TypeScript files under `/src/data/diagrams/` — each exports a React Flow config.

**Challenges:** TypeScript files under `/src/data/challenges/` — each exports terminal scenario + tasks.

**Quizzes:** TypeScript files under `/src/data/quizzes/` — each exports questions, options, correct answers, and explanations.

## Internationalization

- `next-intl` for UI string translations
- Content MDX files duplicated per locale under `/content/en/` and `/content/ar/`
- RTL layout automatically applied for Arabic routes
- Locale prefix in URLs: `/en/learn/docker/...` and `/ar/learn/docker/...`

## Progress Tracking

- localStorage-based, no authentication
- Track per-lesson status: `not_started` → `in_progress` → `completed`
- Track quiz scores (best score per quiz)
- Track challenge completion
- Visual progress bar on landing page and module lists
- "Continue where you left off" on homepage

## Assessment

**Quizzes:** Multiple choice with explanations for wrong answers. Each lesson ends with a quiz.

**Terminal Challenges:** Practical tasks in the simulated terminal. Users must complete specific commands to demonstrate understanding.

**Placement Quiz** (`/level-test`): Determines user's starting level and recommends modules.

## Module Structure

Each topic has lessons organized by level:

**Docker Fundamentals (beginner → advanced):**
- Beginner: Images, containers, Dockerfile, volumes, networks
- Intermediate: Multi-stage builds, optimization, security
- Advanced: Production patterns, debugging, internals

**Docker Compose (beginner → advanced):**
- Beginner: YAML basics, services, linking containers
- Intermediate: Networks, volumes, env vars, scaling
- Advanced: Multi-app stacks, overrides, production configs

**Kubernetes Core (beginner → advanced):**
- Beginner: Pods, deployments, services, namespaces
- Intermediate: ConfigMaps, secrets, ingress, HPA
- Advanced: RBAC, networking policies, custom resources

**Advanced DevOps (intermediate → advanced):**
- CI/CD pipelines with containers
- Helm charts
- Monitoring and observability
- Security best practices

## Visual Design

- Dark theme, minimalist, developer-focused aesthetic
- Monospace fonts for code and terminal sections
- Syntax highlighting in terminal and code blocks
- Consistent color palette: dark backgrounds, vibrant accent colors for interactive elements
- React Flow diagrams use color-coded nodes by type (blue for containers, green for pods, orange for services, purple for volumes)

## Key Components

1. `<TerminalSimulator>` — Simulated terminal with command parsing
2. `<DiagramCanvas>` — React Flow wrapper with custom nodes/edges
3. `<LessonLayout>` — Lesson page template with sections
4. `<QuizComponent>` — Multiple choice quiz with explanations
5. `<ChallengePanel>` — Terminal challenge task list and status
6. `<ProgressBar>` — Learning progress visualization
7. `<ModuleCard>` — Topic/lesson card for landing and list pages
8. `<LevelBadge>` — Beginner/intermediate/advanced indicator

## Deployment

- Vercel free tier
- Static generation for lesson pages (SSG)
- No server-side database or auth
- PR previews for content reviews