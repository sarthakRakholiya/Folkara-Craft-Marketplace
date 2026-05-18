---
name: review
description: Two-stage review: spec compliance and code quality.
---

# Skill: review

## Purpose

Two-stage review: spec compliance first, then code quality.

## When to use

- After execute-plan completes
- Run independently with: `/review`

## Announcement

"Running two-stage review: spec compliance then code quality."

## Stage 1 — Spec compliance

Check each acceptance criterion from `docs/ai-workflow/task-spec.md`:

- Is it implemented?
- Is it tested?
- Does it match the spec exactly — not more, not less?

Check each task in the plan:

- Is the checkbox marked complete?
- Does actual code match the task description?
- Were any extra files created beyond the plan?

Result: if all pass → Stage 2. If any fail → list what's wrong, fix, re-run.

## Stage 2 — Code quality (only after Stage 1 passes)

### Correctness

- No obvious logic errors
- Edge cases handled (null, empty, error states)
- No hardcoded values that should be config/env vars

### Security

- No SQL injection risks
- No exposed secrets or API keys
- Auth checks on new API routes

### Maintainability

- Functions do one thing
- **Naming Conventions**: 
  - Components: `PascalCase`
  - Functions/Variables/Hooks: `camelCase`
  - Folders: `camelCase`
  - Files: `PascalCase` for component/view files, `camelCase` for non-component files
  - Route Segments: `kebab-case`
- No deeply nested logic (max 3 levels)
- Complex logic has a WHY comment

### Architecture

- **Domain Isolation**: Code is in `features/<name>/` where appropriate.
- **Thin Pages**: `app/` routes are thin entry points to feature views.
- **Server Components**: Default to RSC unless client-side interactive.
- **Data Fetching**: Use **Axios** and **TanStack Query**. No raw `fetch` or `useEffect` for data.
- **Database**: Use **Drizzle**. No Prisma.

### Frontend

- Accessible (ARIA, keyboard navigation)
- No inline styles that should be CSS/Tailwind
- Loading, empty, error states handled
- No console.log left in

### Performance

- No N+1 queries
- No unnecessary re-renders

### Output

Save to: `docs/ai-workflow/review.md`

Fix all issues before marking review complete.

## Notes

- Strict in Stage 1. Don't move on if anything is missing.
- Mark non-blockers as `[suggestion]`
