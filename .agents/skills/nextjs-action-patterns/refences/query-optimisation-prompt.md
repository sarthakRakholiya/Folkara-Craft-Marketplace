# Drizzle Query Optimisation — Agent Prompt

Paste this prompt to your AI agent to optimise all Drizzle queries inside
Server Action files. Run this after or together with the middleware refactor.

---

```
You are optimising all Drizzle ORM queries inside Next.js Server Action files
in this project. Apply every rule below to every file under /features and /app
that contains 'use server'. Do not change any business logic or return shapes.

## Rule 1 — Never SELECT *
Always project only the columns the handler actually uses below the query.

  BEFORE:
    db.query.users.findFirst({ where: eq(users.id, session.userId) })

  AFTER:
    db.query.users.findFirst({
      where: eq(users.id, session.userId),
      columns: { id: true, firstName: true, avatarUrl: true },
    })

## Rule 2 — Run independent queries in parallel with Promise.all
If two or more queries do not depend on each other's result, never await them serially.

  BEFORE:
    const user = await db.query.users.findFirst(...);
    const shop = await db.query.shops.findFirst(...);

  AFTER:
    const [user, shop] = await Promise.all([
      db.query.users.findFirst(...),
      db.query.shops.findFirst(...),
    ]);

## Rule 3 — Run independent writes in parallel with Promise.all

  BEFORE:
    await db.update(users).set(...).where(...);
    await db.update(shops).set(...).where(...);

  AFTER:
    await Promise.all([
      db.update(users).set(...).where(...),
      db.update(shops).set(...).where(...),
    ]);

## Rule 4 — Add .limit(1) to every single-row SELECT that lacks it

  db.select({...}).from(users).where(eq(users.id, id)).limit(1)

## Rule 5 — Never fetch a full row just to check existence

  BEFORE:
    const user = await db.query.users.findFirst({ where: eq(users.id, id) });
    if (!user) return { error: 'Not found' };

  AFTER:
    const [exists] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!exists) return { error: 'Not found' };

## Rule 6 — Never re-fetch after a write; use .returning() instead

  BEFORE:
    await db.update(users).set({ firstName }).where(eq(users.id, id));
    const updated = await db.query.users.findFirst({ where: eq(users.id, id) });

  AFTER:
    const [updated] = await db
      .update(users)
      .set({ firstName })
      .where(eq(users.id, id))
      .returning({ id: users.id, firstName: users.firstName });

## Rule 7 — Only fetch onboardingData / JSONB columns when the handler actually merges them
Do not include heavy JSONB columns in a SELECT unless the code below reads and spreads them.

## Rule 8 — Use findFirst for simple single-row lookups, .select() for projections
  - findFirst + columns: {} → when you need a typed result from the query builder
  - .select({}).from().where().limit(1) → when you need precise column control or joins

## Checklist before finishing each file
- No two sequential awaits where Promise.all would work
- Every findFirst / select has an explicit columns list
- All single-row selects have .limit(1)
- No post-write SELECT when .returning() covers the need
- No existence check pulling more than the primary key
- No JSONB column fetched unless used
```
