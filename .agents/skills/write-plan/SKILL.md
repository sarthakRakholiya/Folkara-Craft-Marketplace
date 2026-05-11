---
name: write-plan
description: Creates a detailed, step-by-step implementation plan from an approved design document.
---

# Skill: write-plan

## Purpose

Turn the approved design into a granular, executable implementation plan.
Each task must be small enough to implement in isolation and verify.

## When to use

- After brainstorm design is approved
- Run independently with: `/write-plan`

## Announcement

"I'm using the write-plan skill to create the implementation plan."

## Prerequisites

- `docs/ai-workflow/task-spec.md` exists and is approved (Design Spec section is complete)
- If not found, invoke brainstorm skill first

## Instructions

### Step 1 — Map all files

List every file that will be created, modified, or deleted.
Each file gets one clear responsibility. If a file does two things, split tasks.

### Step 2 — Break into tasks

Each task must:

- Take 2-10 minutes to implement
- Have a single, clear outcome
- Include exact file paths (following `kebab-case` naming)
- Include enough context that no prior knowledge is needed
- Have a verification step
- **Naming Check**: Ensure new components use `PascalCase` and functions use `camelCase`.

Tasks ordered so each builds on the previous.

### Step 3 — Write the plan

Save to: `docs/ai-workflow/plan.md`

```
# Implementation Plan: [Task Title]
> For AI execution: Use skill execute-plan to implement task-by-task.

**Ticket:** [ref]  **Design doc:** [link]  **Date:** [date]

## Files map
| File | Action |
|------|--------|
| src/... | Create |
| src/... | Modify |

## Tasks

### Task 1 — [Short title]
**File:** `src/components/foo-bar.tsx`
**What:** [exactly what to do]
**Code guidance:** [specific implementation notes]
**Verify:** [command or check to confirm it works]
- [ ] Task complete

### Task 2 — ...
```

### Step 4 — Present plan and STOP

**Invoke tool: AskUserQuestion**
Plan ready. Please review and approve to begin execution.

**Options:**
- **Approve**: Start implementation.
- **Modify**: Provide feedback.
- **Reject**: Cancel.

STOP. Do not begin execution. Wait for explicit approval.

## Notes

- **Conventions**:
  - Components: `PascalCase` (e.g., `ProductCard`)
  - Functions: `camelCase` (e.g., `getProduct`)
  - Files: `kebab-case` (e.g., `product-card.tsx`)
  - Folders: `camelCase` (e.g., `productCatalog`)
- Max 15 tasks per plan. If more, split into phases.
- Frontend: include component name, props, state, event handlers
- Backend: include route, request/response shape, DB changes
- Include rollback note for DB migrations
