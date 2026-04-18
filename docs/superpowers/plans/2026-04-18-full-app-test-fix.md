# Full Application Test & Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Test every subsystem of the DevOps-Learn app (AI chat, lessons, rendering, content, diagrams, terminal), identify all bugs, and fix them.

**Architecture:** Start the dev server, then systematically test each subsystem by making HTTP requests and checking responses. Run existing unit tests. For each bug found, fix it and verify. Run build after each fix batch to ensure no regressions.

**Tech Stack:** Next.js 16, React 19, Vitest, @testing-library/react, curl, Node.js

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/app/api/chat/route.ts` | Gemini AI chat endpoint |
| `src/components/chat/AiChat.tsx` | AI chat UI widget |
| `src/components/lesson/LessonContent.tsx` | MDX text rendering (server) |
| `src/components/lesson/LessonInteractive.tsx` | Diagrams, terminal, quiz (client) |
| `src/lib/mdx.tsx` | MDX renderer with prose styling |
| `src/lib/content.ts` | MDX file reading + frontmatter stripping |
| `src/data/modules.ts` | All lesson definitions |
| `src/data/cheatsheet.ts` | Cheat sheet command data |
| `src/data/index.ts` | Data lookup functions |
| `src/data/excalidraw/*.ts` | 12 Excalidraw diagram scenes |
| `src/data/challenges/docker-ps-challenge.ts` | Terminal challenge |
| `src/data/quizzes/*.ts` | Quiz data |
| `src/components/terminal/TerminalSimulator.tsx` | Terminal UI |
| `src/components/terminal/CommandParser.ts` | Command parsing logic |
| `src/components/quiz/QuizComponent.tsx` | Quiz UI |
| `src/components/diagram/ExcalidrawViewer.tsx` | Excalidraw diagram viewer |
| `src/app/[locale]/cheatsheet/page.tsx` | Cheat sheet page |

---

### Task 1: Run Build & Existing Tests

**Files:**
- Verify: `package.json`, `vitest.config.ts`
- Read: `src/components/terminal/__tests__/CommandParser.test.ts`
- Read: `src/lib/__tests__/progress.test.ts`

- [ ] **Step 1: Run build to confirm clean baseline**

Run: `npm run build 2>&1 | tail -30`
Expected: Successful build, no TypeScript errors

- [ ] **Step 2: Run existing unit tests**

Run: `npx vitest run 2>&1`
Expected: All existing tests pass (2 test files)

- [ ] **Step 3: Record any test failures**

If tests fail, record the failure messages. These inform Task 2.

---

### Task 2: Test AI Chat (API + UI)

**Files:**
- Test: `src/app/api/chat/route.ts`
- Test: `src/components/chat/AiChat.tsx`

- [ ] **Step 1: Start dev server in background**

Run: `npx next dev -p 3001 2>&1 &` then wait 8 seconds for compilation

- [ ] **Step 2: Test API endpoint directly with curl**

Run:
```bash
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is Docker?","history":[]}' \
  --max-time 30 | head -c 500
```
Expected: JSON response with `reply` field containing Docker explanation

- [ ] **Step 3: Test API with empty message**

Run:
```bash
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"","history":[]}' \
  --max-time 5
```
Expected: HTTP 400 with error "Message is required"

- [ ] **Step 4: Test API with missing GEMINI_API_KEY**

Temporarily set `GEMINI_API_KEY=""` and test. Expected: 500 error with clear message.

- [ ] **Step 5: Check AiChat component renders in page HTML**

Run: `curl -s http://localhost:3001/en 2>/dev/null | grep -o 'AI\|ai-chat\|AiChat\|DevOps AI Tutor' | head -5`
Expected: AI chat button present in page HTML

- [ ] **Step 6: Fix any API or UI issues found**

If the API returns 404 or 500, check:
- `route.ts` model name is `gemini-2.5-flash` (not `gemini-2.0-flash`)
- `.env.local` has valid `GEMINI_API_KEY`
- Error handling returns proper JSON

---

### Task 3: Test All Lesson Pages (Content + Rendering)

**Files:**
- Test: All 20 English lesson pages at `/en/learn/{topic}/{slug}`
- Verify: `content/en/**/*.mdx` (20 files)
- Verify: `src/lib/content.ts`, `src/lib/mdx.tsx`, `src/components/lesson/LessonContent.tsx`

- [ ] **Step 1: Test every Docker lesson page loads (HTTP 200)**

```bash
for slug in containers-101 dockerfile-basics volumes-networks multi-stage-builds docker-security production-patterns; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/docker/$slug)
  echo "docker/$slug: $code"
done
```
Expected: All 200

- [ ] **Step 2: Test every Compose lesson page loads (HTTP 200)**

```bash
for slug in yaml-basics multi-service compose-networks-volumes compose-env-scaling compose-production; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/compose/$slug)
  echo "compose/$slug: $code"
done
```
Expected: All 200

- [ ] **Step 3: Test every Kubernetes lesson page loads (HTTP 200)**

```bash
for slug in pods-deployments services-ingress configmaps-secrets hpa-scaling rbac-network-policies; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/kubernetes/$slug)
  echo "kubernetes/$slug: $code"
done
```
Expected: All 200

- [ ] **Step 4: Test every DevOps lesson page loads (HTTP 200)**

```bash
for slug in cicd-containers helm-charts monitoring-observability security-best-practices; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/devops/$slug)
  echo "devops/$slug: $code"
done
```
Expected: All 200

- [ ] **Step 5: Check MDX text content renders (not blank)**

```bash
for slug in containers-101 dockerfile-basics volumes-networks; do
  content=$(curl -s --max-time 15 http://localhost:3001/en/learn/docker/$slug | grep -o 'prose\|<h1\|<h2\|<p\|<code' | head -3)
  echo "docker/$slug: $content"
done
```
Expected: Each page has `prose` class and heading/paragraph tags

- [ ] **Step 6: Check no orphaned interactive headings in rendered HTML**

```bash
curl -s --max-time 15 http://localhost:3001/en/learn/docker/containers-101 | \
  grep -c 'Interactive Diagram\|Try It Yourself\|Test Your Knowledge'
```
Expected: Count should be 3 (one from each section in LessonInteractive), NOT 6 (which would mean duplicate headings from MDX)

- [ ] **Step 7: Verify tables render with proper styling**

```bash
curl -s --max-time 15 http://localhost:3001/en/learn/docker/containers-101 | \
  grep -o 'prose-table\|<table\|<th\|<td' | head -5
```
Expected: Table tags present in HTML

- [ ] **Step 8: Verify code blocks render with proper styling**

```bash
curl -s --max-time 15 http://localhost:3001/en/learn/docker/containers-101 | \
  grep -o 'prose-pre\|<pre\|prose-code' | head -5
```
Expected: Pre/code tags present with prose styling

- [ ] **Step 9: Fix any rendering issues found**

Common fixes:
- If pages return 404: lesson slug in `modules.ts` doesn't match MDX filename or `getLesson` can't find it
- If pages are blank: MDX content file missing or `stripInteractiveTags` strips too much
- If duplicate headings: update the heading stripping regex in `LessonContent.tsx`
- If tables don't render: `remark-gfm` not applied (check `mdx.tsx`)

---

### Task 4: Test Diagrams (Excalidraw Scenes)

**Files:**
- Verify: `src/data/excalidraw/*.ts` (12 files)
- Verify: `src/components/lesson/LessonInteractive.tsx`
- Verify: `src/components/diagram/ExcalidrawViewer.tsx`

- [ ] **Step 1: Verify all Excalidraw scenes are registered in LessonInteractive**

Read `src/components/lesson/LessonInteractive.tsx` and check the `excalidrawScenes` map has entries for all 12 scene IDs. Cross-reference with `modules.ts` diagram IDs.

Expected: All 12 diagram IDs in modules.ts have matching entries in excalidrawScenes map

- [ ] **Step 2: Verify all scene files export valid structure**

For each file in `src/data/excalidraw/`, check that the default export has `elements` (array), `appState` (object), and `scrollToContent` (true). Run a quick Node.js validation:

```bash
for f in src/data/excalidraw/*.ts; do
  node -e "
    const m = require('$f'.replace('src/','.').replace('.ts',''));
    const keys = Object.keys(m.default || m);
    console.log('$f', 'has elements:', Array.isArray(m.default?.elements || m.elements), 'count:', (m.default?.elements || m.elements)?.length || 0);
  " 2>&1 || echo "$f: IMPORT ERROR"
done
```
Note: This may fail due to TS imports — if so, manually check each file has `elements as any[]` and `appState`

- [ ] **Step 3: Check diagram data index matches**

Read `src/data/index.ts` and verify `diagramMap` has entries for all diagram IDs used in `modules.ts`. Also verify any React Flow fallback diagrams have valid node/edge structure.

- [ ] **Step 4: Test lesson pages with diagrams contain diagram component markup**

```bash
for slug in containers-101 dockerfile-basics volumes-networks multi-stage-builds docker-security production-patterns; do
  has=$(curl -s --max-time 15 http://localhost:3001/en/learn/docker/$slug | grep -c 'excalidraw\|Interactive Diagram' || true)
  echo "docker/$slug diagram sections: $has"
done
```
Expected: Each lesson with a diagram should have at least 1 match

- [ ] **Step 5: Fix any diagram registration or data issues**

Common fixes:
- Missing scene import in `LessonInteractive.tsx`
- Scene ID mismatch between `modules.ts` diagram field and `excalidrawScenes` key
- Invalid element structure (missing required fields)

---

### Task 5: Test Terminal Simulator & Challenges

**Files:**
- Test: `src/components/terminal/CommandParser.ts`
- Test: `src/data/challenges/docker-ps-challenge.ts`
- Verify: `src/components/terminal/TerminalSimulator.tsx`

- [ ] **Step 1: Run existing CommandParser unit tests**

Run: `npx vitest run src/components/terminal/__tests__/CommandParser.test.ts 2>&1`
Expected: All tests pass

- [ ] **Step 2: Test multi-word command matching manually**

```bash
node -e "
const { matchCommand, executeCommand } = require('./src/components/terminal/CommandParser.ts');
" 2>&1 || echo "Can't require TS directly — use vitest"
```
If require fails, write a quick vitest inline test:

Create temporary test file:
```typescript
// src/components/terminal/__tests__/multiword.test.ts
import { matchCommand, executeCommand } from '../CommandParser';
import type { CommandHandler } from '@/types';

const commands: Record<string, CommandHandler> = {
  docker: { output: () => 'docker usage' },
  'docker ps': { output: () => 'CONTAINERS' },
  'docker run': { output: (args) => 'run ' + args.join(' ') },
  'docker compose up': { output: () => 'compose up' },
  help: { output: () => 'help text' },
};

describe('multi-word commands', () => {
  test('bare docker matches', () => {
    const r = matchCommand('docker', commands);
    expect(r.command).toBe('docker');
  });
  test('docker ps matches', () => {
    const r = matchCommand('docker ps', commands);
    expect(r.command).toBe('docker ps');
  });
  test('docker compose up matches', () => {
    const r = matchCommand('docker compose up', commands);
    expect(r.command).toBe('docker compose up');
  });
  test('docker run -d nginx matches', () => {
    const r = matchCommand('docker run -d nginx', commands);
    expect(r.command).toBe('docker run');
    expect(r.args).toEqual(['-d', 'nginx']);
  });
  test('unknown command returns first word', () => {
    const r = matchCommand('kubectl get pods', commands);
    expect(r.command).toBe('kubectl');
  });
});
```

- [ ] **Step 3: Run the new multi-word test**

Run: `npx vitest run src/components/terminal/__tests__/multiword.test.ts 2>&1`
Expected: All 5 tests pass

- [ ] **Step 4: Test challenge data completeness**

Read `src/data/challenges/docker-ps-challenge.ts` and verify:
- `docker` command handler exists (bare command)
- `docker ps` returns container list
- `docker run` with `-d` completes the "run-container" task
- `docker stop` completes the "stop-container" task
- `help` lists all available commands
- `docker compose up` and `docker compose down` exist

- [ ] **Step 5: Test the challenge lesson page renders terminal**

```bash
curl -s --max-time 15 http://localhost:3001/en/learn/docker/containers-101 | \
  grep -o 'Try It Yourself\|TerminalSimulator\|terminal' | head -5
```
Expected: "Try It Yourself" section present

- [ ] **Step 6: Fix any terminal or command issues found**

Common fixes:
- Missing command handler in challenge data
- `matchCommand` returning wrong command for edge cases
- Task validation not triggering

---

### Task 6: Test Quiz Component & Data

**Files:**
- Test: `src/data/quizzes/docker-basics-quiz.ts`
- Test: `src/data/quizzes/placement-quiz.ts`
- Verify: `src/components/quiz/QuizComponent.tsx`
- Verify: `src/data/index.ts`

- [ ] **Step 1: Verify quiz data structure is valid**

Read `src/data/quizzes/docker-basics-quiz.ts` and check:
- Each question has `id`, `question`, `options` (array of 4), `correctAnswer` (number 0-3), `explanation`
- `options` array has exactly 4 items
- `correctAnswer` is within range

- [ ] **Step 2: Verify quiz is registered in data index**

Read `src/data/index.ts` and check `quizMap` has `docker-basics-quiz` entry pointing to the correct import.

- [ ] **Step 3: Test the quiz lesson page renders quiz**

```bash
curl -s --max-time 15 http://localhost:3001/en/learn/docker/containers-101 | \
  grep -o 'Quiz\|quiz\|Test Your Knowledge' | head -5
```
Expected: Quiz section present

- [ ] **Step 4: Verify placement quiz page works**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/level-test
```
Expected: 200

- [ ] **Step 5: Fix any quiz issues found**

Common fixes:
- Missing quiz ID in `quizMap`
- Invalid question structure
- Quiz component not rendering due to missing data

---

### Task 7: Test Cheat Sheet Page

**Files:**
- Test: `src/app/[locale]/cheatsheet/page.tsx`
- Test: `src/data/cheatsheet.ts`

- [ ] **Step 1: Test cheat sheet page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/cheatsheet
```
Expected: 200

- [ ] **Step 2: Verify all 4 topic tabs render**

```bash
curl -s --max-time 15 http://localhost:3001/en/cheatsheet | \
  grep -o 'Docker\|Docker Compose\|Kubernetes\|DevOps / CI-CD' | sort -u
```
Expected: All 4 topic labels present

- [ ] **Step 3: Verify cheat sheet data covers all topics**

Read `src/data/cheatsheet.ts` and confirm:
- Docker: at least 6 categories with 40+ commands
- Compose: at least 3 categories
- Kubernetes: at least 5 categories
- DevOps: at least 2 categories with topic "devops"
- Topic type "devops" exists in `CheatsheetCategory` type

- [ ] **Step 4: Verify search filtering works in page component**

The `CheatsheetPage` component filters by `activeTopic` and `search` string. Check the filter logic reads correctly — `cat.topic === activeTopic` and command/description matching.

- [ ] **Step 5: Fix any cheat sheet issues found**

Common fixes:
- Topic tab missing (add to `topics` array in page)
- `topicLabels` or `topicIcons` missing key for new topic
- `cheatsheetData` topic strings don't match `activeTopic` values

---

### Task 8: Test Playground Page & Other Pages

**Files:**
- Test: `src/app/[locale]/playground/page.tsx`
- Test: `src/app/[locale]/page.tsx` (home)
- Test: `src/app/[locale]/learn/page.tsx` (topic index)
- Test: `src/app/[locale]/level-test/page.tsx`

- [ ] **Step 1: Test home page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en
```
Expected: 200

- [ ] **Step 2: Test learn topic index page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn
```
Expected: 200

- [ ] **Step 3: Test each topic index page loads**

```bash
for topic in docker compose kubernetes devops; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/$topic)
  echo "$topic: $code"
done
```
Expected: All 200

- [ ] **Step 4: Test playground page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/playground
```
Expected: 200

- [ ] **Step 5: Test level-test page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/level-test
```
Expected: 200

- [ ] **Step 6: Test non-existent lesson returns 404**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/en/learn/docker/nonexistent-lesson
```
Expected: 404

- [ ] **Step 7: Fix any page issues found**

Common fixes:
- `getLesson` returns undefined for invalid slug — ensure page.tsx calls `notFound()`
- Topic index page not listing lessons correctly

---

### Task 9: Test i18n / Locale Routing

**Files:**
- Verify: `src/proxy.ts`
- Verify: `src/i18n/config.ts`, `src/i18n/request.ts`

- [ ] **Step 1: Test locale redirect works**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 10 http://localhost:3001/
```
Expected: 307 redirect to `/en` (or 200 if root page handles redirect)

- [ ] **Step 2: Test Arabic locale page loads**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/ar
```
Expected: 200

- [ ] **Step 3: Test Arabic lesson page (only containers-101 has Arabic content)**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/ar/learn/docker/containers-101
```
Expected: 200 (with Arabic text if content/ar/docker/containers-101.mdx exists)

- [ ] **Step 4: Test Arabic lesson without content still renders (interactive parts)**

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3001/ar/learn/docker/dockerfile-basics
```
Expected: 200 (no text content but interactive components still render)

- [ ] **Step 5: Fix any locale issues found**

Common fixes:
- proxy.ts not redirecting correctly
- Missing locale in config
- Arabic MDX content missing for most lessons (expected — not a bug)

---

### Task 10: Fix All Issues Found & Write Unit Tests

**Files:**
- Create: `src/components/terminal/__tests__/multiword.test.ts`
- Create: `src/data/__tests__/modules.test.ts`
- Create: `src/data/__tests__/cheatsheet.test.ts`
- Create: `src/lib/__tests__/content.test.ts`
- Modify: Any files with bugs found in Tasks 1-9

- [ ] **Step 1: Write unit test for modules data integrity**

```typescript
// src/data/__tests__/modules.test.ts
import { getModule, getLesson, getAllModules } from '../modules';
import type { Topic } from '@/types';

describe('modules data', () => {
  test('all topics have modules', () => {
    const topics: Topic[] = ['docker', 'compose', 'kubernetes', 'devops'];
    topics.forEach(t => {
      expect(getModule(t)).toBeDefined();
      expect(getModule(t).lessons.length).toBeGreaterThan(0);
    });
  });

  test('every lesson has required fields', () => {
    getAllModules().forEach(mod => {
      mod.lessons.forEach(l => {
        expect(l.slug).toBeTruthy();
        expect(l.title).toBeTruthy();
        expect(l.module).toBeTruthy();
        expect(l.level).toMatch(/beginner|intermediate|advanced/);
        expect(l.description).toBeTruthy();
        expect(l.order).toBeGreaterThan(0);
      });
    });
  });

  test('getLesson finds existing lessons', () => {
    const lesson = getLesson('docker', 'containers-101');
    expect(lesson).toBeDefined();
    expect(lesson?.title).toBe('Containers 101');
  });

  test('getLesson returns undefined for missing lessons', () => {
    expect(getLesson('docker', 'nonexistent')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Write unit test for cheatsheet data**

```typescript
// src/data/__tests__/cheatsheet.test.ts
import { cheatsheetData } from '../cheatsheet';

describe('cheatsheet data', () => {
  test('has all four topics', () => {
    const topics = new Set(cheatsheetData.map(c => c.topic));
    expect(topics.has('docker')).toBe(true);
    expect(topics.has('compose')).toBe(true);
    expect(topics.has('kubernetes')).toBe(true);
    expect(topics.has('devops')).toBe(true);
  });

  test('every command has required fields', () => {
    cheatsheetData.forEach(cat => {
      expect(cat.category).toBeTruthy();
      cat.commands.forEach(cmd => {
        expect(cmd.command).toBeTruthy();
        expect(cmd.description).toBeTruthy();
        expect(cmd.example).toBeTruthy();
      });
    });
  });

  test('docker has 6+ categories', () => {
    const dockerCats = cheatsheetData.filter(c => c.topic === 'docker');
    expect(dockerCats.length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 3: Write unit test for content reading**

```typescript
// src/lib/__tests__/content.test.ts
import { getLessonContent, getContentBody, parseFrontmatter } from '../content';

describe('content utilities', () => {
  test('getLessonContent returns content for existing lesson', () => {
    const content = getLessonContent('en', 'docker', 'containers-101');
    expect(content).toBeTruthy();
    expect(content).toContain('---');
    expect(content).toContain('What Are Containers');
  });

  test('getLessonContent returns null for missing lesson', () => {
    const content = getLessonContent('en', 'docker', 'nonexistent-lesson');
    expect(content).toBeNull();
  });

  test('getContentBody strips frontmatter', () => {
    const raw = '---\ntitle: Test\n---\n# Hello';
    const body = getContentBody(raw);
    expect(body).toBe('# Hello');
  });

  test('getContentBody handles no frontmatter', () => {
    const raw = '# Hello';
    const body = getContentBody(raw);
    expect(body).toBe('# Hello');
  });

  test('parseFrontmatter extracts key-value pairs', () => {
    const raw = '---\ntitle: Test\nlevel: beginner\n---\nContent';
    const fm = parseFrontmatter(raw);
    expect(fm.title).toBe('Test');
    expect(fm.level).toBe('beginner');
  });
});
```

- [ ] **Step 4: Run all tests**

Run: `npx vitest run 2>&1`
Expected: All tests pass (existing 2 + new ~15)

- [ ] **Step 5: Apply all bug fixes from Tasks 1-9**

Go through the list of issues found during testing. Fix each one. After each fix, run:
```bash
npm run build 2>&1 | tail -5
```
to verify no regression.

- [ ] **Step 6: Run final full test suite**

Run: `npx vitest run 2>&1`
Expected: All tests pass

- [ ] **Step 7: Run final build**

Run: `npm run build 2>&1 | tail -25`
Expected: Clean build, no errors

- [ ] **Step 8: Commit all fixes and tests**

```bash
git add -A
git commit -m "test: comprehensive test suite and bug fixes for all subsystems

- Add unit tests for modules, cheatsheet, content, multi-word commands
- Fix all rendering, diagram, terminal, and API issues found
- Verify all 17 lesson pages load correctly

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

### Task 11: Final End-to-End Smoke Test

**Files:** None (verification only)

- [ ] **Step 1: Kill dev server and restart fresh**

```bash
pkill -f "next dev" 2>/dev/null
sleep 2
npx next dev -p 3001 2>&1 &
sleep 10
```

- [ ] **Step 2: Test every single page route returns 200**

```bash
pages=(
  "/en" "/en/learn" "/en/learn/docker" "/en/learn/compose"
  "/en/learn/kubernetes" "/en/learn/devops"
  "/en/learn/docker/containers-101"
  "/en/learn/docker/dockerfile-basics"
  "/en/learn/docker/volumes-networks"
  "/en/learn/docker/multi-stage-builds"
  "/en/learn/docker/docker-security"
  "/en/learn/docker/production-patterns"
  "/en/learn/compose/yaml-basics"
  "/en/learn/compose/multi-service"
  "/en/learn/compose/compose-networks-volumes"
  "/en/learn/compose/compose-env-scaling"
  "/en/learn/compose/compose-production"
  "/en/learn/kubernetes/pods-deployments"
  "/en/learn/kubernetes/services-ingress"
  "/en/learn/kubernetes/configmaps-secrets"
  "/en/learn/kubernetes/hpa-scaling"
  "/en/learn/kubernetes/rbac-network-policies"
  "/en/learn/devops/cicd-containers"
  "/en/learn/devops/helm-charts"
  "/en/learn/devops/monitoring-observability"
  "/en/learn/devops/security-best-practices"
  "/en/cheatsheet" "/en/playground" "/en/level-test"
)
for p in "${pages[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 "http://localhost:3001$p")
  echo "$p: $code"
done
```
Expected: All 28 pages return 200

- [ ] **Step 3: Test AI chat endpoint**

```bash
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Explain docker-compose","history":[]}' \
  --max-time 30 | python3 -c "import sys,json; d=json.load(sys.stdin); print('reply' in d, len(d.get('reply','')))" 2>&1
```
Expected: `True 500+` (has reply field with substantial content)

- [ ] **Step 4: Kill dev server**

```bash
pkill -f "next dev" 2>/dev/null
```

- [ ] **Step 5: Final build verification**

```bash
npm run build 2>&1 | tail -25
```
Expected: Clean build

- [ ] **Step 6: Push to GitHub**

```bash
git push origin main
```