---
name: brainstorm
description: Deep code-level analysis of the task before writing any code. Explore approaches, identify risks, define the design, save a design document.
---

# Skill: brainstorm

## Purpose

Deep code-level analysis of the task before writing any code.
Explore approaches, identify risks, define the design, save a design document.

## When to use

- After fetch-ticket produces a task spec
- Run independently with: `/brainstorm`
- Before any planning or coding

## Announcement

"I'm using the brainstorm skill to analyse this task at code level."

## Instructions

### Step 1 — Read context

- Read `docs/ai-workflow/task-spec.md`
- Scan codebase: top-level dirs, key config files, existing patterns
- Identify relevant existing files that will need to change

### Step 2 — Present analysis in sections

**Section A: Current state**

- What exists in the codebase related to this task
- Which files are affected
- Patterns already in use (component libraries, state management, API patterns)

**Section B: Approach options** (2-3 alternatives)
For each: what it does, pros/cons, estimated complexity (S/M/L), recommended? why?

**Section C: Recommended design**

- Chosen approach with justification
- New files to create (with purpose)
- Existing files to modify (what changes)
- Data flow / state changes
- API contracts (if full-stack)
- Edge cases and handling
- **Architectural Alignment**: Ensure feature-based structure (`features/<name>/`) and thin entry points.

**Section D: Risks & dependencies**

- Things that could go wrong
- External dependencies
- Testing considerations

### Step 3 — Ask for validation

After each section: "Does section [X] look right? Any changes?"

### Step 4 — Update task specification

Update the **2. Design Spec** section in `docs/ai-workflow/task-spec.md`.
Update **Status** to `Approved`.
Update **Acceptance Criteria** if brainstorm revealed new requirements.

## Notes

- **Naming Conventions**: 
  - Components: `PascalCase`
  - Functions/Variables/Hooks: `camelCase`
  - Folders: `camelCase`
  - Files: `PascalCase` for component/view files, `camelCase` for non-component files
  - Route Segments: `kebab-case`
- **Data Fetching**: Use **Axios** and **TanStack Query**.
- **Database**: Use **Drizzle**.
- Frontend: focus on component boundaries, prop/state shape, accessibility
- Backend: focus on DB schema, API contract, auth requirements
- Never write actual code in this skill — design only
