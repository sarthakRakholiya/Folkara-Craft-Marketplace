# Middleware Refactor — Agent Prompt

Paste this prompt to your AI agent to refactor all Server Action files to use
centralised auth and error handling. No business logic will be changed.

---

```
You are refactoring all Next.js Server Action files in this project.

## Goal
Centralise auth and error handling using two middleware wrappers.
No action file should contain try/catch or session checks after this change.

## The two wrappers (already exist at @/lib/action-middleware.ts)

withAuthAction  — for protected mutations (returns ActionResult)
withAuthQuery   — for protected reads (returns data | null)

Their signatures:

  withAuthAction<TInput, TReturn>(
    handler: (ctx: { session: Session }, input: TInput) => Promise<ActionResult<TReturn>>
  )

  withAuthQuery<TReturn>(
    handler: (ctx: { session: Session }) => Promise<TReturn | null>
  )

ActionResult = { success: true } | { error: string }

## Rules — apply to EVERY file under /features and /app that contains 'use server'

1. REMOVE every try/catch block from action functions.
   The wrappers catch all thrown errors automatically.

2. REMOVE every manual session check, e.g.:
     const session = await getSession();
     if (!session) return { error: 'Unauthorized' };
   The wrappers handle this.

3. REMOVE getSession and requireSession imports/calls from action files.
   Session is injected as ctx.session by the wrapper.

4. CONVERT every exported async function to use the correct wrapper:

   BEFORE:
     export async function updateFoo(data: FooData): Promise<ActionResult> {
       const session = await getSession();
       if (!session) return { error: 'Unauthorized' };
       try {
         await db.update(...);
         return { success: true };
       } catch (err) {
         console.error(err);
         return { error: 'Failed' };
       }
     }

   AFTER:
     export const updateFoo = withAuthAction(async ({ session }, data: FooData) => {
       await db.update(...);
       return { success: true };
     });

5. For read functions that return data (not ActionResult), use withAuthQuery:

   BEFORE:
     export async function getProfile() {
       const session = await getSession();
       if (!session) return null;
       try {
         return await db.query.users.findFirst(...);
       } catch {
         return null;
       }
     }

   AFTER:
     export const getProfile = withAuthQuery(async ({ session }) => {
       return db.query.users.findFirst(...);
     });

6. ADD these imports to every converted file:
     import { withAuthAction, withAuthQuery } from '@/lib/action-middleware';
   REMOVE:
     import { getSession } from '@/lib/session'  ← only if no longer used

7. DO NOT change any business logic, db queries, zod validation,
   setSession calls, or return values inside the handler body.

8. DO NOT touch action-middleware.ts itself.

9. Keep all existing imports that are still used (db, schemas, bcrypt, etc).

10. Keep 'use server' directive at the top of every file.

## Checklist before finishing each file
- No try/catch anywhere in the file
- No getSession() call in the file
- No manual if (!session) return checks
- Every exported action is const, not async function
- withAuthAction used for mutations
- withAuthQuery used for reads returning data
- File still has 'use server' at top
```

---

## action-middleware.ts — create this file at @/lib/action-middleware.ts

```ts
/**
 * @file action-middleware.ts
 * Express-style middleware wrappers for Next.js Server Actions.
 * Centralises auth checking and try/catch so action files need neither.
 */

import { getSession } from "@/lib/session";
import type { Session } from "@/lib/session";

export type ActionResult<T = void> =
  | (T extends void ? { success: true } : { success: true; data: T })
  | { error: string };

export interface AuthActionContext {
  session: Session;
}

export function withAuthAction<TInput, TReturn>(
  handler: (
    ctx: AuthActionContext,
    input: TInput,
  ) => Promise<ActionResult<TReturn>>,
) {
  return async (input: TInput): Promise<ActionResult<TReturn>> => {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" } as ActionResult<TReturn>;
    try {
      return await handler({ session }, input);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      console.error("[withAuthAction]", err);
      return { error: message } as ActionResult<TReturn>;
    }
  };
}

export function withAuthQuery<TReturn>(
  handler: (ctx: AuthActionContext) => Promise<TReturn | null>,
) {
  return async (): Promise<TReturn | null> => {
    const session = await getSession();
    if (!session) return null;
    try {
      return await handler({ session });
    } catch (err) {
      console.error("[withAuthQuery]", err);
      return null;
    }
  };
}
```
