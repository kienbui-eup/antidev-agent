---
name: localization-workflow
version: 1.0.0
description: |
  End-to-end localization management for eUp products across 15+ languages.
  Coordinates translation memory, glossaries, review cycles, and delivery.
  Proactively suggest when new UI strings are added or a new language market is being targeted.
allowed-tools:
  - Bash
  - Read
  - Write
  - AskUserQuestion
---
<!-- AUTO-GENERATED from SKILL.md.tmpl — do not edit directly -->
<!-- Regenerate: bun run gen:skill-docs -->
## Preamble (run first)

```bash
_UPD=$(~/.claude/skills/antidev/bin/antidev-update-check 2>/dev/null || .claude/skills/antidev/bin/antidev-update-check 2>/dev/null || true)
[ -n "$_UPD" ] && echo "$_UPD" || true
mkdir -p ~/.antidev/sessions
touch ~/.antidev/sessions/"$PPID"
_SESSIONS=$(find ~/.antidev/sessions -mmin -120 -type f 2>/dev/null | wc -l | tr -d ' ')
find ~/.antidev/sessions -mmin +120 -type f -delete 2>/dev/null || true
_CONTRIB=$(~/.claude/skills/antidev/bin/antidev-config get antidev_contributor 2>/dev/null || true)
_PROACTIVE=$(~/.claude/skills/antidev/bin/antidev-config get proactive 2>/dev/null || echo "true")
_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
echo "BRANCH: $_BRANCH"
echo "PROACTIVE: $_PROACTIVE"
_LAKE_SEEN=$([ -f ~/.antidev/.completeness-intro-seen ] && echo "yes" || echo "no")
echo "LAKE_INTRO: $_LAKE_SEEN"
_TEL=$(~/.claude/skills/antidev/bin/antidev-config get telemetry 2>/dev/null || true)
_TEL_PROMPTED=$([ -f ~/.antidev/.telemetry-prompted ] && echo "yes" || echo "no")
_TEL_START=$(date +%s)
_SESSION_ID="$$-$(date +%s)"
echo "TELEMETRY: ${_TEL:-off}"
echo "TEL_PROMPTED: $_TEL_PROMPTED"
mkdir -p ~/.antidev/analytics
echo '{"skill":"localization-workflow","team":"platform","bu":"engineering","workflow":"general","ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","repo":"'$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null || echo "unknown")'"}'  >> ~/.antidev/analytics/skill-usage.jsonl 2>/dev/null || true
for _PF in ~/.antidev/analytics/.pending-*; do [ -f "$_PF" ] && ~/.claude/skills/antidev/bin/antidev-telemetry-log --event-type skill_run --skill _pending_finalize --outcome unknown --session-id "$_SESSION_ID" 2>/dev/null || true; break; done
```

If `PROACTIVE` is `"false"`, do not proactively suggest antidev skills — only invoke
them when the user explicitly asks. The user opted out of proactive suggestions.

If output shows `UPGRADE_AVAILABLE <old> <new>`: read `~/.claude/skills/antidev/antidev-upgrade/SKILL.md` and follow the "Inline upgrade flow" (auto-upgrade if configured, otherwise AskUserQuestion with 4 options, write snooze state if declined). If `JUST_UPGRADED <from> <to>`: tell user "Running antidev v{to} (just updated!)" and continue.

If `LAKE_INTRO` is `no`: Before continuing, introduce the Completeness Principle.
Tell the user: "antidev follows the **Boil the Lake** principle — always do the complete
thing when AI makes the marginal cost near-zero. Read more: https://wiki.eup.ai/antidev/completeness-principle"
Then offer to open the essay in their default browser:

```bash
open https://wiki.eup.ai/antidev/completeness-principle
touch ~/.antidev/.completeness-intro-seen
```

Only run `open` if the user says yes. Always run `touch` to mark as seen. This only happens once.

If `TEL_PROMPTED` is `no` AND `LAKE_INTRO` is `yes`: After the lake intro is handled,
ask the user about telemetry. Use AskUserQuestion:

> antidev can share anonymous usage data (which skills you use, how long they take, crash info)
> to help improve the project. No code, file paths, or repo names are ever sent.
> Change anytime with `antidev-config set telemetry off`.

Options:
- A) Yes, share anonymous data (recommended)
- B) No thanks

If A: run `~/.claude/skills/antidev/bin/antidev-config set telemetry anonymous`
If B: run `~/.claude/skills/antidev/bin/antidev-config set telemetry off`

Always run:
```bash
touch ~/.antidev/.telemetry-prompted
```

This only happens once. If `TEL_PROMPTED` is `yes`, skip this entirely.

## AskUserQuestion Format

**ALWAYS follow this structure for every AskUserQuestion call:**
1. **Re-ground:** State the project, the current branch (use the `_BRANCH` value printed by the preamble — NOT any branch from conversation history or gitStatus), and the current plan/task. (1-2 sentences)
2. **Simplify:** Explain the problem in plain English a smart 16-year-old could follow. No raw function names, no internal jargon, no implementation details. Use concrete examples and analogies. Say what it DOES, not what it's called.
3. **Recommend:** `RECOMMENDATION: Choose [X] because [one-line reason]` — always prefer the complete option over shortcuts (see Completeness Principle). Include `Completeness: X/10` for each option. Calibration: 10 = complete implementation (all edge cases, full coverage), 7 = covers happy path but skips some edges, 3 = shortcut that defers significant work. If both options are 8+, pick the higher; if one is ≤5, flag it.
4. **Options:** Lettered options: `A) ... B) ... C) ...` — when an option involves effort, show both scales: `(human: ~X / CC: ~Y)`

Assume the user hasn't looked at this window in 20 minutes and doesn't have the code open. If you'd need to read the source to understand your own explanation, it's too complex.

Per-skill instructions may add additional formatting rules on top of this baseline.

## Completeness Principle — Boil the Lake

AI-assisted coding makes the marginal cost of completeness near-zero. When you present options:

- If Option A is the complete implementation (full parity, all edge cases, 100% coverage) and Option B is a shortcut that saves modest effort — **always recommend A**. The delta between 80 lines and 150 lines is meaningless with CC+antidev. "Good enough" is the wrong instinct when "complete" costs minutes more.
- **Lake vs. ocean:** A "lake" is boilable — 100% test coverage for a module, full feature implementation, handling all edge cases, complete error paths. An "ocean" is not — rewriting an entire system from scratch, adding features to dependencies you don't control, multi-quarter platform migrations. Recommend boiling lakes. Flag oceans as out of scope.
- **When estimating effort**, always show both scales: human team time and CC+antidev time. The compression ratio varies by task type — use this reference:

| Task type | Human team | CC+antidev | Compression |
|-----------|-----------|-----------|-------------|
| Boilerplate / scaffolding | 2 days | 15 min | ~100x |
| Test writing | 1 day | 15 min | ~50x |
| Feature implementation | 1 week | 30 min | ~30x |
| Bug fix + regression test | 4 hours | 15 min | ~20x |
| Architecture / design | 2 days | 4 hours | ~5x |
| Research / exploration | 1 day | 3 hours | ~3x |

- This principle applies to test coverage, error handling, documentation, edge cases, and feature completeness. Don't skip the last 10% to "save time" — with AI, that 10% costs seconds.

**Anti-patterns — DON'T do this:**
- BAD: "Choose B — it covers 90% of the value with less code." (If A is only 70 lines more, choose A.)
- BAD: "We can skip edge case handling to save time." (Edge case handling costs minutes with CC.)
- BAD: "Let's defer test coverage to a follow-up PR." (Tests are the cheapest lake to boil.)
- BAD: Quoting only human-team effort: "This would take 2 weeks." (Say: "2 weeks human / ~1 hour CC.")

## Contributor Mode

If `_CONTRIB` is `true`: you are in **contributor mode**. You're a antidev user who also helps make it better.

**At the end of each major workflow step** (not after every single command), reflect on the antidev tooling you used. Rate your experience 0 to 10. If it wasn't a 10, think about why. If there is an obvious, actionable bug OR an insightful, interesting thing that could have been done better by antidev code or skill markdown — file a field report. Maybe our contributor will help make us better!

**Calibration — this is the bar:** For example, `$B js "await fetch(...)"` used to fail with `SyntaxError: await is only valid in async functions` because antidev didn't wrap expressions in async context. Small, but the input was reasonable and antidev should have handled it — that's the kind of thing worth filing. Things less consequential than this, ignore.

**NOT worth filing:** user's app bugs, network errors to user's URL, auth failures on user's site, user's own JS logic bugs.

**To file:** write `~/.antidev/contributor-logs/{slug}.md` with **all sections below** (do not truncate — include every section through the Date/Version footer):

```
# {Title}

Hey antidev team — ran into this while using /{skill-name}:

**What I was trying to do:** {what the user/agent was attempting}
**What happened instead:** {what actually happened}
**My rating:** {0-10} — {one sentence on why it wasn't a 10}

## Steps to reproduce
1. {step}

## Raw output
```
{paste the actual error or unexpected output here}
```

## What would make this a 10
{one sentence: what antidev should have done differently}

**Date:** {YYYY-MM-DD} | **Version:** {antidev version} | **Skill:** /{skill}
```

Slug: lowercase, hyphens, max 60 chars (e.g. `browse-js-no-await`). Skip if file already exists. Max 3 reports per session. File inline and continue — don't stop the workflow. Tell user: "Filed antidev field report: {title}"

## Completion Status Protocol

When completing a skill workflow, report status using one of:
- **DONE** — All steps completed successfully. Evidence provided for each claim.
- **DONE_WITH_CONCERNS** — Completed, but with issues the user should know about. List each concern.
- **BLOCKED** — Cannot proceed. State what is blocking and what was tried.
- **NEEDS_CONTEXT** — Missing information required to continue. State exactly what you need.

### Escalation

It is always OK to stop and say "this is too hard for me" or "I'm not confident in this result."

Bad work is worse than no work. You will not be penalized for escalating.
- If you have attempted a task 3 times without success, STOP and escalate.
- If you are uncertain about a security-sensitive change, STOP and escalate.
- If the scope of work exceeds what you can verify, STOP and escalate.

Escalation format:
```
STATUS: BLOCKED | NEEDS_CONTEXT
REASON: [1-2 sentences]
ATTEMPTED: [what you tried]
RECOMMENDATION: [what the user should do next]
```

## Telemetry (run last)

After the skill workflow completes (success, error, or abort), log the telemetry event.
Determine the skill name from the `name:` field in this file's YAML frontmatter.
Determine the outcome from the workflow result (success if completed normally, error
if it failed, abort if the user interrupted). Run this bash:

```bash
_TEL_END=$(date +%s)
_TEL_DUR=$(( _TEL_END - _TEL_START ))
rm -f ~/.antidev/analytics/.pending-"$_SESSION_ID" 2>/dev/null || true
~/.claude/skills/antidev/bin/antidev-telemetry-log \
  --skill "SKILL_NAME" --duration "$_TEL_DUR" --outcome "OUTCOME" \
  --used-browse "USED_BROWSE" --session-id "$_SESSION_ID" 2>/dev/null &
```

Replace `SKILL_NAME` with the actual skill name from frontmatter, `OUTCOME` with
success/error/abort, and `USED_BROWSE` with true/false based on whether `$B` was used.
If you cannot determine the outcome, use "unknown". This runs in the background and
never blocks the user.

# /localization-workflow

Full localization lifecycle for eUp's 15+ language markets.
From string extraction to translator handoff to QA sign-off to production release.

## Supported Languages

| Code  | Language            | Market           |
|-------|---------------------|------------------|
| vi    | Vietnamese          | Primary (VN)     |
| en    | English             | Global default   |
| zh-CN | Simplified Chinese  | China/SG         |
| zh-TW | Traditional Chinese | TW/HK            |
| ja    | Japanese            | Japan            |
| ko    | Korean              | Korea            |
| th    | Thai                | Thailand         |
| id    | Indonesian          | Indonesia        |
| ms    | Malay               | Malaysia         |
| fr    | French              | France           |
| de    | German              | Germany          |
| es    | Spanish             | LatAm + Spain    |
| pt    | Portuguese          | Brazil + PT      |
| it    | Italian             | Italy            |
| ru    | Russian             | Russia           |

## Step 1 — String extraction

Extract new/changed translatable strings from the codebase:

```bash
bun run i18n:extract
```

This updates `i18n/en.json` with:
- New keys from source code (`t('key')`, `$t('key')`)
- Removed keys (marked as deprecated, not deleted — translators need to see them)
- Changed source strings (marks all locale translations as `[REVIEW NEEDED]`)

## Step 2 — Validate before handoff

```bash
bun run i18n:validate
```

Checks:
1. All keys in `en.json` exist in all locale files (no missing translations)
2. No interpolation variable mismatches (`{name}` must appear in all locales)
3. No untranslated `[TODO: translate]` markers in production-targeted locales
4. Glossary terms are used consistently (e.g., "flashcard" not "flash card")

Fix all errors before sending to translators. Warnings can go with annotations.

## Step 3 — Translator handoff

Create a translation package:

```bash
# Export only changed/new strings for each locale
bun run i18n:export --changed --format=xliff --output=./translation-packages/v$(date +%Y%m%d)
```

XLIFF format is required for CAT tool compatibility (Phrase, Lokalise, Transifex).

Handoff checklist:
- [ ] Context screenshots attached (from `/content-qa` run)
- [ ] Glossary PDF included (`docs/eup-glossary-<lang>.pdf`)
- [ ] Character limits flagged for UI strings (especially button text: max 20-30 chars)
- [ ] Tone guide included (formal vs informal, brand voice per market)
- [ ] Deadline in Jira ticket

## Step 4 — Review cycle

When translations are returned:

1. **Import** translations: `bun run i18n:import --file=<xliff-file>`
2. **Validate** again: `bun run i18n:validate`
3. **In-context review** — run `/content-qa` with the new locale active:
   ```bash
   ANTIDEV_LANG=<locale> bun run dev qa
   ```
4. **Native speaker sign-off** — each locale needs sign-off from a native speaker
   on the eUp localization team before shipping.

Track reviews in Jira:
- Story: `[L10N] <locale> — <release/sprint> translation review`
- Subtasks per: Import → Validate → In-context → Native review → Approved

## Step 5 — Glossary management

The eUp glossary ensures consistency across translators and products.

**Key terms (do not localize the key, only the value):**

| Term (EN)      | VI                  | ZH-CN       | JA         |
|----------------|---------------------|-------------|------------|
| flashcard      | thẻ ghi nhớ         | 闪卡        | フラッシュカード |
| learning path  | lộ trình học        | 学习路径    | 学習パス   |
| lesson         | bài học             | 课程        | レッスン   |
| streak         | chuỗi ngày liên tiếp| 连续天数    | ストリーク |
| review         | ôn tập              | 复习        | 復習       |
| quiz           | bài kiểm tra nhỏ   | 小测验      | クイズ     |

Update `docs/eup-glossary.json` when new terms are added.
```bash
# Detect glossary violations in translations
bun run i18n:validate --check-glossary
```

## Step 6 — Release

1. Final `bun run i18n:validate` — must be 0 errors.
2. Update `CHANGELOG.md` with new locale additions or major string updates.
3. Tag the localization release:
   ```bash
   git tag -a "l10n/v$(date +%Y.%m.%d)" -m "Localization: <locales> — <summary>"
   ```
4. Notify locale-specific support teams of changes (via Slack #localization channel).
5. Monitor error rates in production for 48h after locale rollouts.
