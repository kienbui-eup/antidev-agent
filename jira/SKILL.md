---
name: jira
description: Jira integration for eUp Group. Search issues, create tickets, add comments, transition workflow. Auto-linked from /review and /ship when branch name contains a ticket ID (e.g. feature/EUP-123-add-login).
allowed-tools:
  - Bash(git:*)
  - Bash(bun:*)
  - Read
  - Write
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->

# /jira

Jira workflow for eUp Group engineering teams.

## What this skill does

Use this skill when you need to:
- Search Jira tickets
- Create new issues from bugs or tasks
- Link work to branches or merge requests
- Add comments and updates
- Transition tickets through workflow

## Jira configuration

Default eUp Jira host:
- `https://eup-group.atlassian.net`

Required environment variables:
- `JIRA_HOST`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT` (optional default project)

## Auto-linking with /review and /ship

When you name branches using the format `<type>/EUP-123-<description>`, antidev automatically:

- **On `/review`** — adds a "Code review started" comment to EUP-123
- **On `/ship`** — adds the MR/PR URL as a comment and transitions the ticket to "In Review"

Branch naming examples:
```
feature/EUP-123-add-login-screen
fix/EUP-456-broken-import-flow
chore/EUP-789-update-deps
```

Extract the ticket ID manually if needed:
```bash
git branch --show-current | grep -oE '[A-Z]+-[0-9]+' | head -1
```

## Workflow

1. Confirm Jira credentials are available.
2. Identify the target project and issue type.
3. Perform the requested Jira action.
4. Confirm the result and return the issue key or URL.

## Common actions

### Search issues

```bash
bun run scripts/jira.ts search "project = EUP AND status != Done ORDER BY updated DESC"
```

### Create issue

```bash
bun run scripts/jira.ts create --project EUP --type Task --summary "<summary>" --description "<description>"
```

### Add comment

```bash
bun run scripts/jira.ts comment --issue EUP-123 --text "<comment>"
```

### Transition issue

```bash
bun run scripts/jira.ts transition --issue EUP-123 --to "In Progress"
```

## Available workflow transitions (eUp)

| From | Command | To |
|------|---------|---|
| To Do | `transition --to "In Progress"` | In Progress |
| In Progress | `transition --to "In Review"` | In Review |
| In Review | `transition --to "Done"` | Done |
| Any | `transition --to "Blocked"` | Blocked |

## Notes

- Prefer project-specific issue types and workflow names from eUp Jira.
- If project or workflow is unclear, ask the user instead of guessing.
- Return direct issue URLs whenever possible.
