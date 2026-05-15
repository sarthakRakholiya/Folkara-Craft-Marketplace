---
trigger: always_on
---

# Next.js Enterprise Architecture Guide

> **Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · React Hook Form · Zod · Prisma · Neon PostgreSQL · Clerk · UploadThing · Stripe Connect · Vercel AI SDK

---

## 1. Principles

Every module must be scalable, modular, typed, reusable, accessible, secure, performant, and maintainable. Favour server-side execution, feature isolation, and explicit typing over convenience shortcuts.

---

## 2. Project Structure

```
src/
├── app/                    # App Router (routes only — no logic)
│   ├── (public)/           # Unauthenticated routes
│   ├── (auth)/             # Login / signup flows
│   ├── (dashboard)/        # Authenticated dashboard routes
│   ├── api/                # Route handlers (thin wrappers)
│   └── layout.tsx
├── features/               # Domain modules (see §4)
├── components/             # Shared UI (ui/, form/, layout/, shared/, feedback/)
├── actions/                # Server Actions
├── services/               # Business logic & third-party calls
├── hooks/                  # Shared hooks (use* prefix)
├── providers/              # Context providers
├── lib/                    # Pure utilities
├── config/                 # App & theme configuration
├── types/                  # Shared TypeScript types
├── constants/              # Routes, roles, regex, limits
├── validations/            # Zod schemas
├── prisma/                 # Schema, migrations, seed
└── middleware.ts           # Auth, redirects, locale, RBAC
```

---

## 3. Routing & Pages

Pages are thin entry points — import a feature view, render it, nothing else.

```tsx
// ✗ Bad              ✓ Good
import { DashboardView } from "@/features/dashboard/views/dashboard-view";
export default function Page() {
  return <DashboardView />;
}
```

Every async route must include sibling `loading.tsx` and `error.tsx`.

---

## 4. Feature Modules

Each domain is self-contained under `features/<name>/` and removable without breaking unrelated code.

```
features/product/
├── actions/    ├── components/    ├── hooks/     ├── loader/
├── modals/     ├── schemas/       ├── services/  ├── types/
├── views/      ├── utils.ts       └── README.md
```

> Every feature must contain its own `components/`, `loader/`, `modals/`, and `utils.ts`.

---

## 5. Component Guidelines

- Default to **Server Components**. Add `"use client"` only for `useState`, `useEffect`, browser APIs, or animations.
- Always use **named exports** (default exports only for Next.js pages/layouts).
- **1 component per file**, max ~300 lines. Extract reusable logic into hooks.
- `components/ui/` — stateless primitives only (button, card, dialog, table, badge, tooltip).
- All components must support keyboard navigation, `aria-*` attributes, focus states, and screen readers.

## 6. Forms & Validation

**Stack:** React Hook Form + Zod + `@hookform/resolvers/zod`

Each form control wraps `Controller` — consumer passes only `control`, `name`, `label`, `placeholder`.

```tsx
<FormInput
  control={form.control}
  name="email"
  label="Email"
  placeholder="Enter email"
/>
```

All schemas in `validations/<domain>.validation.ts`:

```ts
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginSchema = z.infer<typeof loginSchema>;
```

Every submission must show loading state, disable the button, and apply optimistic updates where appropriate.

---

## 7. Styling & Theming

- No arbitrary hex (`bg-primary` not `bg-[#1a1a2e]`), no arbitrary spacing (`mt-4` not `mt-[13px]`).
- Mobile-first responsive design. All tokens in `config/theme/` and `globals.css`.

```css
:root {
  --primary: 222 47% 11%;
  --radius: 0.5rem;
}
```

**Palette:** `primary`, `secondary`, `accent`, `muted`, `success`, `warning`, `danger`, `background`, `foreground`, `card`, `border`, `input`, `ring` — each with `DEFAULT` + `foreground` via `hsl(var(--token))`.

**Breakpoints:** `xs:480px` · `sm:640px` · `md:768px` · `lg:1024px` · `xl:1280px` · `2xl:1536px`

Use Framer Motion sparingly — only when it serves usability.

---

## 8. Data Layer

```
Client ──► Server Action ──► Service ──► Prisma ──► Neon (PostgreSQL)
```

| Layer         | Location    | Responsibility                                            |
| ------------- | ----------- | --------------------------------------------------------- |
| Service       | `services/` | Business logic, Prisma queries, external APIs, AI, Stripe |
| Server Action | `actions/`  | Validate → auth → call service → standardised response    |

**Prisma:** Singleton in `lib/prisma.ts`. Every model has `id`, `createdAt`, `updatedAt`. Models in `PascalCase`, fields in `camelCase`. Neon PostgreSQL with `pgvector`. Never expose DB to client.

**Fetching priority:** Server Components → Server Actions → Client-side (last resort). **Caching:** `revalidateTag`, `unstable_cache`, cursor-based pagination for large datasets.

---

## 9. Auth & Authorization

**Provider:** Clerk. Roles (`ADMIN`, `BUYER`, `SELLER`) stored in session claims.

**Checklist:** Server actions, API routes, pages, layouts, and middleware must all verify auth + role.

---

## 10. API & Server Actions

Route handlers are thin wrappers — no business logic.

```ts
export async function createProductAction(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.flatten() };
  const user = await currentUser();
  if (!user) return { success: false, error: "Unauthorized" };
  authorizeRole(user, ["SELLER", "ADMIN"]);
  const product = await productService.create(parsed.data, user.id);
  return { success: true, data: product };
}
```

**Response envelope:** `{ success: true, data, message? }` or `{ success: false, error }`

---

## 11. File Uploads

**Provider:** UploadThing. Organise by domain: `uploads/products/`, `uploads/avatars/`, `uploads/documents/`.

---

## 12. AI Integration

**SDK:** Vercel AI SDK. **Models:** Gemini 2.5 Flash (generation), `text-embedding-004` (embeddings).

All AI code in `features/ai/` — separate modules for prompts, embeddings, chat, streaming, generation. Semantic search via `pgvector` + cosine similarity with embedding caching.

---

## 13. Payments

**Provider:** Stripe Connect in `services/stripe/`. Never trust client-side prices — server must validate amount, user identity, seller account, and platform fee.

---

## 14. State Management

Server state → URL state → React state → Zustand (only when truly global).

---

## 15. Error Handling & UX States

Every list/table handles four states: loading (skeleton), empty (illustration + CTA), error (retry + message), success. Use a single centralised toast system.

---

## 16. Performance & SEO

- `next/dynamic` for heavy client components. `next/image` exclusively — never raw `<img>`.
- `metadata` API for SEO — never `next/head`.
- Memoisation only when profiling justifies it.

---

## 17. Security

Validate and sanitise every server input. Never expose secrets — `.env.local` for dev, platform secrets for prod. Sensitive operations require server-side auth regardless of client guards.

---

## 18. Testing

**Unit/integration:** Vitest + React Testing Library. **E2E:** Playwright.

---

## 19. Naming Conventions

### Quick Reference

| Target                    | Convention                 | Example                               |
| ------------------------- | -------------------------- | ------------------------------------- |
| React Components          | `PascalCase`               | `ProductCard`, `UserProfileHeader`    |
| Functions (non-component) | `camelCase`                | `getProductById`, `formatCurrency`    |
| React Hooks               | `camelCase` + `use` prefix | `useProductFilters`, `useAuthSession` |
| Variables & Constants     | `camelCase`                | `isLoading`, `productList`            |
| Folders                   | `camelCase`                | `productCatalog/`, `formControls/`    |
| Source Files              | `camelCase`               | `productCard.tsx`, `useFilters.ts`    |
| Route Segments            | `kebab-case`               | `product-listings/`, `sign-in/`       |
| Prisma Models             | `PascalCase`               | `Product`, `UserProfile`              |
| Prisma Fields             | `camelCase`                | `createdAt`, `sellerId`               |
| Git Branches              | `type/kebab-case`          | `feature/add-product-card`            |
| Commit Messages           | `type:` prefix             | `feat:`, `fix:`, `refactor:`          |

---

### 19.1 Component Names — `PascalCase`

All React components: capitalise every word, no separators.

```tsx
// ✓ Correct
export function ProductCard() { ... }
export function UserProfileHeader() { ... }
export function DashboardSidebarNav() { ... }

// ✗ Wrong
export function productCard() { ... }     // camelCase
export function product_card() { ... }    // snake_case
```

Applies to: pages, layouts, UI primitives, feature components, modals, form controls.

---

### 19.2 Functions & Variables — `camelCase`

All functions (non-component), variables, hooks, and instances.

```ts
// ✓ Correct
async function getProductById(id: string) { ... }
const handleFormSubmit = () => { ... }
const isLoading = false;

// ✓ Hooks — camelCase + use prefix
function useProductFilters() { ... }
function useAuthSession() { ... }

// ✗ Wrong
function GetProductById() { ... }     // PascalCase — reserved for components
function get_product_by_id() { ... }  // snake_case
```

---

### 19.3 Folder Names — `camelCase`

```
✓ features/productCatalog/
✓ components/formControls/
✓ services/stripePayments/

✗ product-catalog/   // kebab-case not allowed
✗ ProductCatalog/    // PascalCase not allowed
```

> **Exception:** Next.js reserved conventions stay as-is — `app/`, `(auth)/`, `[id]/`, `[...slug]/`, `_components/`.

---

### 19.4 File Names — `camelCase`

```
✓ productCard.tsx            ✓ useProductFilters.ts
✓ authSessionService.ts      ✓ createProductAction.ts
✓ loginValidation.ts         ✓ productTypes.ts

✗ ProductCard.tsx    // PascalCase not allowed
✗ product-card.tsx   // kebab-case not allowed
```

> **Exception:** Next.js special files keep exact names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `middleware.ts`.

---

### 19.5 Route Segments — `kebab-case`

All `app/` route folders produce clean, SEO-friendly URLs.

```
app/
├── (auth)/
│   ├── sign-in/            → /sign-in
│   └── forgot-password/    → /forgot-password
└── (dashboard)/
    ├── my-orders/          → /my-orders
    ├── product-listings/   → /product-listings
    └── seller-analytics/   → /seller-analytics

✗ signIn/      // camelCase not allowed
✗ SignIn/      // PascalCase not allowed
✗ sign_in/     // snake_case not allowed
```

Dynamic segments follow the same rule: `[product-id]`, `[order-id]`.

---

### 19.6 Real-world Example

```
features/
└── productCatalog/                    ← folder: camelCase
    ├── components/
    │   ├── product-card.tsx            ← file: kebab-case
    │   └── product-filter-bar.tsx
    ├── hooks/
    │   └── use-product-filters.ts
    └── views/
        └── product-listing-view.tsx

app/(dashboard)/
└── product-listings/                  ← route: kebab-case
    ├── page.tsx
    └── [product-id]/
        └── page.tsx
```

Inside `product-card.tsx`:

```tsx
export function ProductCard({ product }: ProductCardProps) { // PascalCase component
  const isOnSale = product.discountPercent > 0;              // camelCase variable
  const handleAddToCart = () => { ... };                     // camelCase handler
  return <div>...</div>;
}
```

---

## 20. Code Quality & Git

**Tooling:** ESLint, Prettier, Husky, lint-staged.

Always use `@/` alias. No relative traversals. Centralised logger only — no `console.log` in production.

**Branches:** `feature/`, `fix/`, `refactor/`, `hotfix/`. **Commits:** `feat:`, `fix:`, `refactor:`, `docs:`, `test:`.

---

## 21. Deployment

**Platform:** Vercel. Env vars per-environment, preview deploys on PRs, production builds must pass lint + type-check + tests before merge.
