---
name: fetch-ticket
description: Gathers task information from JIRA or user input and creates a structured task spec.
---

# Skill: fetch-ticket

## Purpose

Gathers task information from ANY starting point — JIRA ticket, full description,
one-liner, or nothing — and produce a structured task spec.
Never block the user. Always find a path forward.

## When to use

- At the start of any `/dev` workflow
- Run independently with: `/fetch-ticket`

## Instructions

Detect which situation applies:

### Situation A — JIRA ticket number provided (e.g. `/dev PROJ-123`)

1. Fetch from JIRA via MCP or API (check `.ai/config.json` for base URL).
   Fetch: summary, description, acceptance criteria, story points, labels.
2. If fetch succeeds → go to [Build spec].
3. If fetch fails → say: "Couldn't reach JIRA for PROJ-123. Tell me what the task is about."
   Then follow Situation B or C.

### Situation B — Full description provided (a paragraph or more)

Extract title, problem, expected outcome. Infer acceptance criteria.
Go to [Build spec], mark inferred fields with `[inferred]`.
Ask: "I've drafted the spec — does this look right?"

### Situation C — Vague one-liner (e.g. "add dark mode" / "fix login bug")

Run a short interview — ONE question at a time, max 4 questions:

1. "What should work after this is done that doesn't work now?"
2. "Which area does this touch — frontend, backend, a specific page?"
3. "Anything I should know — edge cases, design decisions already made?"
4. "How will you know it's complete?"
   Stop as soon as you have enough. Mark remaining fields as `[assumed]`.

### Situation D — Nothing provided

Say: "What are we building or fixing today? Even a rough idea works."
Wait, then route to B or C.

### [Build spec]

Save to: `docs/ai-workflow/task-spec.md`

```
# Task Specification: [TITLE]

## 1. Task Summary
**Ticket:** [PROJ-123 | Manual | No ticket]
**Date:** [today]
**Status:** Draft

[1-2 sentences summarizing the task]

### Acceptance Criteria
- [ ] [criterion — mark [inferred] or [assumed] if not stated]

---

## 2. Design Spec
**Status:** Pending (Run /brainstorm)

[Design details will be added here by brainstorm skill]

---

## 3. Edge Case Analysis
**Status:** Pending (Run /check-edge-cases)

[Edge cases will be added here by check-edge-cases skill]
```

**Invoke tool: AskUserQuestion**
I've drafted the task spec. Does this capture what you need?

**Options:**
- **Confirm**: Everything looks correct.
- **Modify**: I need to add/change something.
- **Cancel**: Stop this task.

Save file and announce: "Task spec saved to docs/ai-workflow/task-spec.md ✓"

## Notes

- Never say "I need more information before I can help." Always make progress.
- Inferred/assumed fields are fine — brainstorm will validate against the codebase.
- For frontend: note if it's a component, page, or data flow change.
- For full-stack: note both surfaces even if user only mentioned one.
