# DevOps Learn

Free, visual learning platform for Docker, Kubernetes, Docker Compose, and DevOps. Learn through interactive diagrams, simulated terminals, quizzes, and hands-on challenges.

![Dark theme dashboard](public/og-image.png)

## ☕ Support My Work

If this project helped you, consider [buying me a coffee](https://ko-fi.com/osamaabobakr)! Your support helps me keep building AI tools and useful open-source projects.

## Features

- **Interactive Diagrams** — Explore architecture visually with React Flow. Step-by-step progressive reveal walks you through each component and data flow. Click nodes for details.
- **Terminal Simulator** — Practice real Docker and Kubernetes commands in a simulated terminal with challenge tasks.
- **Quizzes** — Test your knowledge with multiple-choice quizzes featuring scenario-based questions and detailed explanations.
- **Progress Tracking** — Track your progress across lessons with localStorage (no account needed).
- **Placement Quiz** — Find your starting level with a 22-question assessment covering Docker, Compose, Kubernetes, and DevOps.
- **Cheat Sheet** — Quick reference for common Docker, Compose, and K8s commands.
- **Custom Exam** — AI-generated practice exams tailored to your weak areas.
- **Playground** — Free-form terminal sandbox for practice.
- **i18n** — Full English and Arabic support with RTL layout. All 30 lessons translated.
- **Dark Theme** — Developer-focused dark design with monospace fonts.

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Next.js 16 (App Router) |
| Diagrams | React Flow + D3 |
| Terminal | xterm.js |
| Content | MDX (next-mdx-remote) |
| i18n | next-intl |
| Styling | Tailwind CSS 4 |
| Progress | localStorage |
| Testing | Vitest |
| Deployment | Vercel |

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker Development

```bash
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/[locale]/          # Next.js App Router pages
│   ├── learn/             # Module list + lesson pages
│   ├── level-test/        # Placement quiz
│   ├── playground/        # Terminal sandbox
│   ├── cheatsheet/        # Quick reference
│   └── custom-exam/       # AI-generated exams
├── components/
│   ├── diagram/           # React Flow nodes, edges, canvas, step controls
│   ├── layout/            # Navbar, Sidebar, Footer, LessonLayout
│   ├── mdx/               # MDX component mapping
│   ├── progress/          # ModuleCard, ProgressBar, LevelBadge
│   ├── quiz/              # QuizComponent
│   └── terminal/          # TerminalSimulator, CommandParser, ChallengePanel
├── context/               # ProgressContext (localStorage)
├── data/
│   ├── __tests__/          # Diagram and quiz validation tests
│   ├── challenges/         # Terminal challenge definitions
│   ├── diagrams/           # React Flow diagram configs (30 diagrams)
│   ├── modules.ts          # Module and lesson registry
│   └── quizzes/            # Quiz question data (31 quizzes)
├── i18n/                  # en.json, ar.json translations
├── lib/
│   ├── content.ts         # MDX content loader
│   ├── mdx.tsx            # MDX renderer
│   └── progress.ts        # localStorage helpers
└── types/index.ts          # Core TypeScript types

content/
├── en/                    # English MDX lessons (30 files)
└── ar/                    # Arabic MDX lessons (30 files)
```

## Learning Paths

### Docker Fundamentals (7 lessons)
- **Beginner**: Containers 101, Dockerfile Basics, Volumes & Networks
- **Intermediate**: Multi-Stage Builds, Docker Security, Docker Troubleshooting
- **Advanced**: Production Patterns

### Docker Compose (5 lessons)
- **Beginner**: Compose YAML Basics, Multi-Service Stacks
- **Intermediate**: Networks & Volumes, Env Vars & Scaling
- **Advanced**: Production Configs

### Kubernetes Core (6 lessons)
- **Beginner**: Pods & Deployments, Services & Ingress
- **Intermediate**: ConfigMaps & Secrets, HPA & Scaling
- **Advanced**: RBAC & Network Policies, StatefulSets & Jobs

### DevOps (12 lessons)
- **Beginner**: DevOps Fundamentals, CI/CD Basics, Version Control for Ops
- **Intermediate**: CI/CD with Containers, Helm Charts, GitOps & ArgoCD, Infrastructure as Code
- **Advanced**: Monitoring & Observability, Security Best Practices, Advanced CI/CD Pipelines, CI/CD at Scale (Netflix & Meta), Container Orchestration at Scale

**Total: 30 lessons** across 4 modules, each with interactive diagrams, quizzes, and bilingual content.

## Content Highlights

### Interactive Diagrams
All 30 lessons include React Flow diagrams with step-by-step progressive reveal. Each diagram:
- Groups nodes and edges into 4-5 conceptual steps
- Highlights active components as you progress
- Supports click-to-inspect on every node
- Uses animated edges for data flows and sync operations

### Quizzes
31 quizzes with 5-22 questions each:
- Multiple-choice with 4 options per question
- Scenario-based questions on every quiz (real-world situations)
- Detailed explanations for every answer
- Placement quiz (22 questions) to find your starting level

### Bilingual Content
Every lesson has full MDX content in both English and Arabic:
- Technical diagrams and code blocks preserved in both languages
- RTL layout support for Arabic
- Consistent terminology across translations

## Adding New Lessons

1. Create an MDX file in `content/en/{topic}/lesson-slug.mdx`
2. Add the Arabic translation in `content/ar/{topic}/lesson-slug.mdx`
3. Create an interactive diagram in `src/data/diagrams/lesson-slug.ts` (include `steps` array for progressive reveal)
4. Create a quiz in `src/data/quizzes/lesson-slug-quiz.ts` (minimum 5 questions, 4 options each, include a scenario question)
5. Add the lesson entry to `src/data/modules.ts`
6. Register the diagram and quiz in `src/data/index.ts`
7. Run `npm test` to validate diagram/quiz data integrity

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests validate:
- All diagram configs have valid IDs matching their map keys
- All node and edge types are valid enum values
- All edge source/target IDs reference existing nodes
- All step nodeIds/edgeIds reference existing elements
- Steps cover all non-groupZone nodes and all edges
- No duplicate node or edge IDs within a diagram
- All quiz IDs match their map keys
- Every quiz has at least 5 questions with 4 options each
- correctIndex is within valid range (0-3)
- All questions have non-empty text and explanations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Osama-Abo-Bakr/devops-learn)

Or via CLI:

```bash
npx vercel
```

## Acknowledgements

- **Ahmed Itman** — Mentor & Contributor. Senior SRE/DevOps ([ahmed.itman@thndr.app](mailto:ahmed.itman@thndr.app))

## License

MIT

---

☕ **Found this useful?** [Support my work on Ko-fi](https://ko-fi.com/osamaabobakr) — it helps me continue building tools like this one.