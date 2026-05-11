# AI Agent Instructions — [Your Project Name]

## Skills system
This project uses a custom skills system. Before doing any development task,
you MUST check `.ai/skills/` for a relevant skill and follow it.

### How to find and use skills
- Skills live in `.ai/skills/[skill-name]/SKILL.md`
- Commands live in `.ai/commands/[command].md`
- Read the relevant SKILL.md and follow it exactly

### When a skill applies, you MUST use it. This is not optional.

---

## Available commands

### `/dev [JIRA-XXX]` — Full workflow
Runs the complete development pipeline:
fetch-ticket → brainstorm → write-plan → [HUMAN APPROVAL] → execute-plan → review → check-edge-cases → [HUMAN APPROVAL] → raise-pr

Read: `.ai/commands/dev.md`

---

## Available individual skills

| Skill | Trigger | File |
|-------|---------|------|
| fetch-ticket | Start of any task | `.ai/skills/fetch-ticket/SKILL.md` |
| brainstorm | Before designing anything | `.ai/skills/brainstorm/SKILL.md` |
| write-plan | After design approved | `.ai/skills/write-plan/SKILL.md` |
| execute-plan | After plan approved | `.ai/skills/execute-plan/SKILL.md` |
| review | After implementation | `.ai/skills/review/SKILL.md` |
| check-edge-cases | After review, before PR | `.ai/skills/check-edge-cases/SKILL.md` |
| raise-pr | After edge cases approved | `.ai/skills/raise-pr/SKILL.md` |

### Run a skill individually
Just say: `/brainstorm`, `/write-plan`, `/execute`, `/review`, `/check-edge-cases`, `/raise-pr`

---

## Ground rules
1. Never write code without a plan.
2. Never execute a plan without human approval.
3. Never commit to main directly.
4. Never skip the review skill.
5. Never raise a PR without running check-edge-cases and getting human approval.
6. Always save artefacts to `docs/ai-workflow/`.

---

## Project conventions
- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Database: Drizzle (Neon PostgreSQL)
- API: Axios + TanStack Query
- Testing: Vitest + Playwright
- Package manager: npm
- Lint command: npm run lint
- Test command: npm test
- Dev server: npm run dev

---

## JIRA config
- JIRA base URL: [https://yourcompany.atlassian.net — fill in]
- Project key: [PROJ — fill in]
- MCP: If JIRA MCP is connected, use it. Otherwise prompt for manual input.
