---
name: check-edge-cases
description: Validates PR against edge cases before submission.
---

# Skill: check-edge-cases

## Purpose

Before raising a PR, systematically identify and verify edge cases.
BLOCKING step — no PR raised until this passes and human approves.

## When to use

- After review passes, before raise-pr
- Run independently with: `/check-edge-cases`

## Announcement

"Running edge case analysis before raising the PR."

## Instructions

### Step 1 — Read context

- Read `docs/ai-workflow/task-spec.md`
- Read `docs/ai-workflow/plan.md`
- Read `docs/ai-workflow/review.md`
- Scan changed files: `git diff --name-only`

### Step 2 — Check each category

#### A. Input & data

- Empty / null / undefined inputs
- Whitespace-only strings
- Extremely long inputs (UI truncate? DB column fit?)
- Special characters (quotes, ampersands, emojis, unicode)
- Zero / negative numbers
- Boundary values (min/max)

#### B. State & async

- Double-submit (user clicks twice quickly)
- Slow network — loading state shown?
- Network failure — error state and retry?
- Component unmounts mid-request (memory leak?)
- Race conditions (two requests in flight)

#### C. Auth & permissions

- Logged-out user hits feature directly via URL
- Insufficient permissions user calls API directly
- Token expires mid-session
- Resource ownership (user A access user B's data?)

#### D. Data integrity

- DB record deleted between read and write
- Unique constraint violations possible?
- Concurrent edit conflict
- Orphaned child records on delete

#### E. UI / frontend

- Zero items (empty state)
- 1 item vs 100 items
- Long text overflow/truncation
- Mobile viewport (320px)
- Images fail to load

#### F. Integration & environment

- Feature flags OFF
- Third-party service error or timeout
- Dev vs prod environment configs

#### G. Conventions & Architecture

- **Naming**: Components `PascalCase`, Functions `camelCase`, Files `kebab-case`.
- **Structure**: Feature modules in `features/`, thin routes in `app/`.
- **Data Fetching**: Use **Axios** and **TanStack Query**.
- **Database**: Use **Drizzle**.
- **Types**: Zod schemas used for validation.

### Step 3 — Classify each finding

- ✅ Handled — tested and working
- ⚠️ Partially handled — non-blocking suggestion
- ❌ Not handled — MUST fix before PR
- N/A — not applicable

### Step 4 — Fix all ❌ findings

Implement fix → verify → update to ✅. Do not move on until all ❌ resolved.

### Step 5 — Update task specification

Update the **3. Edge Case Analysis** section in `docs/ai-workflow/task-spec.md`.
Update **Status** to `Checked`.

```
# Edge Case Report: [Task Title]
**Ticket:** [ref]  **Date:** [date]

## Summary
[N] cases checked. [N] handled. [N] fixed. [N] suggestions.

## Results

### A. Input & data
| Case | Status | Notes |
|------|--------|-------|
| Empty name field | ✅ Handled | Zod required() |
| 500-char name | ❌ Fixed | Added maxLength(100) |

### [suggestions]
- Consider optimistic UI for the save action
```

### Step 6 — HUMAN APPROVAL GATE ⛔

**Invoke tool: AskUserQuestion**
Edge case check complete. Ready to raise PR.

**Options:**
- **Raise PR**: Proceed to ship.
- **Modify**: Investigate further.
- **Reject**: Stop.

Wait for explicit approval. If human asks to investigate further, do so and re-present.

## Notes

- ⚠️ suggestions go in PR as "Future improvements" — do NOT block PR
- If a ❌ fix adds scope, flag to human before implementing
- This checks behaviour, not code style (style was in review)
