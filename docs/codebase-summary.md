# Codebase Summary

LIKEFOOD is a **Next.js 16 monorepo** with frontend application and backend database management scripts.

## Directory Structure

```
WebAI/
├── frontend/                 # Next.js 16 application (main)
│   ├── src/
│   │   ├── app/              # App Router pages + API routes
│   │   │   ├── api/          # Backend endpoints
│   │   │   │   ├── health/   # Health check endpoint
│   │   │   │   ├── metrics/  # Prometheus metrics
│   │   │   │   ├── products/
│   │   │   │   ├── webhooks/stripe
│   │   │   │   └── ...other endpoints
│   │   │   ├── (auth)/       # Auth routes (login, signup, verify)
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   │   ├── settings/ # Admin settings
│   │   │   │   ├── users/    # User management
│   │   │   │   └── ...other pages
│   │   │   ├── cart/         # Cart & checkout pages
│   │   │   ├── product/      # Product detail pages
│   │   │   ├── orders/       # Order history pages
│   │   │   ├── account/      # User auth & profile
│   │   │   ├── live/         # Live commerce streaming
│   │   │   ├── messages/     # Chat/messaging
│   │   │   ├── collection/   # Product collection pages
│   │   │   ├── layout.tsx    # Root layout (fonts: Playfair Display, Inter)
│   │   │   ├── page.tsx      # Landing page
│   │   │   └── globals.css   # Tailwind config
│   │   ├── components/       # React components
│   │   │   ├── layout/       # Header, Footer, Sidebars
│   │   │   ├── ui/           # Base UI components (Button, Breadcrumb)
│   │   │   └── [feature]/    # Feature-specific components
│   │   ├── lib/              # Server singletons
│   │   │   ├── db.ts         # Prisma client
│   │   │   ├── stripe.ts     # Stripe initialization
│   │   │   ├── auth-helpers.ts
│   │   │   └── api-helpers.ts
│   │   ├── store/            # Zustand state (client)
│   │   │   └── cartStore.ts
│   │   └── utils/            # Utilities
│   │       └── supabase/     # Supabase SSR helpers
│   ├── prisma/               # Database schema & seed
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── public/               # Static assets
│   ├── Dockerfile            # Multi-stage production build
│   └── .dockerignore         # Docker context exclusions
├── backend/                  # DB management (Prisma scripts)
│   └── prisma/               # Schema reference
├── monitoring/               # Prometheus & Grafana
│   ├── prometheus/
│   │   └── prometheus.yml
│   └── grafana/
│       ├── provisioning/datasources/
│       ├── provisioning/dashboards/
│       └── dashboards/likefood-overview.json
├── docker-compose.yml        # Docker orchestration (app, prometheus, grafana)
├── .github/workflows/ci.yml  # GitHub Actions CI/CD pipeline
└── docs/                     # Documentation
```

## Core Pages & Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Landing page - hero, featured products, livestreams |
| `/product/[slug]` | `app/product/[slug]/page.tsx` | Product detail with images, description, chat |
| `/cart` | `app/cart/page.tsx` | Shopping cart (Zustand state) |
| `/checkout` | `app/checkout/page.tsx` | Multi-stage checkout flow |
| `/account` | `app/account/page.tsx` | Auth (sign in/up) & profile |
| `/orders` | `app/orders/page.tsx` | Order history (requires login) |
| `/orders/[id]` | `app/orders/[id]/page.tsx` | Order detail view |
| `/admin` | `app/admin/page.tsx` | Admin dashboard (requires admin role) |
| `/admin/products` | `app/admin/products/page.tsx` | Product management |
| `/admin/categories` | `app/admin/categories/page.tsx` | Category management |
| `/admin/orders` | `app/admin/orders/page.tsx` | Order management |
| `/admin/live` | `app/admin/live/page.tsx` | Livestream management |
| `/live` | `app/live/page.tsx` | Live commerce viewing |
| `/messages` | `app/messages/page.tsx` | Messages/chat |
| `/collection` | `app/collection/page.tsx` | Product collection browse |
| `/cart/compare` | `app/cart/compare/page.tsx` | Product comparison |

## API Endpoints

### Products & Categories
- `GET /api/products` - List all products (with pagination, search, filters)
- `GET /api/products/[slug]` - Product detail
- `GET /api/categories` - List all categories
- `GET /api/categories/[slug]` - Category products

### Orders & Checkout
- `POST /api/checkout/session` - Create Stripe checkout session
- `GET /api/orders` - User's orders (requires auth)
- `GET /api/orders/[id]` - Order detail

### Admin
- `GET/POST /api/admin/products` - Manage products
- `PUT/DELETE /api/admin/products/[id]` - Product CRUD
- `GET/POST /api/admin/categories` - Manage categories
- `PUT/DELETE /api/admin/categories/[id]` - Category CRUD
- `GET /api/admin/orders` - All orders
- `PUT /api/admin/orders/[id]` - Update order status
- `GET/POST /api/admin/live` - Livestream management
- `PUT/DELETE /api/admin/live/[id]` - Livestream CRUD
- `POST /api/admin/live/[id]/products` - Livestream pinned products
- `GET /api/admin/stats` - Dashboard analytics

### Infrastructure & Monitoring
- `GET /api/health` - Health check (DB connectivity, uptime, latency)
- `GET /api/metrics` - Prometheus metrics (http_requests_total, http_errors_total, app_uptime_seconds)

### Auth & Webhooks
- `GET /api/auth/callback` - Supabase OAuth callback
- `POST /api/webhooks/stripe` - Stripe payment webhook

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `components/layout/Header.tsx` | Navigation & search |
| Footer | `components/layout/Footer.tsx` | Footer content |
| ProductCard | `components/product-card.tsx` | Product display card |
| ProductGrid | `components/product-grid.tsx` | Grid layout for products |
| CartDrawer | `components/layout/cart-drawer.tsx` | Side cart panel |
| ProfileSidebar | `components/layout/ProfileSidebar.tsx` | User profile menu |
| Chatbot | `app/product/[slug]/chatbot.tsx` | AI product assistant |
| AddToCartButton | `app/product/[slug]/add-to-cart-button.tsx` | Cart action |
| CheckoutSummary | `app/checkout/checkout-summary.tsx` | Order summary |
| AdminSidebar | `app/admin/_components/admin-sidebar.tsx` | Admin nav |

## State Management

- **Client:** `store/cartStore.ts` (Zustand) - Shopping cart
- **Client:** `store/cart-drawer-store.ts` (Zustand) - Cart drawer open/close
- **Server:** Prisma queries in Server Components for products, orders, users

## Key Libraries

- **Next.js 16** - Framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Prisma 6.19.2** - ORM
- **Supabase** - Auth & managed PostgreSQL
- **Stripe SDK** - Payments
- **Zustand 5** - Client state
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **class-variance-authority** - Component styling
- **@supabase/ssr** - Server-side auth
