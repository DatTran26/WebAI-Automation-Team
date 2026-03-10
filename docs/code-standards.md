# Code Standards & Guidelines

## 1. General Principles

- **Framework:** Use Next.js 16 App Router exclusively. No legacy Pages router patterns.
- **Language:** TypeScript strictly enforced. Interfaces and type definitions for all data models.
- **Components:** Functional components with Hooks. Keep components dumb/stateless; reserve state for specific needs.
- **Modularization:** If a file exceeds 200 lines, break it into smaller, focused modules.
- **Naming:** Use kebab-case for file names, descriptive names that convey purpose clearly.

## 2. Directory Structure

```
frontend/src/
├── app/                      # App Router
│   ├── api/                  # Route handlers (GET, POST, etc.)
│   ├── admin/                # Admin dashboard pages
│   ├── cart/                 # Cart & checkout
│   ├── checkout/
│   ├── product/[slug]/       # Dynamic product routes
│   ├── orders/               # Order pages
│   ├── account/              # Auth & profile
│   ├── live/                 # Live commerce
│   ├── messages/             # Chat/messaging
│   ├── collection/           # Collections
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── globals.css           # Tailwind config
│   └── middleware.ts         # Auth middleware
├── components/               # Reusable components
│   ├── layout/               # Header, Footer, sidebars
│   ├── ui/                   # Base UI (Button, Input, etc.)
│   └── [feature]/            # Feature-specific components
├── lib/                      # Server-side utilities
│   ├── db.ts                 # Prisma client singleton
│   ├── stripe.ts             # Stripe initialization
│   ├── auth-helpers.ts       # Auth utilities
│   ├── api-helpers.ts        # API response helpers
│   └── utils.ts              # General utilities
├── store/                    # Zustand stores (client only)
│   ├── cartStore.ts
│   └── cart-drawer-store.ts
├── utils/                    # Utility functions
│   └── supabase/             # Supabase SSR client helpers
└── prisma/                   # Database
    ├── schema.prisma         # Data models
    └── seed.ts               # Seed data
```

## 3. TypeScript & Typing

- Use strict mode: "strict": true in tsconfig.json
- Define interfaces for API responses, database models, component props
- Use type for union types, interface for object shapes (prefer interfaces)
- Avoid any except in integration scenarios; use unknown with type guards

## 4. Component Design

### Server vs Client Components
- Default to Server Components (no 'use client')
- Use 'use client' only for interactivity (forms, state, hooks, event listeners)
- Fetch data in Server Components using Prisma directly
- Pass fetched data to Client Components via props

### Component Structure
File naming: use kebab-case (product-card.tsx, not ProductCard.tsx)

## 5. Styling & CSS

- **Tailwind CSS v4:** Use for all styling
- **Classes:** Concatenate with clsx() for conditionals, twMerge() for Tailwind-specific merges
- **Custom Classes:** Define in globals.css with @theme for brand colors
- **Avoid:** Inline style={{}} unless computing dynamic values

## 6. Database & Prisma

- Define all models in frontend/prisma/schema.prisma
- Use db.ts as singleton Prisma client export
- Always validate user authentication before database queries
- Use Prisma select/include to fetch only needed fields

## 7. Error Handling

- API routes: Use try-catch with standardized JSON responses
- Frontend components: Use React state for error messages
- Always log errors to console for debugging
- Provide user-friendly error messages in UI

HTTP status codes:
- 200 - Success
- 400 - Bad request (validation error)
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

## 8. Security

- **Secrets:** Store all keys in .env (never commit to git)
- **Auth Validation:** Use middleware.ts to protect routes
- **Server Components:** Hide secret keys (Stripe, Supabase) in Server Components
- **CORS:** Configure appropriately for API routes
- **Validation:** Validate all user input before processing

## 9. API Response Format

All API endpoints return standardized JSON responses:

Success: { success: true, data: { /* result */ } }
Error: { success: false, message: "Human-readable error message" }

## 10. Git & Commits

- Use conventional commits: feat:, fix:, docs:, refactor:, test:, chore:
- Keep commits focused and atomic
- Never commit .env, API keys, or sensitive data
- Branch naming: feature/feature-name, fix/bug-name

## 11. Code Review Checklist

Before submitting PR:
- Code compiles without errors
- TypeScript types are correct
- No console.log or debugging code left
- Comments explain "why", not "what"
- File size under 200 lines (refactor if needed)
- Tests pass (if applicable)
- Follows style guidelines
- No sensitive data in code
