# Folkara — Slow-Made Craft Marketplace

> A premium marketplace connecting independent artisans with conscious buyers. Built for craftsmanship, story, and intentional commerce.

**Live Site:** [https://folkara.vercel.app](https://folkara.vercel.app)

(Developed by ** Sarthak Rakholiya **)

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Key Routes](#key-routes)
- [Deployment](#deployment)

---

## 🏺 About the Project

Folkara is a full-stack e-commerce marketplace with a "slow-made" philosophy — celebrating handcrafted, artisan-made objects and the stories behind them. It features a complete two-sided marketplace:

- **Buyers** can discover, favorite, add to cart, and purchase authentic handcrafted products, track orders, and download invoices.
- **Artisans (Sellers)** can create multi-step product listings with AI-assisted narrative generation, manage their shop, track orders, and receive Stripe payouts.

An embedded **AI Craft Assistant** helps buyers discover products through natural conversation.

---

## ✨ Features

### 🛍️ Buyer Experience

- Browse and filter products by category, price range, and sort order
- Infinite scroll product feed (`/explore`)
- Product detail pages with dynamic SEO, social preview images, and "Maker Story"
- Favorites / wishlist system
- Cart with multi-item checkout via Stripe
- Order tracking with delivery status stepper
- Printable invoice generation (PDF-ready HTML template)
- Buyer onboarding flow (role selection, craft interests, profile setup)

### 🎨 Artisan / Seller Experience

- Multi-step product listing wizard:
  1. General info & image upload (Cloudinary)
  2. AI-powered narrative & artisan analysis (Gemini 2.5 Flash)
  3. Story refinement editor
  4. Pricing & inventory
- Inventory dashboard with filtering, pagination, and status management
- Order management with status updates, tracking numbers, and artisan notes
- Shop profile management
- Stripe Connect payout integration
- Seller analytics dashboard

### 🤖 AI Features

- **Lore AI Craft Assistant** — conversational sidebar that searches the product catalog, artisan shops, and saved items using semantic tool calls with inline generative UI cards
  - `searchProducts` → inline `RecommendationCard` grid (pgvector semantic search + text fallback)
  - `findSellers` → inline `ShopCard` grid (artisan studio discovery)
  - `getSavedItems` → inline `RecommendationCard` grid (user's bookmarked items)
  - `getCartDetails` → live cart summary with GST + delivery calculations
- **AI Listing Analysis** — auto-generates product descriptions, tags, and artisan narrative from uploaded images and basic info

### 🔐 Auth & Security

- Custom JWT session-based authentication (no third-party auth provider)
- Middleware route protection (`src/middleware.ts`) with role-based redirects
- Separate onboarding flows for buyers and sellers

---

## 🛠️ Tech Stack

| Layer               | Technology                              |
| ------------------- | --------------------------------------- |
| **Framework**       | Next.js 15 (App Router)                 |
| **Language**        | TypeScript                              |
| **Styling**         | Tailwind CSS v4                         |
| **Database**        | Neon PostgreSQL (serverless)            |
| **ORM**             | Drizzle ORM                             |
| **Auth**            | Custom JWT sessions (`jose`)            |
| **Payments**        | Stripe (Checkout + Connect)             |
| **File Storage**    | Cloudinary                              |
| **AI / LLM**        | Google Gemini 2.5 Flash (Vercel AI SDK) |
| **State (Server)**  | TanStack Query (React Query)            |
| **State (URL)**     | nuqs (URL search params)                |
| **Animations**      | Framer Motion + GSAP                    |
| **Forms**           | React Hook Form + Zod                   |
| **Deployment**      | Vercel                                  |
| **Package Manager** | npm                                     |

---

## 📁 Project Structure

```
src/
├── app/                         # Next.js App Router (thin route shells only)
│   ├── (auth)/                  # Login / Signup pages
│   ├── (public)/                # Unauthenticated pages
│   │   ├── page.tsx             # Landing page (/)
│   │   ├── explore/             # Product discovery feed (/explore)
│   │   ├── browse/              # Category browse (/browse)
│   │   ├── products/[id]/       # Product detail page (/products/[id])
│   │   ├── cart/                # Shopping cart (/cart)
│   │   ├── checkout/            # Stripe checkout + success (/checkout)
│   │   ├── favorites/           # Saved favorites (/favorites)
│   │   └── story/               # Our Story page (/story)
│   ├── buyer/                   # Authenticated buyer dashboard
│   │   ├── onboarding/          # Buyer onboarding flow
│   │   └── (dashboard)/         # Protected buyer pages
│   │       ├── overview/        # Buyer home (/buyer/overview)
│   │       ├── orders/          # Order list + detail (/buyer/orders)
│   │       ├── profile/         # Profile settings (/buyer/profile)
│   │       └── settings/        # Account settings (/buyer/settings)
│   ├── seller/                  # Authenticated seller dashboard
│   │   ├── onboarding/          # Seller onboarding flow
│   │   └── (dashboard)/         # Protected seller pages
│   │       ├── overview/        # Seller home (/seller/overview)
│   │       ├── listings/        # Product inventory (/seller/listings)
│   │       ├── listings/create/ # New listing wizard (/seller/listings/create)
│   │       ├── orders/          # Incoming orders (/seller/orders)
│   │       ├── analytics/       # Sales analytics (/seller/analytics)
│   │       ├── payouts/         # Stripe payouts (/seller/payouts)
│   │       ├── profile/         # Shop profile (/seller/profile)
│   │       └── settings/        # Account settings (/seller/settings)
│   ├── api/
│   │   ├── chat/route.ts        # AI assistant streaming chat endpoint
│   │   └── upload/route.ts      # Cloudinary image upload handler
│   ├── sitemap.ts               # Dynamic XML sitemap (for SEO)
│   └── layout.tsx               # Root layout with global providers
│
├── features/                    # Self-contained domain modules
│   ├── auth/                    # Login, signup, session management
│   ├── products/                # Public product browsing, favorites
│   ├── explore/                 # Infinite scroll discovery feed
│   ├── cart/                    # Cart state and mutations
│   ├── checkout/                # Stripe checkout flow and success
│   ├── buyer/
│   │   └── orders/              # Buyer order views, invoice generation
│   ├── seller/
│   │   ├── listings/            # Listing CRUD, AI wizard, inventory
│   │   └── orders/              # Seller order management
│   ├── shop/                    # Shop profile actions
│   ├── onboarding/              # Multi-step onboarding for both roles
│   ├── aiAssistant/             # Lore AI chat sidebar
│   │   ├── components/
│   │   │   ├── AiAssistantSidebar.tsx  # Root orchestrator — imports only, no inline defs
│   │   │   ├── DrawerShell.tsx         # MUI-style always-mounted drawer (CSS translate, no remount)
│   │   │   ├── AiChatInputArea.tsx     # Isolated input form (keystrokes don't re-render parent)
│   │   │   ├── ThinkingIndicator.tsx   # Animated typing/thinking indicator
│   │   │   ├── AiToolOutput.tsx        # Renders product, shop & saved-item cards from tool calls
│   │   │   ├── ChatMessage.tsx         # Individual message bubble (streaming-aware)
│   │   │   ├── RecommendationCard.tsx  # Product card with add-to-cart
│   │   │   ├── ShopCard.tsx            # Artisan shop card
│   │   │   └── SuggestionChips.tsx     # Quick-send suggestion chips
│   │   └── hooks/
│   │       └── useAiSidebar.ts         # nuqs URL state — single source of truth, flicker-free
│   ├── landingPage/             # Landing page section components
│   ├── browse/                  # Browse page components
│   └── story/                   # Our Story page components
│
├── components/                  # Shared UI components
│   ├── ui/                      # Primitives: Button, Input, Badge, etc.
│   ├── form/                    # Reusable form controls (React Hook Form)
│   ├── layout/                  # Navbar, Footer, NavigationProgress
│   ├── feedback/                # Toast, Skeleton, ErrorBoundary
│   ├── shared/                  # Cross-feature shared components
│   └── dashboard/               # Shared dashboard shell components
│
├── assets/
│   └── icons/                   # Reusable SVG icon components
│       ├── GoogleIcon.tsx
│       ├── SpinnerIcon.tsx
│       ├── CheckmarkIcon.tsx
│       └── AnimatedCheckIcon.tsx
│
├── lib/                         # Pure utilities & SDK clients
│   ├── db.ts                    # Drizzle + Neon DB singleton
│   ├── session.ts               # JWT sign/verify/decrypt helpers
│   ├── actionMiddleware.ts      # withAuthAction / withAuthQuery wrappers
│   ├── cloudinary.ts            # Cloudinary upload/delete helpers
│   ├── queryKeys.ts             # Centralized TanStack Query key factory
│   └── utils.ts                 # cn() and general utilities
│
├── db/                          # Drizzle schema and config
│   ├── schema.ts                # Barrel export of all schemas
│   └── schemas/                 # Individual table schemas
│       ├── users.schema.ts
│       ├── shops.schema.ts
│       ├── products.schema.ts
│       ├── favorites.schema.ts
│       ├── cart.schema.ts
│       └── orders.schema.ts
│
├── hooks/                       # Global shared hooks
├── providers/                   # React context providers
├── validations/                 # Zod schema definitions
├── types/                       # Shared TypeScript types
├── constants/                   # App-wide constants and enums
└── middleware.ts                # Route protection + role-based redirects
```

---

## 🗄️ Database Schema

```
users         — id, email, passwordHash, role (BUYER|SELLER), onboardingData, isOnboardingComplete
shops         — id, userId (FK), name, bio, craftTypes, images
products      — id, shopId (FK), title, description, price, quantity, images, tags, category, status, artisanAnalysis
favorites     — id, userId (FK), productId (FK)
cartItems     — id, userId (FK), productId (FK), quantity
orders        — id, userId (FK), stripeSessionId, status, paymentStatus, shippingDetails, grandTotal
orderItems    — id, orderId (FK), productId (FK), shopId (FK), quantity, price
```

---

## 🔐 Environment Variables

Create a `.env.local` file at the root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...

# Auth
SESSION_SECRET=your-32-char-secret-here

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# AI (Google Gemini)
GEMINI_API_KEY=AIza...

# App
NEXT_PUBLIC_APP_URL=https://folkara.vercel.app
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm
- A Neon PostgreSQL database
- Stripe, Cloudinary, and Gemini API keys

### Installation

```bash
# Clone the repo
git clone https://github.com/your-org/folkara.git
cd folkara

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in .env.local with your keys

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx drizzle-kit push # Push schema to database
npx drizzle-kit studio # Open Drizzle Studio (DB GUI)
```

---

## 🗺️ Key Routes

| Route                     | Description                               | Auth Required |
| ------------------------- | ----------------------------------------- | ------------- |
| `/`                       | Landing page                              | No            |
| `/explore`                | Infinite scroll product feed with filters | No            |
| `/browse`                 | Category browser                          | No            |
| `/products/[id]`          | Product detail page                       | No            |
| `/story`                  | Our story / about page                    | No            |
| `/cart`                   | Shopping cart                             | No            |
| `/checkout`               | Stripe checkout                           | Yes (Buyer)   |
| `/favorites`              | Wishlist                                  | Yes (Buyer)   |
| `/buyer/overview`         | Buyer dashboard home                      | Yes (Buyer)   |
| `/buyer/orders`           | Order history                             | Yes (Buyer)   |
| `/buyer/orders/[id]`      | Order detail + invoice                    | Yes (Buyer)   |
| `/buyer/onboarding`       | Buyer onboarding wizard                   | Yes (Buyer)   |
| `/seller/overview`        | Seller dashboard home                     | Yes (Seller)  |
| `/seller/listings`        | Product inventory                         | Yes (Seller)  |
| `/seller/listings/create` | Multi-step listing wizard                 | Yes (Seller)  |
| `/seller/orders`          | Incoming orders management                | Yes (Seller)  |
| `/seller/analytics`       | Sales analytics                           | Yes (Seller)  |
| `/seller/payouts`         | Stripe Connect payouts                    | Yes (Seller)  |
| `/seller/onboarding`      | Seller onboarding wizard                  | Yes (Seller)  |
| `/auth`                   | Login / Signup                            | No            |

---

## 🌐 Deployment

The project is deployed on **Vercel** with automatic deployments on push to `main`.

```bash
# Production build check
npm run build

# Deploy via Vercel CLI
vercel --prod
```

**Required Vercel settings:**

- Add all environment variables from `.env.local`
- Enable [Fluid compute](https://vercel.com/docs/functions/fluid-compute) for long-running AI streaming functions
- Set the root directory to `/` (default)

---

## 🏗️ Architecture Principles

- **Server-first**: Default to React Server Components. Add `"use client"` only when needed.
- **Feature modules**: Each domain (products, checkout, seller, buyer) is self-contained under `features/`.
- **Security layers**: Every server action passes through auth validation before calling business logic.
- **Type safety**: Zod validates all inputs. No `any` in critical data paths.
- **No inline SVGs**: All SVG icons are extracted to `src/assets/icons/` as reusable components.
- **Component isolation**: Sub-components are never defined inside parent component files. Each component lives in its own file for stable identity and clean imports.
- **Single state source**: `useAiSidebar` uses nuqs URL state only — no local mirror, no custom events — eliminating double-render flicker.
- **Always-mounted drawer**: `DrawerShell` uses CSS `translateX` + `visibility` transition delay so content is never unmounted mid-animation, preventing layout flicker.

## 👤 Developer Profile

- **Developer:** Sarthak Rakholiya
- **Email:** [rakholiysarthak9@gmail.com](mailto:rakholiysarthak9@gmail.com)
- **Phone:** [+91 9979930867](tel:+919979930867)

---

_Built with ♥ for the slow-made movement._
