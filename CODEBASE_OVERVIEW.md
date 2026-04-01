# antidev-agent Codebase Overview

Comprehensive architectural and structural analysis of the antidev AI engineering toolkit, a collection of workflow skills and a persistent headless browser for Claude Code.

**Current Version:** 0.3.3 | **Status:** Production-ready with continuous development | **Last Updated:** March 2026

---

## 1. Architecture & Core Components

### 1.1 System Architecture

antidev implements a **daemon-model architecture** with persistent state:

```
Claude Code                    antidev
    ↓                             ↓
Tool Invocation         CLI (compiled Bun binary)
    ↓                      ↓       ↓
$B command          State File  Process Check
                         ↓
                   ┌─ HTTP POST /command
                   ↓
            Bun.serve() HTTP Server
                   ↓
            Playwright API Calls
                   ↓
            Chromium (headless, persistent)
```

**Key Design Principles:**
- **Persistent daemon:** First call ~3s (starts Chromium), subsequent calls ~100-200ms
- **Continuous state:** Cookies, tabs, login sessions, localStorage persist across commands
- **Daemon model:** Solves the n + 5n second problem (n startup + n commands vs. (n+1) total calls)
- **Auto-lifecycle:** Self-starts on first use, auto-stops after 30 min idle timeout
- **Random ports:** 10000-60000 range (retry on conflict) for multi-workspace safety

### 1.2 Technology Stack

| Component           | Technology                   | Purpose                                                   |
| ------------------- | ---------------------------- | --------------------------------------------------------- |
| **Build Tool**      | Bun 1.0+                     | TypeScript runtime, native SQLite, compiled binaries      |
| **Browser Engine**  | Playwright 1.58.2            | Chromium automation, ref system, snapshot generation      |
| **CLI Platform**    | Bun (compiled)               | Single ~58MB binary, no Node.js dependency, native SQLite |
| **HTTP Server**     | Bun.serve()                  | Lightweight HTTP, ~10 routes, no Express/Fastify overhead |
| **Language**        | TypeScript                   | Full project written in TS, dev mode uses raw .ts files   |
| **Testing**         | Bun test + Vitest-compatible | Unit, integration, E2E via `claude -p` subprocess         |
| **LLM Integration** | Anthropic SDK                | LLM-as-judge for eval scoring, format parsing             |
| **Source Control**  | Git                          | Standard GitHub workflow, multi-worktree support          |
| **Configuration**   | YAML Frontmatter             | SKILL.md metadata (name, version, allowed-tools)          |

### 1.3 Main Components

#### **browse/** — Headless Browser Binary
- **Purpose:** Persistent Chromium CLI and HTTP server
- **Key Files:**
  - [browse/src/cli.ts](browse/src/cli.ts) — Client: state file lookup, version check, HTTP POST
  - [browse/src/server.ts](browse/src/server.ts) — HTTP server: command dispatch, Chromium lifecycle
  - [browse/src/browser-manager.ts](browse/src/browser-manager.ts) — Playwright page/context management
  - [browse/src/commands.ts](browse/src/commands.ts) — **Command registry** (single source of truth for 50+ commands)
  - [browse/src/snapshot.ts](browse/src/snapshot.ts) — ARIA tree + @ref generation
  - [browse/src/read-commands.ts](browse/src/read-commands.ts) — Getter commands (text, html, console, network, etc.)
  - [browse/src/write-commands.ts](browse/src/write-commands.ts) — Setter commands (click, fill, type, scroll, etc.)
  - [browse/src/meta-commands.ts](browse/src/meta-commands.ts) — Screenshots, tabs, handoff/resume
  - [browse/src/cookie-picker-browser.ts](browse/src/cookie-picker-browser.ts) — Cookie import from Comet/Chrome/Arc/Brave/Edge
- **Build Output:** `browse/dist/browse` (compiled binary)
- **Command Categories:** 50+ commands across Navigation, Reading, Interaction, Inspection, Visual, Meta

#### **Skills/** — Workflow Automation (15 skills)
Each skill is a directory with `SKILL.md.tmpl` → generated `SKILL.md` + optional `bin/` scripts.

**Skill Inventory:**
1. [office-hours/](office-hours/) — YC Office Hours diagnostic (startup + builder modes)
2. [plan-ceo-review/](plan-ceo-review/) — Strategic planning review
3. [plan-eng-review/](plan-eng-review/) — Architecture & design review
4. [plan-design-review/](plan-design-review/) — Design audit
5. [design-consultation/](design-consultation/) — Design system creation
6. [review/](review/) — Pre-landing PR review (scope, checklist, diff analysis)
7. [ship/](ship/) — PR creation + deployment workflow
8. [investigate/](investigate/) — Systematic root-cause debugging
9. [qa/](qa/) — QA testing with visual evidence
10. [qa-only/](qa-only/) — Report-only QA (no fixes)
11. [design-review/](design-review/) — Design audit + fix loop
12. [document-release/](document-release/) — Post-ship doc updates
13. [retro/](retro/) — Weekly retrospective
14. [codex/](codex/) — Adversarial code review ("second opinion")
15. [careful/](careful/) — Maximum safety for production systems
16. [freeze/](freeze/) — Scope edits to single module/directory
17. [guard/](guard/) — Destructive action warnings + edit restrictions
18. [unfreeze/](unfreeze/) — Remove edit restrictions
19. [antidev-upgrade/](antidev-upgrade/) — Update antidev to latest version
20. [setup-browser-cookies/](setup-browser-cookies/) — Cookie setup workflow

**Note:** `browse/` is also a skill — it's the core browser tool.

#### **scripts/** — Build & Validation Infrastructure
- [scripts/gen-skill-docs.ts](scripts/gen-skill-docs.ts) — **Template → Markdown generator** (resolves {{PLACEHOLDERS}})
- [scripts/skill-check.ts](scripts/skill-check.ts) — **Health dashboard** (all skills validation)
- [scripts/dev-skill.ts](scripts/dev-skill.ts) — **Watch mode** (auto-regen + validate on .tmpl changes)
- [scripts/skill-taxonomy.ts](scripts/skill-taxonomy.ts) — Analytics & skill metadata extraction
- [scripts/eval-list.ts](scripts/eval-list.ts) — List eval runs from `~/.antidev-dev/evals/`
- [scripts/eval-compare.ts](scripts/eval-compare.ts) — Compare two eval run results
- [scripts/eval-select.ts](scripts/eval-select.ts) — Show which tests would run based on diff
- [scripts/eval-summary.ts](scripts/eval-summary.ts) — Aggregate stats across eval runs
- [scripts/eval-watch.ts](scripts/eval-watch.ts) — Long-running eval monitor
- [scripts/analytics.ts](scripts/analytics.ts) — Event tracking & telemetry

#### **test/** — Test & Eval Infrastructure
- [test/skill-validation.test.ts](test/skill-validation.test.ts) — **Tier 1 (free, <1s):** Static SKILL.md validation
- [test/gen-skill-docs.test.ts](test/gen-skill-docs.test.ts) — **Tier 1:** Generator quality checks
- [test/skill-llm-eval.test.ts](test/skill-llm-eval.test.ts) — **Tier 3 (paid, ~$0.15/run):** LLM-as-judge quality eval
- [test/skill-e2e.test.ts](test/skill-e2e.test.ts) — **Tier 2 (paid, ~$3.85/run):** E2E via `claude -p` subprocess
- [test/skill-routing-e2e.test.ts](test/skill-routing-e2e.test.ts) — **Tier 2:** Skill routing & preamble tests
- [test/helpers/skill-parser.ts](test/helpers/skill-parser.ts) — Parse & validate SKILL.md structure
- [test/helpers/session-runner.ts](test/helpers/session-runner.ts) — Spawn `claude -p` subprocess, parse NDJSON output
- [test/helpers/llm-judge.ts](test/helpers/llm-judge.ts) — Claude-Sonnet-4-6 quality scoring (clarity, completeness, actionability)
- [test/helpers/eval-store.ts](test/helpers/eval-store.ts) — Persist eval results + cost tracking
- [test/helpers/touchfiles.ts](test/helpers/touchfiles.ts) — **Diff-based test selection** (declare file dependencies)
- [test/fixtures/](test/fixtures/) — Ground truth JSON, planted bugs, eval baselines

---

## 2. Skill Structure (SKILL.md Template System)

### 2.1 Template Architecture

Each skill follows this pattern:

```
skill-name/
├── SKILL.md.tmpl          ← Source template (edit this)
├── SKILL.md               ← Generated markdown (commit this)
├── bin/                   ← Optional helper scripts
│   └── some-tool
├── references/            ← Optional data files
└── templates/             ← Optional sub-templates
```

### 2.2 SKILL.md Anatomy

```yaml
---
name: skill-name
version: 1.0.0
description: |
  Multi-line description visible in Claude Code skill selector.
  Tells Claude when to suggest this skill.
allowed-tools:
  - Bash
  - Read
  - Edit
  - AskUserQuestion
---

{{PREAMBLE}}

# Main Skill Content

Markdown with bash code blocks. Each block is self-contained.
```

### 2.3 Template Placeholders

| Placeholder              | Resolved By                         | Purpose                                                         |
| ------------------------ | ----------------------------------- | --------------------------------------------------------------- |
| `{{PREAMBLE}}`           | Resolver in antidev core            | Injects session context (current project, branch, working mode) |
| `{{BROWSE_SETUP}}`       | gen-skill-docs.ts                   | Injects browse binary setup instructions                        |
| `{{BASE_BRANCH_DETECT}}` | gen-skill-docs.ts                   | Detects main/master/trunk for PR workflows                      |
| `{{COMMAND_REFERENCE}}`  | Indexed from browse/src/commands.ts | Browse command reference table                                  |
| `{{SNAPSHOT_FLAGS}}`     | Indexed from browse/src/snapshot.ts | Snapshot flag documentation                                     |

### 2.4 Generation Pipeline

```
SKILL.md.tmpl
    ↓ (bun run gen:skill-docs)
Regex match {{PLACEHOLDER}}
    ↓
Resolve from source:
  - browse/src/commands.ts
  - browse/src/snapshot.ts
  - scripts/*.ts
    ↓
Format & inject
    ↓
SKILL.md (committed)

Used in CI (workflows/skill-docs.yml):
  - Run gen:skill-docs on every PR
  - Fail if generated files don't match committed .md
  - Ensures SKILL.md never gets out of sync with source
```

### 2.5 Platform-Agnostic Design Philosophy

**Critical constraint:** Skills must never hardcode project-specific paths, commands, or patterns.

**Solution:** Store project config in `CLAUDE.md`:
- Test commands: `bun test` or `npm test`?
- Eval commands: Which LLM evals?
- Build commands: `npm run build` or `cargo build`?
- Deploy commands: Vercel? AWS? Custom?

**Pattern:**
1. Skill tries to read `CLAUDE.md` (project-specific config)
2. If missing, asks user via AskUserQuestion
3. User answers, answer is cached
4. Never ask again for that project

---

## 3. Test & Eval Framework

### 3.1 Test Pyramid

```
┌─────────────────────────────────────────┐
│  Tier 3: E2E + LLM-as-Judge            │  $4/run
│  (14 LangChain evals, diff-based)      │  ~10 min
├─────────────────────────────────────────┤
│  Tier 2: Integration (E2E via claude)   │  Free (local)
│  (browse integration + skill routing)   │  ~1 sec per test
├─────────────────────────────────────────┤
│  Tier 1: Unit (static validation)       │  Free (local)
│  (SKILL.md format, command registry)    │  <1 sec
└─────────────────────────────────────────┘
```

### 3.2 Test Execution

```bash
bun test                          # Tier 1 only (free, <2s)
bun run test:evals                # Tier 3 diff-based (paid, diff-aware)
bun run test:evals:all            # Tier 3 all tests (paid, force)
bun run test:e2e                  # Tier 2 diff-based
bun run eval:select               # Preview which tests would run
bun run eval:compare              # Compare two eval runs
bun run skill:check               # Health dashboard
```

### 3.3 Diff-Based Test Selection

**Problem:** Every skill change potentially affects every eval test (~$4 each). Naive: run all tests on every change = $56+ per PR.

**Solution:** Declare file dependencies in `test/helpers/touchfiles.ts`:

```typescript
export const TOUCHFILES = {
  'skill-routing-e2e': [
    'review/SKILL.md',
    'investigate/SKILL.md',
    'browse/src/commands.ts',
  ],
  'investigate-llm-eval': [
    'investigate/SKILL.md.tmpl',
    'test/helpers/session-runner.ts',
  ],
};
```

**When a file changes:**
- CI/dev runs `git diff origin/main --name-only`
- Intersects with TOUCHFILES mapping
- Only affected tests run
- **Result:** Most PRs run ~2-3 tests, not all 14 (~$8-12 instead of $56+)

### 3.4 Test Helpers

| Helper                                              | Purpose                                                                                       | Usage               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------- |
| [skill-parser.ts](test/helpers/skill-parser.ts)     | Parse SKILL.md, extract $B commands, validate against command registry                        | Tier 1 validation   |
| [session-runner.ts](test/helpers/session-runner.ts) | Spawn `claude -p` subprocess, stream NDJSON, parse output, detect browse errors               | Tier 2 E2E          |
| [llm-judge.ts](test/helpers/llm-judge.ts)           | Call claude-sonnet-4-6 for quality scoring (clarity 1-5, completeness 1-5, actionability 1-5) | Tier 3 evals        |
| [eval-store.ts](test/helpers/eval-store.ts)         | Persist eval results to `~/.antidev-dev/evals/`, track costs, enable comparison               | Reporting           |
| [touchfiles.ts](test/helpers/touchfiles.ts)         | Map skills → file dependencies for diff-based selection                                       | CI/dev optimization |

### 3.5 LLM-as-Judge Scoring

Quality evals use Claude-Sonnet-4-6 to score:
- **Clarity (1-5):** Can an agent understand what each command does?
- **Completeness (1-5):** Are all arguments and behaviors documented?
- **Actionability (1-5):** Can an agent construct correct invocations without guessing?

**Cost Model:**
- LLM-as-judge eval: ~$0.15/run
- E2E test (claude -p subprocess): ~$3.85/run (includes LLM turns)
- Total budget for full eval suite: **~$4/run max** with diff-based selection

### 3.6 Eval Results Storage

```
~/.antidev-dev/evals/
├── run-2026-03-31T14-32-45.json   ← Result from one run
├── run-2026-03-31T10-15-22.json   ← Previous run
└── ...

Each run includes:
  - timestamp
  - skill name
  - test type (llm-eval, e2e, etc.)
  - cost estimmate (USD)
  - pass/fail
  - output transcript
```

---

## 4. Integration Points (CI/CD & External Tools)

### 4.1 GitHub Workflows

| Workflow                 | File                                                                 | Trigger                | Action                                                      |
| ------------------------ | -------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------- |
| **Skill Docs Freshness** | [.github/workflows/skill-docs.yml](.github/workflows/skill-docs.yml) | `push`, `pull_request` | Run `bun run gen:skill-docs`, fail if .md files out of sync |

### 4.2 External Integrations

#### **Conductor Workspace Management**
- [conductor.json](conductor.json) — Metadata for multi-worktree setups
- Scripts: [bin/dev-setup](bin/dev-setup), [bin/dev-teardown](bin/dev-teardown)
- Enables: symlink-based dev mode (skills reload on edit)

#### **Supabase Functions** (Optional)
- [supabase/functions/update-check/](supabase/functions/update-check/) — Version check endpoint
- [supabase/functions/community-pulse/](supabase/functions/community-pulse/) — Community metrics
- Used by: `bin/antidev-update-check`, `bin/antidev-community-dashboard`

#### **Browse Helper Binaries**
- [browse/bin/find-browse](browse/bin/find-browse) — Locate browse binary in PATH
- [browse/bin/remote-slug](browse/bin/remote-slug) — Extract repository root + slug

#### **Telemetry & Analytics** (Optional, Privacy-Respecting)
- [bin/antidev-telemetry-log](bin/antidev-telemetry-log) — Log user actions
- [bin/antidev-telemetry-sync](bin/antidev-telemetry-sync) — Sync to backend (opt-in)
- [bin/antidev-analytics](bin/antidev-analytics) — View aggregated trends

### 4.3 Environment Setup

**Required:**
- Bun 1.0+
- Git
- Claude Code (for skill invocation)

**Optional (for evals):**
- `ANTHROPIC_API_KEY` — Required for `bun run test:evals`

**Optional (for telemetry):**
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — For update checks

---

## 5. Critical Configuration Files

### 5.1 Core Configuration

| File                             | Purpose                                                               | Type       |
| -------------------------------- | --------------------------------------------------------------------- | ---------- |
| [package.json](package.json)     | Bun manifest, build scripts, dependencies (Playwright, Anthropic SDK) | JSON       |
| [.env.example](.env.example)     | Template for optional environment variables (ANTHROPIC_API_KEY)       | Shell      |
| [conductor.json](conductor.json) | Conductor workspace metadata (scripts, archive methods)               | JSON       |
| [VERSION](VERSION)               | Current version string (0.3.3)                                        | Plain text |

### 5.2 Core Metadata

| File                                      | Purpose                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------ |
| [CLAUDE.md](CLAUDE.md) — **YOU ARE HERE** | Developer guide: quick start, commands, architecture, testing, troubleshooting |
| [ARCHITECTURE.md](ARCHITECTURE.md)        | Deep dive: daemon model, security, ref system, logging, template system, etc.  |
| [CONTRIBUTING.md](CONTRIBUTING.md)        | Contributor workflow: dev mode, skill authoring, testing, deployment           |
| [BROWSER.md](BROWSER.md)                  | Browse binary technical reference: command catalog, Playwright internals       |
| [README.md](README.md)                    | User marketing & installation guide (general audience)                         |
| [CHANGELOG.md](CHANGELOG.md)              | User-facing release notes (what changed, not implementation details)           |
| [SKILL.md](SKILL.md)                      | Generated index of all antidev skills                                          |
| [TODOS.md](TODOS.md)                      | Product roadmap (future features, priorities, dependencies)                    |

### 5.3 No Hardcoded tsconfig

**Design Decision:** No `tsconfig.json` in the repo. Bun uses built-in TS support; compile is one command.

Why? Every project is different:
- Some want strict null checks (enterprise)
- Some want JSDoc types (rapid prototyping)
- Some want `.d.ts` generation (library)

By not shipping `tsconfig.json`, we avoid:
- Cargo cult configuration inheritance
- Users blindly extending a config they don't understand
- "Why can't I use `const X: any`?" friction

Bun's defaults (ES2020, allow-any) match antidev's philosophy: **ship first, strict later**.

---

## 6. Build & Deployment

### 6.1 Build Process

```bash
bun run build
```

**Steps:**
1. `bun run gen:skill-docs` — Regenerate all SKILL.md from templates
2. `bun build --compile browse/src/cli.ts --outfile browse/dist/browse` — Compile CLI binary
3. `bun build --compile browse/src/find-browse.ts --outfile browse/dist/find-browse` — Compile helper
4. `git rev-parse HEAD > browse/dist/.version` — Embed git hash for version checking
5. Cleanup temporary `.*.bun-build` files

**Output:** Single binary at `browse/dist/browse` (~58 MB)

### 6.2 Installation

**Global Install:**
```bash
git clone https://github.com/KienBui-eup/antidev.git ~/.claude/skills/antidev
cd ~/.claude/skills/antidev && ./setup
```

**Dev Mode:**
```bash
cd antidev-repo
bun install
bin/dev-setup  # Symlinks repo into ~/.claude/skills for live reloading
# ... make edits ...
bin/dev-teardown  # Restore global install
```

### 6.3 Deployment to Active Skill

After pushing changes:
```bash
cd ~/.claude/skills/antidev
git fetch origin && git reset --hard origin/main
bun run build
```

Or copy binary directly: `cp browse/dist/browse ~/.claude/skills/antidev/browse/dist/browse`

---

## 7. Hardcoded Patterns & Platform-Specific Assumptions

### 7.1 Hardcoded Paths

| Path                           | Context                  | Rationale                                                 |
| ------------------------------ | ------------------------ | --------------------------------------------------------- |
| `~/.claude/skills/antidev`     | Global installation      | Standard Claude Code skill location                       |
| `~/.antidev/browse.json`       | Daemon state file        | Project-local (not home-local) for multi-workspace safety |
| `~/.antidev-dev/evals/`        | Eval results             | Developer-only, local performance tracking                |
| `~/.antidev/contributor-logs/` | Self-improvement reports | Contributor mode (opt-in)                                 |
| `.antidev/browse.json`         | Project-local state      | Enables parallel workspace daemons                        |

### 7.2 Environment-Specific Behavior

| Variable              | Default                | Usage                                               |
| --------------------- | ---------------------- | --------------------------------------------------- |
| `ANTHROPIC_API_KEY`   | (required for evals)   | LLM-as-judge scoring, only used in test environment |
| `BROWSE_PORT`         | Random 10000-60000     | Override for manual testing; normally auto-assigned |
| `BROWSE_STATE_FILE`   | `.antidev/browse.json` | Debug override for state file location              |
| `BROWSE_IDLE_TIMEOUT` | 1800000 (30 min)       | Server auto-shutdown timeout                        |

### 7.3 Platform Assumptions

| Assumption                   | Impact                                 | Mitigation                                                          |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------------------- |
| **POSIX shell** (bash/zsh)   | Skills use bash code blocks            | Works on macOS, Linux; Windows needs WSL or Git Bash                |
| **Git available in PATH**    | Skills run `git` commands directly     | Standard for CI; developers always have git                         |
| **`claude` CLI installed**   | E2E tests spawn `claude -p` subprocess | Assumption: dev is running Claude Code (where antidev is installed) |
| **Chromium support**         | Playwright needs headless-capable OS   | Works on Linux, macOS, Windows (WSL). Not ideal on Raspberry Pi.    |
| **SQLite3**                  | Cookie import uses SQLite directly     | Bun's native SQLite; no external dependency                         |
| **Python/Deno not required** | Supabase functions (optional)          | Not blocking; only needed for update checks + telemetry             |

### 7.4 Known Limitations (Platform-Specific)

| Limitation                                 | Platforms Affected         | Workaround                                                     |
| ------------------------------------------ | -------------------------- | -------------------------------------------------------------- |
| No ARM64 Chromium builds                   | M1/M2 Macs                 | Use Rosetta (Intel binary emulation)                           |
| Cookie import doesn't support all browsers | Windows (only Chrome/Edge) | Manually export/import cookies as JSON                         |
| Video recording requires clean session     | All                        | WIP: Sessions feature needed (TODOS.md)                        |
| Headless-only (no GUI)                     | All                        | Use `$B handoff` to switch to visible Chrome, then `$B resume` |

---

## 8. Key Files Summary

### 8.1 Source of Truth Files

| File                                                     | Purpose                                                                                      | Cardinality                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [browse/src/commands.ts](browse/src/commands.ts)         | **All browse commands** — READ_COMMANDS, WRITE_COMMANDS, META_COMMANDS, COMMAND_DESCRIPTIONS | Referenced by: server.ts, gen-skill-docs.ts, skill-parser.ts, skill-check.ts |
| [browse/src/snapshot.ts](browse/src/snapshot.ts)         | **All snapshot flags** (-i, -c, -d, -D, -a, -o, -C, etc.)                                    | Referenced by: gen-skill-docs.ts, skill-parser.ts                            |
| [test/helpers/touchfiles.ts](test/helpers/touchfiles.ts) | **Test → file dependencies mapping** for diff-based selection                                | Used by: eval-select.ts, skill-e2e.test.ts, skill-llm-eval.test.ts           |
| [SKILL.md.tmpl](SKILL.md.tmpl)                           | **Root skill template** (browse command reference, snapshot docs)                            | Generated into: SKILL.md                                                     |
| [package.json](package.json)                             | **Build scripts, dependencies, version**                                                     | Generated from: [VERSION](VERSION) file read at runtime                      |

### 8.2 Dependency Graph

```
browse/src/commands.ts
    ↓ (imported by)
    ├─ browse/src/server.ts (dispatch)
    ├─ browse/src/cli.ts (validation)
    ├─ scripts/gen-skill-docs.ts (doc gen)
    ├─ scripts/skill-check.ts (health)
    └─ test/helpers/skill-parser.ts (validation)

browse/src/snapshot.ts
    ↓ (imported by)
    ├─ browse/src/browser-manager.ts (ARIA gen)
    ├─ scripts/gen-skill-docs.ts (flag docs)
    └─ test/helpers/skill-parser.ts (validation)

test/helpers/touchfiles.ts
    ↓ (used by)
    ├─ scripts/eval-select.ts (preview)
    └─ test/skill-e2e.test.ts (filter)

SKILL.md.tmpl
    ↓ (generates)
    └─ SKILL.md

skills/*/SKILL.md.tmpl
    ↓ (generates)
    └─ skills/*/SKILL.md
```

---

## 9. Statistics & Metrics

### 9.1 Codebase Size

| Directory                  | File Count          | Purpose                                            |
| -------------------------- | ------------------- | -------------------------------------------------- |
| [browse/src/](browse/src/) | 15                  | Browser binary (CLI + server + Playwright wrapper) |
| [skills/*/](office-hours/) | 20+ skill dirs      | Workflow automation                                |
| [test/](test/)             | 10 files + fixtures | Unit, integration, LLM-eval, E2E                   |
| [scripts/](scripts/)       | 10                  | Build, validation, analytics                       |

**Total:** ~400 files, ~50K lines of code (TypeScript + Markdown)

### 9.2 Browse Command Inventory

| Category    | Count   | Examples                                                             |
| ----------- | ------- | -------------------------------------------------------------------- |
| Navigation  | 5       | goto, back, forward, reload, url                                     |
| Reading     | 5       | text, html, links, forms, accessibility                              |
| Interaction | 15+     | click, fill, select, type, press, scroll, wait, upload, dialog, etc. |
| Inspection  | 10+     | js, css, console, network, cookies, storage, perf, is, etc.          |
| Visual      | 3       | screenshot, pdf, responsive                                          |
| Tabs        | 4       | tabs, tab, newtab, closetab                                          |
| Meta        | 6+      | snapshot, chain, diff, handoff, resume, etc.                         |
| Server      | 3       | status, stop, restart                                                |
| **Total**   | **50+** | Covered in `browse/src/commands.ts`                                  |

### 9.3 Snapshot Flags

| Flag      | Long Form       | Purpose                              |
| --------- | --------------- | ------------------------------------ |
| `-i`      | `--interactive` | Only interactive elements            |
| `-c`      | `--compact`     | Minimal output                       |
| `-d N`    | `--depth N`     | Limit ARIA tree depth                |
| `-s sel`  | `--scope sel`   | Scope to CSS selector                |
| `-D`      | `--diff`        | Visual diff vs. previous             |
| `-a`      | `--annotated`   | Annotated screenshot with refs       |
| `-o path` | `--output path` | Save screenshot                      |
| `-C`      | `--cursors`     | Interactive-only with @c cursor refs |

---

## 10. Current Development Status

### 10.1 Active Features

- ✅ Persistent daemon model (stable)
- ✅ 50+ browse commands (stable)
- ✅ 15 workflow skills (production)
- ✅ diff-based test selection (working)
- ✅ LLM-as-judge evals (validated)
- ✅ E2E via `claude -p` subprocess (working)
- ✅ Multi-worktree support (tested)
- ✅ Cookie import from Comet/Chrome/Arc/Brave/Edge (working)

### 10.2 In Progress (TODOS.md)

- 🚧 Sessions (isolated browser instances) — P3, depends on context cleanup
- 🚧 Video recording — P3, depends on sessions
- 🚧 v20 encryption format support — P2
- 🚧 Remote debugging (Devtools Protocol) — P2

### 10.3 Known Issues

- No ARM64 Chromium support (M1/M2 Macs use Rosetta)
- Video recording blocked by session model
- Some platform-specific cookie browser support (Windows partial)

---

## 11. Contributing & Developer Workflow

### 11.1 Quick Start for Contributors

```bash
git clone <repo> && cd antidev
bun install
bin/dev-setup                    # Enable dev mode (symlink)
# ... make edits to SKILL.md.tmpl or TypeScript files ...
bun test                         # Run free tests
bin/dev-teardown                 # Restore when done
```

### 11.2 Checklist for PR

1. **Edit SKILL.md.tmpl** (template), NOT SKILL.md (generated)
2. **Run `bun run gen:skill-docs`** to regenerate
3. **Run `bun test`** for stat/structure validation
4. **Optionally run `bun run test:evals`** (paid, needs API key)
5. **Commit both .tmpl and .md** (both must be in sync)
6. **GitHub CI** will verify freshness (`skill-docs.yml` workflow)

### 11.3 Dev Mode Pitfalls

**Problem:** Editing SKILL.md directly (not .tmpl) causes regeneration to overwrite changes.

**Solution:** Always edit `.tmpl`, run `bun run gen:skill-docs`, commit both.

---

## 12. Recommendations for Developers

### 12.1 When Adding a New Browse Command

1. Add entry to [browse/src/commands.ts](browse/src/commands.ts) — command registry
2. Implement handler in [browse/src/{read|write|meta}-commands.ts](browse/src/read-commands.ts)
3. Add tests in [test/](test/) if complex
4. Run `bun run gen:skill-docs` — auto-includes in SKILL.md
5. Commit the change

### 12.2 When Creating a New Skill

1. Create `skill-name/` directory
2. Write `SKILL.md.tmpl` with {{PREAMBLE}} and content
3. Optional: Add `bin/` scripts for helpers
4. Run `bun run gen:skill-docs` → generates `SKILL.md`
5. Add to SKILL.md.tmpl foreword (proactive suggestions section)
6. Add touchfiles for diff-based test selection

### 12.3 When Modifying Test Infrastructure

1. Changes to [test/helpers/](test/helpers/) affect all eval tests
2. Run `bun run skill:check` to validate health
3. Consider impact on test runtime + cost (diff-based selection)
4. Update TOUCHFILES if adding/removing dependencies

---

## Conclusion

antidev is a production-quality, modular AI engineering toolkit built with:

- **Bun** for simplicity (compiled binary, no Node.js, native SQLite)
- **Playwright** for browser automation (good support, large community)
- **TypeScript** for safety (type checking, IDE tooling)
- **Markdown templates** for skill distribution (portable, readable, versioned)
- **Claude Code** for orchestration (agent invocations, error recovery)

The architecture emphasizes **clarity over cleverness**:
- Single source of truth for commands (commands.ts)
- Diff-based test selection preventing $56+ test runs
- Platform-agnostic design with per-project config
- Persistent daemon for responsive UX (no 3s startup per command)

For questions or contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) and [CLAUDE.md](CLAUDE.md).
