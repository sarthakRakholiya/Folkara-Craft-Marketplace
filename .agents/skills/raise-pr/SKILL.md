---
name: raise-pr
description: Creates a new branch, commits all changes, and raises a Pull Request using GitHub CLI.
---

# Skill: raise-pr

## Purpose

Create a well-named branch, commit all changes, and raise a PR.

## When to use

- After check-edge-cases passes and human types `raise pr`
- Run independently with: `/raise-pr`

## Announcement

"Raising PR. Edge cases already approved — committing and pushing now."

## Prerequisites

- check-edge-cases skill has run and human typed `raise pr`
- If edge case check NOT done, STOP and invoke check-edge-cases first

## Instructions

### Step 1 — Check git status

```bash
git status
git diff --stat
```

Confirm all expected files are modified/added. Report unexpected changes.

### Step 2 — Create branch

- Feature: `feat/JIRA-123-short-description`
- Bug fix: `fix/JIRA-123-short-description`
- Chore: `chore/JIRA-123-short-description`
  Kebab-case. Max 50 chars.

### Step 3 — Stage and commit

```bash
git add -A
git commit -m "type(TICKET): short summary

- what changed
- why it was needed
- fixes/closes reference"
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`

### Step 4 — Push

```bash
git push origin HEAD
```

### Step 5 — Raise PR

```bash
gh pr create \
  --title "type(TICKET): summary" \
  --body-file docs/ai-workflow/pr-body.md \
  --base main \
  --draft
```

Save PR body to `docs/ai-workflow/pr-body.md`. Pull details from:
- `docs/ai-workflow/task-spec.md` (Summary, Edge Cases)
- `docs/ai-workflow/review.md` (Quality check confirmation)

```
## Summary
[Summary from task-spec.md]

## Changes
[Files changed from plan.md]

## Edge cases verified
[Rows from Edge Case Analysis section of task-spec.md]

## Testing
- [ ] Unit tests pass (npm test)
- [ ] Linter passes (npm run lint)
- [ ] Review report generated: docs/ai-workflow/review.md

## Future improvements
[Suggestions from task-spec.md]
```

### Step 6 — Report

Print PR URL.

> "PR raised as DRAFT. Add screenshots if needed, then mark ready for review."

## Notes

- Always raise as DRAFT — human marks ready for review
- If `gh` not installed, output git commands for human to run
- Never force push to main/master
- If branch exists, ask before overwriting
