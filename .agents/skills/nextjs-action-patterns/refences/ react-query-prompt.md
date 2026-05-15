# React Query Integration — Agent Prompt

Paste this prompt to your AI agent to add React Query hooks for all Server
Action reads and mutations. Run this after the middleware refactor.

---

```
You are adding React Query hooks for all Next.js Server Actions in this project.

## Goal
- Reads (getX actions) → useQuery hooks with typed queryKeys and staleTime
- Mutations (updateX / createX / deleteX actions) → useMutation hooks that
  invalidate the correct queries on success
- No component should call a read action directly; all reads go through hooks

## Step 1 — Create @/lib/query-keys.ts if it does not exist

  /**
   * @file query-keys.ts
   * Central registry of all React Query cache keys.
   * Always use these — never inline string arrays in components.
   */
  export const queryKeys = {
    // Add one entry per withAuthQuery action in the project, e.g.:
    buyerProfile:  ['buyer', 'profile']  as const,
    sellerProfile: ['seller', 'profile'] as const,
    shop:          (id: string) => ['shop', id] as const,
  } as const;

  Extend this file with a key for every withAuthQuery action you find.

## Step 2 — For every withAuthQuery action, create a useQuery hook

  File location: @/features/<feature>/hooks/use-<name>.ts

  TEMPLATE:
    'use client';

    import { useQuery } from '@tanstack/react-query';
    import { queryKeys } from '@/lib/query-keys';
    import { getSellerProfile } from '../actions';

    /**
     * Returns the current seller's profile, cached for 5 minutes.
     * Components never call getSellerProfile() directly.
     */
    export function useSellerProfile() {
      return useQuery({
        queryKey: queryKeys.sellerProfile,
        queryFn:  getSellerProfile,
        staleTime: 1000 * 60 * 5,   // 5 min — adjust per data volatility
      });
    }

  Rules:
  - staleTime guidance:
      profile / user data      → 5 min  (1000 * 60 * 5)
      shop / product lists     → 2 min  (1000 * 60 * 2)
      real-time / order status → 0      (always refetch)
  - Always name the file useResource.ts (camelCase)
  - Always add a JSDoc explaining what it caches and for how long

## Step 3 — For every withAuthAction mutation, create a useMutation hook

  File location: @/features/<feature>/hooks/use-<name>-mutation.ts

  TEMPLATE:
    'use client';

    import { useMutation, useQueryClient } from '@tanstack/react-query';
    import { queryKeys } from '@/lib/query-keys';
    import { updateSellerProfile } from '../actions';
    import type { SellerProfileInput } from '../schemas/seller.schema';

    /**
     * Mutation hook for updateSellerProfile.
     * On success, invalidates the seller profile cache so UI reflects changes.
     */
    export function useUpdateSellerProfile() {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (data: SellerProfileInput) => updateSellerProfile(data),
        onSuccess: (result) => {
          if ('error' in result) return; // action returned a validation error — don't invalidate
          queryClient.invalidateQueries({ queryKey: queryKeys.sellerProfile });
        },
      });
    }

  Rules:
  - Always check `if ('error' in result) return` before invalidating
  - Invalidate all queryKeys that could be stale after the mutation
  - Name the file use-<resource>-mutation.ts

## Step 4 — Update components that call actions directly

  BEFORE (component calling action directly):
    const [profile, setProfile] = useState(null);
    useEffect(() => { getSellerProfile().then(setProfile); }, []);

  AFTER (component using the hook):
    const { data: profile, isLoading } = useSellerProfile();

  BEFORE (component calling mutation directly):
    const result = await updateSellerProfile(data);
    if ('error' in result) setError(result.error);

  AFTER (component using mutation hook):
    const { mutate, isPending } = useUpdateSellerProfile();
    mutate(data, {
      onError: (err) => setError(err.message),
      onSuccess: (result) => {
        if ('error' in result) { setError(result.error); return; }
        toast.success('Saved');
      },
    });

## DO NOT change
- action-middleware.ts
- Any action file logic
- query-keys.ts entries that already exist (only add new ones)
- Any server component that passes initial data as props

## Checklist before finishing
- @/lib/query-keys.ts exists and has a key for every withAuthQuery action
- Every withAuthQuery action has a corresponding useQuery hook file
- Every withAuthAction mutation has a corresponding useMutation hook file
- No client component imports a withAuthQuery action directly
- All mutation hooks check 'error' in result before invalidating
- All useQuery hooks have an explicit staleTime
```
