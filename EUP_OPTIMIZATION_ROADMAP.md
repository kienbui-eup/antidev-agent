# eUp Optimization Roadmap

**Version:** 1.0 | **Date:** March 31, 2026 | **Status:** Planning Phase

---

## Executive Summary

Optimize antidev-agent codebase for **full integration with eUp Group's tech stack**:
- Replace GitHub integration with **GitLab**
- Add **Jira integration** for task/issue management
- Implement **GitLab CI/CD pipeline**
- Add **i18n support** (Vietnamese localization)
- Create **eUp-specific skills** for education content workflows
- **Standardize codebase** for team onboarding
- Create **eUp-specific documentation**

**Expected outcomes:**
- ✅ Single-click setup for eUp developers
- ✅ Seamless Jira + GitLab + CI/CD integration
- ✅ Vietnamese language support
- ✅ eUp-optimized skill library
- ✅ Maintainable, reviewable codebase

---

## Phase 1: Core Integration (High Priority)

### 1.1 GitLab Migration
**Goal:** Replace all GitHub references with GitLab equivalents.

**Files to modify:**
- [package.json](package.json) — Update description, remove GitHub-specific scripts
- [conductor.json](conductor.json) — Add GitLab CI trigger configs
- [CLAUDE.md](CLAUDE.md) — Update Git examples (use `git push origin`)
- `.github/` → `.gitlab/` — Move CI/CD workflows
- [browse/src/cli.ts](browse/src/cli.ts) — Update version check logic (from GitHub releases → GitLab releases)

**Deliverables:**
- [ ] `.gitlab-ci.yml` — Replace GitHub Actions workflow
- [ ] `CLAUDE.md` — Updated with GitLab commands
- [ ] `bin/gitlab-config` — Helper script for GitLab setup
- [ ] Test passed on GitLab runner

---

### 1.2 Jira Integration
**Goal:** Add native Jira support via new skill + browse commands.

**New files:**
- [ ] `jira/SKILL.md.tmpl` — New /jira skill
- [ ] `browse/src/jira-client.ts` — Jira API wrapper
- [ ] `test/jira-integration.test.ts` — Integration tests
- [ ] `test/fixtures/jira-*.json` — Mock responses

**Jira commands to add:**
- `jira-search` — Query issues/tickets
- `jira-create-issue` — Create new issue from current branch/PR
- `jira-transition` — Move issue through workflow
- `jira-add-comment` — Add comment to issue
- `jira-link-issue` — Link PR to ticket

**Configuration:**
```yaml
# CLAUDE.md addition
JIRA_HOST: https://eup-group.atlassian.net
JIRA_PROJECT: EUP (configurable per team)
```

**Deliverables:**
- [ ] New `/jira` skill with 5+ commands
- [ ] Jira API authentication (OAuth + PAT support)
- [ ] Integration tests

---

### 1.3 GitLab CI/CD Pipeline
**Goal:** Create production-ready CI pipeline for eUp.

**New file:** `.gitlab-ci.yml`

**Stages:**
```yaml
stages:
  - validate
  - test
  - build
  - deploy

validate:
  - lint TypeScript + YAML
  - skill validation
  - gen-skill-docs freshness check

test:
  - bun test (free tests)
  - bun run test:evals (if diff-based triggers all)

build:
  - bun run build
  - compile binaries (browse, find-browse)
  - generate docs

deploy:
  - push binary to GitLab releases
  - run post-deploy checks
```

**Features:**
- Diff-based test selection (avoid $56+ spend)
- Scheduled nightly full eval runs
- Automatic skill docs regeneration on .tmpl changes
- Slack notifications on failure

**Deliverables:**
- [ ] `.gitlab-ci.yml` with all stages
- [ ] `scripts/gitlab-precheck.ts` — Pre-push validation
- [ ] GitHub → GitLab CI migration guide

---

## Phase 2: Localization & i18n (Medium Priority)

### 2.1 Vietnamese Localization
**Goal:** Support Vietnamese UI/docs for eUp team.

**New structure:**
```
i18n/
├── vi/ (Vietnamese)
├── en/ (English, default)
└── translations.ts – translator function
```

**Translations needed:**
- [ ] Skill descriptions (title, purpose, steps)
- [ ] Error messages + help text
- [ ] CLI output (commands, flags)
- [ ] Documentation (CLAUDE.md, skill guides)

**New file:** `i18n/vi/translations.ts` (phiên bản tiếng Việt)

**Configuration:**
```yaml
# CLAUDE.md
ANTIDEV_LANG: vi | en (default: en)
```

**Deliverables:**
- [ ] i18n system integrated into all skills
- [ ] Vietnamese translations (80%+)
- [ ] `bun run i18n:extract` — Extract strings
- [ ] `bun run i18n:validate` — Validate translations

---

### 2.2 eUp-Specific Documentation
**Goal:** Create Vietnamese guides for eUp team.

**New files:**
- [ ] `docs/EUP_GETTING_STARTED.md` — Tiếng Việt quick start
- [ ] `docs/EUP_SETUP.md` — Setup cho eUp infrastructure
- [ ] `docs/JIRA_INTEGRATION.md` — Hướng dẫn Jira
- [ ] `docs/GITLAB_WORKFLOW.md` — Quy trình GitLab
- [ ] `docs/SKILL_CUSTOM.md` — Tạo custom skills cho eUp

**Deliverables:**
- [ ] 5 docs in Vietnamese
- [ ] Video tutorial links prepared

---

## Phase 3: eUp-Specific Skills (High Value)

### 3.1 Educational Content QA Skill
**Goal:** QA workflow for education content (interactive lessons, translations, etc.)

**New skill:** `content-qa/`

**Features:**
- Automated screenshot testing
- Translation quality checks (Vietnamese ↔ English)
- Accessibility compliance (WCAG 2.1 AA)
- Content accuracy verification
- Device/browser consistency checks

**Deliverables:**
- [ ] `/content-qa` skill with full workflow
- [ ] Fixtures + test cases
- [ ] Integration with eUp's content platforms

---

### 3.2 Super Lang Workflow Skill
**Goal:** eUp's "Super Lang" ecosystem management (learning paths, exercises, etc.)

**New skill:** `super-lang-flow/`

**Features:**
- Create/update learning paths
- Exercise generation + validation
- Progress tracking audit
- User cohort analysis
- Content deployment workflow

**Deliverables:**
- [ ] `/super-lang-flow` skill
- [ ] Integration with eUp backend APIs

---

### 3.3 Localization Workflow Skill
**Goal:** Streamline translation + localization for 15+ language apps.

**New skill:** `localization-workflow/`

**Features:**
- Extract strings from source
- Manage translation TMX files
- QA in-app translations
- Multi-language build + deploy
- Translation memory integration

**Deliverables:**
- [ ] `/localization-workflow` skill
- [ ] Connected to eUp translation tools

---

## Phase 4: Standardization (Foundation)

### 4.1 Code Style + Conventions
**Goal:** Standardize TypeScript, YAML, Markdown across team.

**New files:**
- [ ] `.prettierrc` — Formatter config
- [ ] `.eslintrc.cjs` — Linter rules
- [ ] `CODING_STANDARDS.md` — eUp-specific rules
- [ ] `scripts/lint.ts` — Automated linting

**Standards to define:**
- TypeScript: strict mode, no `any`
- Variable naming
- Function signatures
- Error handling patterns
- Testing conventions
- YAML skill templates

**Deliverables:**
- [ ] Linter + formatter integrated into CI
- [ ] Pre-commit hooks configured
- [ ] CODING_STANDARDS.md document

---

### 4.2 Folder Structure Optimization
**Goal:** Reorganize for clarity and team onboarding.

**Current → Proposed:**
```
antidev/
├── browse/            # Core browser tool (UNCHANGED)
├── skills/            # All skills grouped
│   ├── core/          # fundamental workflows
│   │   ├── review/    # PR review
│   │   ├── ship/      # Deploy workflow
│   │   └── ...
│   ├── eup/           # eUp-specific skills
│   │   ├── content-qa/
│   │   ├── super-lang-flow/
│   │   ├── localization-workflow/
│   │   └── ...
│   └── community/     # Contributed skills
├── scripts/           # Build pipeline
├── test/              # QA infrastructure
├── docs/              # Documentation
├── i18n/              # Translations
├── .gitlab/           # GitLab CI (instead of .github)
├── .eslintrc.cjs      # Code standards
├── .prettierrc         # Formatting
└── CODING_STANDARDS.md
```

**Migration steps:**
1. Create `skills/` directory structure
2. Move existing skills to `skills/core/` and `skills/eup/`
3. Update all imports + references
4. Update documentation
5. Test locally

**Deliverables:**
- [ ] New folder structure implemented
- [ ] All imports working
- [ ] Migration guide for team

---

### 4.3 Configuration Management
**Goal:** Create eUp-specific config system.

**New file:** `eup.config.ts`

```typescript
export const eupConfig = {
  // Team info
  team: "eUp Group",
  region: "Vietnam",
  timezone: "Asia/Ho_Chi_Minh",
  
  // Integrations
  gitlab: {
    host: "https://gitlab.com/eup",
    group: "eup",
  },
  jira: {
    host: "https://eup-group.atlassian.net",
    projects: ["EUP", "LANG", "EDU"],
  },
  
  // Defaults
  i18n: {
    defaultLanguage: "vi",
    supportedLanguages: ["vi", "en"],
  },
  
  // Features
  skills: {
    enabled: ["content-qa", "super-lang-flow", "localization-workflow"],
  },
};
```

**Deliverables:**
- [ ] `eup.config.ts` with sensible defaults
- [ ] Config validation system
- [ ] CLI: `antidev config --show | --set`

---

## Phase 5: Testing & Documentation (Quality Gate)

### 5.1 Integration Testing
**Goal:** Validate all eUp integrations work together.

**New tests:**
- [ ] `test/eup-integration.test.ts` — End-to-end GitLab + Jira flow
- [ ] `test/jira-integration.test.ts` — Jira API mocking
- [ ] `test/gitlab-ci.test.ts` — CI pipeline validation
- [ ] `test/i18n.test.ts` — Translation completeness

**Deliverables:**
- [ ] 100% eUp integration coverage
- [ ] Pre-merge CI passes for all changes

---

### 5.2 Team Documentation
**Goal:** Onboarding + reference guides for eUp developers.

**New docs:**
- [ ] `docs/EUP_GETTING_STARTED.md`
- [ ] `docs/EUP_SETUP.md`
- [ ] `docs/SKILL_DEVELOPMENT.md`
- [ ] `docs/TROUBLESHOOTING.md`
- [ ] `docs/FAQ.md`

**Formats:**
- Markdown (GitHub/GitLab compatible)
- Video tutorials (optional)
- Interactive walkthroughs

**Deliverables:**
- [ ] 500+ lines of documentation
- [ ] All questions answered
- [ ] Setup guide <5 minutes

---

## Success Metrics

| Metric                  | Target           | Current       |
| ----------------------- | ---------------- | ------------- |
| **Setup time**          | <5 min           | ~15 min       |
| **GitLab integration**  | 100%             | 0%            |
| **Jira integration**    | 100%             | 0%            |
| **Vietnamese docs**     | 80%+             | 0%            |
| **eUp-specific skills** | 3+               | 0             |
| **Code coverage**       | 85%+             | ~70%          |
| **Accessible docs**     | All team members | Need training |
| **CI/CD reliability**   | 100% green       | N/A           |

---

## Implementation Timeline

| Phase               | Duration     | Start         | Priority |
| ------------------- | ------------ | ------------- | -------- |
| 1. Core Integration | 2-3 days     | Now           | 🔴 High   |
| 2. i18n             | 2 days       | After Phase 1 | 🟡 Medium |
| 3. eUp Skills       | 3-4 days     | After Phase 2 | 🟡 Medium |
| 4. Standardization  | 1-2 days     | Parallel      | 🟢 Low    |
| 5. Testing & Docs   | 1-2 days     | Final         | 🔴 High   |
| **Total**           | **~10 days** | -             | -        |

---

## Risk Mitigation

| Risk                | Impact   | Mitigation                               |
| ------------------- | -------- | ---------------------------------------- |
| Breaking changes    | 🔴 High   | Branch protection, code review mandatory |
| GitLab API limits   | 🟡 Medium | Rate limiting + caching in Jira client   |
| Translation quality | 🟡 Medium | Native Vietnamese speakers review        |
| CI timeout          | 🔴 High   | DIfference-based test selection          |
| Skill adoption      | 🟡 Medium | Training + documentation                 |

---

## Next Steps

1. ✅ **Confirm roadmap** with eUp leadership
2. 👉 **Start Phase 1** — GitLab migration
3. **Set up test environment** — GitLab + Jira sandbox
4. **Assign ownership** — Skills, docs, testing
5. **Weekly sync** — Progress tracking

---

## Appendix: Quick Command Reference (After Completion)

```bash
# Setup
git clone https://gitlab.com/eup/antidev-agent && cd antidev-agent
bun install
bun run build

# Development
bun run dev <cmd>
bun run test
bun run test:evals
bun run i18n:extract
bun run skill:check

# Jira integration
$B jira-search "project:EUP type:Bug"
$B jira-create-issue "title" "description"

# Content QA
/content-qa

# Super Lang workflow
/super-lang-flow

# Localization
/localization-workflow
```

---

**Prepared by:** Kien Bui, CTO eUp Group
**Status:** Ready for implementation
