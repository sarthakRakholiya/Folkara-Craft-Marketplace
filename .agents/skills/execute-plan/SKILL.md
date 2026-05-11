---
name: execute-plan
description: Implements the approved plan, executing tasks step by step with verification.
---

# Skill: execute-plan

## Purpose

Implement an approved plan, task by task, with verification after each step.
Never skip tasks. Never invent tasks not in the plan.

## When to use

- ONLY after explicit human approval of the plan
- Run independently with: `/execute`

## Announcement

"Executing plan. I will complete each task and verify before moving on."

## Prerequisites

- `docs/ai-workflow/plan.md` exists
- Human has typed `approve`
- If plan not approved, STOP and return to write-plan

## Instructions

### Before starting

Read the full plan. Note the files map. Understand all tasks before beginning.

### For each task

1. **Announce:** "Working on Task N: [title]"

2. **Implement**
   - Follow code guidance exactly
   - Do not add extra features
   - Do not refactor things not mentioned in the plan
   - Match existing code style

3. **Verify**
   - Run the verification command from the plan
   - If fails: fix, re-run, do not move on until passing
   - If cannot fix: pause and report to human with details

4. **Mark complete**
   - Update checkbox in plan: `- [x] Task complete`
   - Report: "Task N complete ✓"

5. **Pause if blocked**
   If unexpected: STOP, report exactly what was found, ask for guidance.

### After all tasks

- Run full test suite: `npm test`
- Run linter: `npm run lint`
- Fix any failures
- Report: "All tasks complete. Tests passing. Ready for review."

## Notes

- One task at a time. Never batch.
- Do not commit during execution — commit happens in raise-pr
- Warn human before running DB migrations
