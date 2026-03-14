# Invokex — AI Agent Distribution Platform

## Overview

Invokex is a production-grade SaaS platform for distributing AI agents and developer tools in 2026. It's the open distribution layer for developer tools and coding agents. Tagline: "One upload. Invoked everywhere."

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite (artifacts/clawkit) — dark fintech aesthetic, electric blue neon accents
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (zod/v4), drizzle-zod
- **API codegen**: Orval (from OpenAPI spec)
- **UI**: shadcn/ui, Tailwind, framer-motion, recharts
- **Auth**: Custom session token auth (HMAC-SHA256, stored in localStorage as `invokex_token`)
- **Payments**: Paystack direct payment links — Growth $99/mo (`https://paystack.shop/pay/eees4kq6g7`), Scale $299/mo (`https://paystack.shop/pay/8g8--6-gkk`)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── clawkit/            # React frontend (preview at /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/
└── pnpm-workspace.yaml
```

## Features

### Public Landing Page (/)
- Custom InvokexLogo SVG component (wave/signal icon + gradient "Invoke"+"x" text with neon glow, unique SVG IDs via useId)
- Sticky nav: logo left, Pricing/Sign In/Get Started right (hamburger on mobile)
- Hero: centered logo, headline "One upload. Invoked everywhere.", blue neon subheadline, email waitlist + "Get Started Free" CTA
- Trust bar: MCP, CLI, REST API, Moltbook & OpenClaw, No lock-in
- How It Works: 4 step cards (Upload, MCP Kit, Simulate, Export)
- Value Proposition: 3 columns — market flood, invisibility problem, Invokex edge
- Features Grid: 2x2 — Safety Auditor, Cross-platform, Analytics, Export Forever
- Bottom CTA: "Ready to be discovered?" + email waitlist
- Fully responsive mobile-first with framer-motion scroll animations

### Dashboard (/dashboard) — Requires auth
- Sidebar: Home, Products, Distribution, Pricing, Settings
- Analytics overview card (invocations, revenue)
- Recent products list

### Products (/dashboard/products)
- Upload form: name, description, API spec file, website URL
- "Generate Invokex" button — generates:
  1. Full 2026 MCP manifest JSON
  2. AGENTS.md for ChatGPT/Claude/Grok
  3. ChatGPT Apps submission text
  4. Claude Marketplace submission
  5. Moltbook/OpenClaw variant
- Safety Auditor: Score XX/100 + issues list
- "Simulate Distribution" — generates 3 realistic agent invocations
- "Export All My Data Forever" button

### Analytics (/dashboard/analytics)
- Charts with Recharts (weekly invocations, platform breakdown)
- Timeline of agent invocations

### Pricing (/pricing) — Public
- Free ($0), Growth ($99/mo), Scale ($299/mo)
- Paystack direct payment links (Growth: `https://paystack.shop/pay/eees4kq6g7`, Scale: `https://paystack.shop/pay/8g8--6-gkk`)
- 14-day free trial note
- Mobile: stacked cards; Desktop: 3-col grid with Growth card scale-105

### Settings (/dashboard/settings)
- Current plan badge + cancel button
- Grok API key (encrypted at rest with AES-256-CBC)
- Email notifications toggle

## Database Tables

- `users` — email/password auth, plan
- `waitlist` — email waitlist
- `products` — uploaded products with generated artifacts
- `subscriptions` — Paystack subscription tracking
- `invocations` — agent invocation logs
- `user_settings` — Grok API key (encrypted), preferences

## API Routes

- `POST /api/waitlist` — join waitlist
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login (returns JWT-style token)
- `GET /api/auth/me` — current user
- `POST /api/auth/logout` — logout
- `GET/POST /api/products` — list/create products
- `POST /api/products/:id/generate` — generate Invokex artifacts
- `POST /api/products/:id/simulate` — simulate distribution
- `GET /api/products/:id/export` — export product data
- `GET /api/analytics/dashboard` — dashboard stats
- `GET /api/analytics/invocations` — invocation timeline
- `GET /api/subscriptions/current` — current subscription
- `POST /api/subscriptions/upgrade` — upgrade (post-Paystack)
- `POST /api/subscriptions/cancel` — cancel subscription
- `GET/PUT /api/settings` — user settings

## Auth

Custom HMAC-SHA256 session tokens. Token stored in localStorage as `invokex_token`, sent as Authorization: Bearer header. Cookie also set for server-side sessions.

## Environment Variables

- `DATABASE_URL` — PostgreSQL connection string (provisioned by Replit)
- `SESSION_SECRET` — Secret for HMAC signing

## Branding

- Product name: **Invokex** (formerly ClawKit)
- Logo: InvokexLogo component at `artifacts/clawkit/src/components/InvokexLogo.tsx`
- Colors: Neon blue gradient (#00C3FF → #00D4FF → #0090CC), white text on dark background
- The artifact directory is still named `clawkit` for compatibility; the brand is Invokex everywhere user-facing
