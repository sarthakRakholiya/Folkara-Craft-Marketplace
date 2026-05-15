---
name: nextjs-action-patterns
description: >
  Refactors and scaffolds Next.js Server Action files to use centralised
  auth middleware (withAuthAction / withAuthQuery), centralised error handling
  (no try/catch in action files), React Query hooks for data fetching, and
  Drizzle ORM query optimisation (column projection, Promise.all parallelism,
  .limit(1), .returning()). Use this skill whenever the user mentions server
  actions, 'use server', action files, middleware for actions, try/catch in
  actions, getSession in actions, React Query with actions, or Drizzle query
  performance. Trigger even if the user only mentions one of these — the full
  pattern is almost always relevant.
---

## Creating a new action from scratch

When the user says "create an action", "add a new action", or
"scaffold a feature", always produce:

1. The action file with 'use server' at top
2. withAuthAction or withAuthQuery — never raw async function exports
3. Explicit columns on every Drizzle query
4. Promise.all for any independent queries or writes
5. A useQuery or useMutation hook file alongside it

Never scaffold a bare `export async function` — always wrap from the start.

# Next.js Server Action Patterns Skill

Covers three tightly related concerns that almost always appear together:

1. **Middleware wrappers** — centralised auth + error handling
2. **Drizzle query optimisation** — fast, minimal DB round-trips
3. **React Query integration** — caching reads, clean mutation flow

Read the relevant reference file for the section you need, or all three for a
full refactor. Each reference file is self-contained and includes a ready-to-use
prompt you can hand to an AI agent.

---

## When to read which reference

| User asks about                                               | Read                                      |
| ------------------------------------------------------------- | ----------------------------------------- |
| try/catch in actions, getSession everywhere, auth boilerplate | `references/middleware-prompt.md`         |
| Slow queries, SELECT \*, serial awaits, re-fetch after write  | `references/query-optimisation-prompt.md` |
| React Query, useQuery, useMutation, queryKeys, caching        | `references/react-query-prompt.md`        |
| Full refactor of an action file / feature folder              | All three, in order                       |

---

## File layout produced by this skill

```
@/lib/
  actionMiddleware.ts     ← withAuthAction, withAuthQuery, ActionResult
  queryKeys.ts            ← typed queryKeys registry

@/features/<name>/
  actions.ts               ← 'use server', no try/catch, no getSession
  hooks/
    use<Name>Query.ts    ← useQuery wrapper
    use<Name>Mutation.ts ← useMutation wrapper
```

---

## Quick reference — wrapper signatures

```ts
// Protected mutation → ActionResult
export const updateFoo = withAuthAction(async ({ session }, data: FooInput) => {
  // session.userId always defined
  // throw anything — wrapper catches and returns { error: message }
  return { success: true };
});

// Protected read → data | null
export const getFoo = withAuthQuery(async ({ session }) => {
  return db.query.foo.findFirst({ where: eq(foo.userId, session.userId) });
});
```

---

## Checklist — use before marking any action file done

- [ ] `'use server'` at top
- [ ] No `try/catch` anywhere in file
- [ ] No `getSession()` call in file
- [ ] No `if (!session) return { error: 'Unauthorized' }`
- [ ] Every exported action is `const`, not `async function`
- [ ] Mutations use `withAuthAction`, reads use `withAuthQuery`
- [ ] No `SELECT *` — explicit `columns: {}` on every query
- [ ] Independent queries/writes use `Promise.all`
- [ ] Single-row selects have `.limit(1)`
- [ ] No post-write re-fetch when `.returning()` works
- [ ] No existence check that pulls more than primary key

---

## Reference files

- `references/middleware-prompt.md` — full agent prompt for auth/error refactor
- `references/query-optimisation-prompt.md` — full agent prompt for Drizzle optimisation
- `references/react-query-prompt.md` — full agent prompt for React Query integration
