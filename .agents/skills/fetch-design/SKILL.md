---
name: fetch-design
description: Fetches design from Google Stitch MCP using a project URL or screen ID, extracts Design DNA (colors, typography, spacing, components), and saves it as a structured production-ready design spec for Next.js + Tailwind implementation.
---

# Enhanced Stitch Design Fetcher Skill

````md
---
name: fetch-design
description: Fetches design from Google Stitch MCP using a project URL or screen ID, extracts Design DNA (colors, typography, spacing, components), and saves it as a structured production-ready design spec for Next.js + Tailwind implementation.
---

# fetch-design — Google Stitch Design Fetcher

Connects to Google Stitch via MCP, pulls complete Design DNA from the given screen or project,
and generates a production-level implementation specification optimized for:

- Next.js App Router
- Tailwind CSS
- TypeScript
- Scalable component architecture
- Design token systems
- Enterprise frontend standards

The generated design spec is used by brainstorm and execute-plan skills to implement pixel-perfect UI.

---

# Requirements

- Stitch MCP must be connected in Antigravity (`... → MCP → Stitch`)
- User must provide:
  - Stitch project URL
  - OR project ID
  - OR screen ID

---

# When To Use

Use when:

- User provides a Stitch design URL
- User shares a Stitch screen/project ID
- `/dev` requests design implementation context
- UI cloning or pixel-perfect frontend implementation is required

---

# Announcement

"Connecting to Google Stitch to fetch your design. Extracting Design DNA and preparing production-ready frontend implementation context now."

---

# STEP 1 — Get Stitch Reference

If user provides:

## URL

Extract:

- projectId
- screenId

## Bare ID

Ask:

> "Is this a project ID or a screen ID?"

## Nothing Provided

Ask:

> "Paste your Stitch project URL or screen ID and I'll fetch the design."

---

# STEP 2 — Connect To Stitch MCP

Run in order:

## 2a — List Project Screens

```txt
stitch: list screens for project [projectId]
```
````

Purpose:

- Verify MCP connection
- Discover available screens
- Validate IDs

---

## 2b — Extract Design DNA

```txt
stitch: extract_design_context — screen [screenId]
```

Extract:

- Color palette
- Typography system
- Spacing scale
- Layout patterns
- Component inventory
- Border radius usage
- Shadow system
- Interaction states
- Responsive behavior
- Grid structure
- Icon usage
- Motion patterns

---

## 2c — Fetch Raw Screen HTML

```txt
stitch: get_screen_code — screen [screenId]
```

Save as reference only.

NEVER directly copy generated HTML into production.

---

## 2d — Fetch Screen Screenshot

```txt
stitch: get_screen_image — screen [screenId]
```

Use screenshot for:

- Visual QA
- Layout validation
- Responsive behavior checks
- Missing context from design extraction

---

# MCP Failure Handling

If Stitch MCP is unavailable:

```txt
⚠️ Stitch MCP is not connected.

Go to:
Antigravity → ... → MCP → Search "Stitch" → Install

Paste your Stitch API key when prompted.
Then re-run /fetch-design.
```

STOP execution.

---

# STEP 3 — Parse Design DNA

Generate structured design tokens.

---

# COLORS

Extract:

- Primary
- Secondary
- Accent
- Background
- Surface
- Border
- Heading text
- Body text
- Muted text
- Inverse text
- Success
- Warning
- Error
- Info

Generate:

| Token   | Hex     | Tailwind   | CSS Variable    |
| ------- | ------- | ---------- | --------------- |
| Primary | #6366F1 | indigo-500 | --color-primary |

---

# IMPORTANT COLOR RULES

## NEVER use direct hex codes inside JSX

❌ BAD

```tsx
<div className="bg-[#6366F1] text-[#fff]" />
```

✅ GOOD

```tsx
<div className="bg-primary text-primary-foreground" />
```

OR

```tsx
<div className="bg-[var(--color-primary)]" />
```

---

## ALL COLORS MUST BE CENTRALIZED

Generate:

- `tailwind.config.ts`
- CSS variables in `globals.css`
- Semantic Tailwind tokens

---

# TYPOGRAPHY

Extract:

- Heading font
- Body font
- Font sizes
- Font weights
- Letter spacing
- Line heights
- Responsive typography scaling

Map:

| Role | Size | Tailwind  |
| ---- | ---- | --------- |
| H1   | 48px | text-5xl  |
| Body | 16px | text-base |

---

# SPACING SYSTEM

Extract:

- Base spacing unit
- Container widths
- Section spacing
- Grid gaps
- Card padding
- Input padding
- Responsive spacing behavior

Map to Tailwind spacing scale.

---

# SHADOW SYSTEM

Extract:

- Card shadows
- Modal shadows
- Hover shadows
- Elevated surface shadows

Convert into reusable Tailwind extensions.

---

# BORDER RADIUS SYSTEM

Extract:

- Button radius
- Card radius
- Modal radius
- Pill radius

Map to:

- rounded-sm
- rounded-md
- rounded-xl
- rounded-2xl
- rounded-full

---

# COMPONENT INVENTORY

Identify ALL UI components.

Examples:

- Button
- Input
- Textarea
- Select
- Card
- Modal
- Navbar
- Sidebar
- Hero
- Pricing card
- Tabs
- Table
- Badge
- Avatar
- Dropdown
- Toast
- Tooltip
- Accordion
- Carousel
- Charts

For each component extract:

- Variants
- Sizes
- States
- Hover behavior
- Active state
- Disabled state
- Focus behavior
- Responsive behavior

---

# RESPONSIVE BREAKPOINTS

Extract:

- Mobile layouts
- Tablet layouts
- Desktop layouts
- Large screen behavior

Map to:

```txt
sm:
md:
lg:
xl:
2xl:
```

---

# STEP 4 — Map To Next.js + Tailwind

Generate production mappings.

---

# REQUIRED TECH STACK

ALL generated implementations MUST use:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui patterns
- clsx + tailwind-merge (`cn()` utility)
- Lucide React icons
- next/image
- next/link
- next/font

---

# PRODUCTION STRUCTURE

```txt
app/
  (marketing)/
  dashboard/
  api/
  globals.css
  layout.tsx
  page.tsx

components/
  ui/
  layout/
  sections/
  features/
  shared/

lib/
  utils.ts
  constants.ts
  config.ts

hooks/

services/

types/

styles/

public/
```

---

# COMPONENT RULES

## Server Components First

Default:

```tsx
// Server Component
```

Only use:

```tsx
"use client";
```

when needed for:

- state
- hooks
- browser APIs
- animations
- event handlers

---

# STRICT IMPLEMENTATION RULES

## DO NOT hardcode styles repeatedly

Extract reusable classes/components.

---

## DO NOT use arbitrary Tailwind values unless unavoidable

❌ BAD

```tsx
className = "w-[473px]";
```

✅ GOOD

```tsx
className = "max-w-md";
```

---

## DO NOT place business logic inside UI components

Separate:

- UI
- hooks
- services
- API logic

---

## DO NOT create giant components

Split large sections into:

- layout components
- feature components
- atomic components

---

## USE semantic design tokens everywhere

❌ BAD

```tsx
text - gray - 500;
bg - blue - 600;
```

✅ GOOD

```tsx
text - muted - foreground;
bg - primary;
```

---

# ACCESSIBILITY RULES

ALL generated UI must:

- Use semantic HTML
- Be keyboard accessible
- Have visible focus states
- Include aria-labels
- Meet WCAG AA contrast
- Support screen readers

---

# PERFORMANCE RULES

## REQUIRED

- next/image
- next/font/google
- code splitting
- lazy loading for heavy sections
- dynamic imports where n
