---
description: Global Developer Workflow Command
---

---

name: dev
description: AI-native full development pipeline orchestrator. Ticket in, PR out. Chains all skills in order with human approval gates. ONLY invoke when user explicitly says "/dev" or "/dev JIRA-123". Do NOT auto-trigger on "build", "implement", "fix this ticket", or similar phrases.

---

# /dev — Global Developer Workflow Command

Master orchestrator for the full dev workflow.
Accepts a JIRA ticket number OR prompts for task info, then chains all skills
in order with two human approval gates.

## Requirements

- **Jira / MCP** — Ticket fetch (optional: accepts plain text fallback)
- **Stitch MCP** — Design fetch (optional: only if user provides a Stitch URL or ID)
- **GitHub `gh` CLI** — PR operations in raise-pr stage
- **Skills** — All stage skills must exist in `.agent/skills/`

## Trigger Variants

| Input            | Behavior                               |
| ---------------- | -------------------------------------- |
| `/dev JIRA-123`  | Full pipeline with ticket fetch        |
| `/dev` (no args) | Ask for ticket ID or plain description |
| `/dev status`    | Show current run progress              |

## State Directory

All runtime artefacts saved to:

```
docs/ai-workflow/
```

## Pre-Run Checklist

1. Read `CLAUDE.md` for project conventions (framework, test/lint commands, JIRA URL)
2. Check if `current-task.md` already exists — confirm resume or fresh start
3. **Ask design question** (see Step 1b below)
4. Create artefact files as each stage completes

---

## Pipeline

```
fetch-ticket → [fetch-design?] → brainstorm → write-plan → GATE 1 → execute-plan → review → check-edge-cases → GATE 2 → raise-pr
```

`[fetch-design?]` = only runs if user provides a Stitch URL or ID

---

## Stage Skills

| Stage         | Skill              | Required? | What it does                                          |
| ------------- | ------------------ | --------- | ----------------------------------------------------- |
| 1. Intake     | `fetch-ticket`     | Always    | Fetch ticket or interview user, save task spec        |
| 1b. Design    | `fetch-design`     | Optional  | Fetch Design DNA from Stitch, save design spec        |
| 2. Brainstorm | `brainstorm`       | Always    | Analyse codebase, explore approaches, save design doc |
| 3. Plan       | `write-plan`       | Always    | Write granular task-by-task implementation plan       |
| —             | **GATE 1**         | Always    | Present plan, collect human `approve`                 |
| 4. Execute    | `execute-plan`     | Always    | Implement plan task by task with verification         |
| 5. Review     | `review`           | Always    | Spec compliance + code quality two-stage review       |
| 6. Edge Cases | `check-edge-cases` | Always    | Systematically verify edge cases, fix all blockers    |
| —             | **GATE 2**         | Always    | Present edge case report, collect human `raise pr`    |
| 7. Ship       | `raise-pr`         | Always    | Branch → commit → push → draft PR                     |

---

## Orchestration Steps

### Step 1 — Ticket Intake

Invoke skill: `fetch-ticket`

- If `/dev JIRA-123` provided → fetch from Jira via MCP
- If `/dev` with no args → ask user for ticket ID or plain description
- Save structured task spec to `docs/ai-workflow/current-task.md`
- Confirm with user: "Does this capture what you need?"

### Step 1b — Design Fetch (Optional)

**Immediately after ticket intake, ask:**

```
Do you have a Google Stitch design for this?
Paste a Stitch URL or screen ID, or type "skip" to continue without one.
```

**If user pastes a URL or ID:**

- Invoke skill: `fetch-design`
- Design DNA and Next.js token mapping saved to `docs/ai-workflow/design-spec-[ID].md`
- Announce: "Design fetched ✓ — brainstorm and execute will implement pixel-accurate UI."
- Continue to Step 2

**If user types "skip" or has no design:**

- Continue to Step 2 without fetch-design
- brainstorm will infer UI patterns from existing codebase

### Step 2 — Brainstorm

Invoke skill: `brainstorm`

- Scan codebase for relevant existing patterns and files
- **If design spec exists:** load `docs/ai-workflow/design-spec-*.md` — MUST reference it when proposing component structure and approach
- Present analysis in 4 sections: Current state, Approach options, Recommended design, Risks
- Ask after each section: "Does this look correct before planning?"
- Wait for approval or adjustments before proceeding
- Save design doc to `docs/ai-workflow/design-[TICKET]-[DATE].md`

### Step 3 — Write Plan

Invoke skill: `write-plan`

- Turn approved design into granular ordered task list
- **If design spec exists:** every UI task must reference the Tailwind tokens and component names from the design spec
- Each task: exact file path, what to do, how to verify
- Save plan to `docs/ai-workflow/plan-[TICKET]-[DATE].md`
- Present full plan to human

### Step 4 — GATE 1: Plan Approval ⛔

After `/write-plan` completes, present implementation plan summary then:

````txt
AskUserQuestion: "Plan ready for [ticket]. Approve to proceed with implementation?"
Options: [
  "Approve",
  "Modify — [feedback]",
  "Reject — rethink approach"
]

Wait for approval. Never begin execution without this approval.


### Step 5 — Execute Plan

Invoke skill: `execute-plan`

- Implement each task one at a time — never batch
- **If design spec exists:** treat Stitch Design DNA as source of truth for every visual decision — colors, spacing, typography, component variants must match
- Apply Next.js coding standards at all times:
  - Server Components by default — `"use client"` only when needed (event handlers, hooks, browser APIs)
  - All design tokens in `tailwind.config.ts` — never hardcode hex values in JSX
  - `next/image` for all images with explicit `width`, `height`, `alt`
  - `next/link` for all internal links
  - `next/font/google` for fonts — never `<link>` tags
  - TypeScript interfaces for all component props — no `any`
  - `cn()` utility (clsx + tailwind-merge) for conditional classes
  - Semantic HTML + ARIA for accessibility
  - Mobile-first Tailwind responsive classes (`sm:`, `md:`, `lg:`)
- Run verification after every task before moving on
- Pause and report if anything unexpected is found
- Run `npm test` + `npm run lint` after all tasks complete

### Step 6 — Review

Invoke skill: `review`

- Stage 1: Check every acceptance criterion from task spec
- **If design spec exists:** also verify visual accuracy — do implemented components match Stitch Design DNA tokens?
- Stage 2: Code quality — security, performance, accessibility, Next.js standards
- Fix all issues found before marking review complete
- Save findings to `docs/ai-workflow/review-[DATE].md`

### Step 7 — Check Edge Cases

Invoke skill: `check-edge-cases`

- Check 6 categories: inputs, async/state, auth, data integrity, UI, integrations
- Fix every ❌ blocking finding before proceeding
- Save report to `docs/ai-workflow/edge-cases-[TICKET]-[DATE].md`
- Present full report to human

### Step 8 — GATE 2: PR Approval ⛔

After `/check-edge-cases` completes, present edge case summary then:

```txt
AskUserQuestion: "Edge case review complete for [ticket or task]. Ready to raise PR?"
Options: [
  "Raise PR",
  "Modify — [additional fixes or feedback]",
  "Reject — cancel PR creation"
]

Wait for approval. Never raise PR without this approval.


### Step 9 — Raise PR

Invoke skill: `raise-pr`

- Create correctly named branch (`feat/`, `fix/`, `chore/`)
- Commit all changes with conventional commit message
- Push and open draft PR via `gh pr create`
- Include edge case findings in PR body
- **If design spec was used:** add "Design source: Stitch [projectId]/[screenId]" in PR body
- Always raise as **DRAFT** — human marks ready for review
- Announce the PR link

---

## Rules

| Rule                             | Detail                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Always ask for Stitch design     | Ask at Step 1b — skip only if user says so                                                             |
| Design spec is source of truth   | Never override Stitch tokens with arbitrary values                                                     |
| Next.js standards always apply   | Even without a design spec                                                                             |
| Never write code without a plan  | brainstorm → write-plan always come first                                                              |
| Never execute without Gate 1     | `approve` is mandatory                                                                                 |
| Never raise PR without Gate 2    | `raise pr` is mandatory                                                                                |
| Each skill runs in sequence      | Never skip or reorder stages                                                                           |
| Each skill CAN run independently | `/fetch-design`, `/brainstorm`, `/write-plan`, `/execute`, `/review`, `/check-edge-cases`, `/raise-pr` |
| Save all artefacts               | Everything goes to `docs/ai-workflow/`                                                                 |
| Never commit to main directly    | Always use a feature branch                                                                            |

## Task Size Routing

| Size                 | Behaviour                                                                               |
| -------------------- | --------------------------------------------------------------------------------------- |
| Trivial (< 50 lines) | May skip brainstorm — go fetch-ticket → [fetch-design?] → write-plan → Gate 1 → execute |
| Small / Medium       | Full pipeline, both gates                                                               |
| Large (> 500 lines)  | Full pipeline, split plan into phases if > 15 tasks                                     |
````
