# System Architecture

## 1. High-Level Architecture

LIKEFOOD is a full-stack Next.js 16 application with frontend and backend integrated within a single deployment. External services handle database, authentication, and payments.

## 2. Core Components

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 19 + TypeScript | UI rendering, user interactions |
| **Backend** | Next.js API Routes | Business logic, data processing |
| **ORM** | Prisma 6.19.2 | Type-safe database queries |
| **Database** | PostgreSQL (Supabase) | Persistent data storage |
| **Auth** | Supabase Auth | User authentication & sessions |
| **Payments** | Stripe SDK | Payment processing |
| **State (Client)** | Zustand | Shopping cart management |

## 3. Key Data Models

- **User:** Email, auth_id, profile data
- **Product:** Name, price, description, category, slug
- **Category:** Name, slug, product collection
- **Order:** User, items, status (PENDING, PAID, SHIPPED, DELIVERED)
- **OrderItem:** Order reference, product, quantity, price
- **LiveSession:** Title, video URL, pinned products, status

## 4. Authentication Flow

User login via Supabase:
1. User visits /account
2. Sign in with email/password or OAuth (Google)
3. Supabase returns auth token
4. /api/auth/callback sets HTTP-only session cookie
5. Middleware validates cookie on protected routes (/checkout, /orders, /admin)
6. getCurrentUser() retrieves user from Supabase SSR client

Admin check: app_metadata.role === 'admin' OR email matches ADMIN_EMAIL env var.

## 5. Checkout & Payment Flow

1. User adds items to cart (Zustand store)
2. Navigates to /checkout
3. Fills in address & contact info
4. POST /api/checkout/session
   - Validates auth
   - Creates Order (status: PENDING)
   - Creates Stripe Checkout Session
   - Returns stripe_url
5. Redirects to Stripe checkout
6. User completes payment
7. Stripe webhook POST /api/webhooks/stripe
   - Verifies signature
   - Updates Order status to PAID
8. User sees confirmation page
9. Admin sees order in /admin/orders

## 6. Product Browsing Flow

1. Server Component fetches products from Prisma
2. ProductCard displays with hover animations
3. Click → /product/[slug]
4. Product detail page fetches via Prisma
5. Shows description, price, related products
6. Client-side chatbot for questions
7. "Add to Cart" updates Zustand store
8. Cart drawer opens with toast notification

## 7. Admin Dashboard

Protected by middleware (requires admin role):
- /admin → Dashboard with stats
- /admin/products → CRUD products
- /admin/categories → CRUD categories
- /admin/orders → View & update status
- /admin/live → Create & manage livestreams

All admin actions call API endpoints:
- GET/POST /api/admin/products
- PUT/DELETE /api/admin/products/[id]
- Similar for categories, orders, livestreams

## 8. Live Commerce (Planned)

1. Admin creates livestream via /admin/live
2. LiveSession record created
3. /live page displays video feed + chat + pinned products
4. Admin pins products during stream
5. Viewers click pinned products → add to cart
6. Same checkout flow as normal shopping

## 9. Technology Choices

| Decision | Rationale |
|----------|-----------|
| Next.js 16 | Full-stack React, SSR optimized, API routes built-in |
| TypeScript | Type safety, IDE support, fewer runtime errors |
| Prisma | Type-safe ORM, excellent DX, auto-generated client |
| Supabase | All-in-one: PostgreSQL + Auth + managed service |
| Stripe | Industry standard, secure, webhook support |
| Zustand | Lightweight client state, minimal boilerplate |
| Tailwind CSS | Utility-first, rapid UI development |
| Vercel | Native Next.js hosting, zero-config |

## 10. Security Measures

- Middleware validates auth on protected routes
- Server Components hide secrets (Stripe, Supabase keys)
- Webhook signature verification for Stripe
- Input validation on all API endpoints
- HTTP-only cookies for session tokens
- Environment variables for sensitive data
- Prisma transactions for atomic operations

## 11. Error Handling

**Frontend:** Try-catch, error state, toast notifications
**Backend:** Try-catch in API routes, standardized error responses
**Database:** Prisma error handling, transactions
**Webhooks:** Signature verification, idempotency checks

## 12. Deployment

**Development:** Local Postgres/Supabase, npm run dev
**Production:** Vercel or Docker/VPS
- Database: Supabase PostgreSQL
- Auth: Supabase Auth
- Payments: Stripe
- Logging: Vercel Analytics or Sentry

## 13. Monitoring

- Server logs (Vercel/Sentry)
- Database metrics (Prisma)
- Payment status (Stripe Dashboard)
- User analytics (Google Analytics)
- Error tracking
