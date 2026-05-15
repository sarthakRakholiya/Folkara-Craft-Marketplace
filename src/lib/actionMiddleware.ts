/**
 * @file actionMiddleware.ts
 * Express-style middleware wrappers for Next.js Server Actions.
 * Centralises auth checking and try/catch so action files need neither.
 */

import type { SessionPayload } from "@/types/auth";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: true }
  | { error: string };

export interface AuthActionContext {
  session: SessionPayload;
}

export function withAuthAction<TInput, TReturn>(
  handler: (
    ctx: AuthActionContext,
    input: TInput,
  ) => Promise<ActionResult<TReturn>>,
) {
  return async (input: TInput): Promise<ActionResult<TReturn>> => {
    const { getSession } = await import("@/lib/session");
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

export function withAuthQuery<TInput, TReturn>(
  handler: (ctx: AuthActionContext, input: TInput) => Promise<TReturn | null>,
) {
  return async (input?: TInput): Promise<TReturn | null> => {
    const { getSession } = await import("@/lib/session");
    const session = await getSession();
    if (!session) return null;
    try {
      return await handler({ session }, input as TInput);
    } catch (err) {
      console.error("[withAuthQuery]", err);
      return null;
    }
  };
}
