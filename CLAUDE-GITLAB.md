# GitLab Workflow for eUp Group

## Repository

- **Remote:** `https://gitlab.com/eup/antidev-agent.git`
- **Default Branch:** `main`
- **CI/CD:** `.gitlab-ci.yml` (GitLab CI)

## Common Commands

```bash
# Push a branch
git push origin <branch-name>

# Open Merge Request
git push -o merge_request.create -o merge_request.target=main

# View Merge Requests
# Use GitLab UI or glab CLI if installed

# Run CI locally before push
bun test
bun run build
```

## GitLab CI/CD Stages

1. **validate** — skill checks, docs freshness, touchfiles
2. **test** — free tests + diff-based E2E/LLM evals
3. **build** — compile binaries + docs
4. **deploy** — GitLab release + notifications

## Required Variables

Set these in GitLab CI/CD Variables:
- `ANTHROPIC_API_KEY` — for LLM evals
- `SLACK_WEBHOOK` — for deployment notifications
- `CI_JOB_TOKEN` — built-in GitLab token

## Merge Request Workflow

1. Create feature branch from `main`
2. Make changes
3. Run `bun test`
4. Push branch and open MR
5. Ensure `.gitlab-ci.yml` passes
6. Get review
7. Merge to `main`
