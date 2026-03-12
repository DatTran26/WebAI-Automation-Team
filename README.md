# LIKEFOOD - Vietnamese Specialty E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 16, featuring live commerce, Stripe payments, and AI product assistance for Vietnamese specialty foods in the U.S. market.

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Supabase account for authentication
- Stripe account for payments

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure your database
cd backend
npm run db:push

# Start development server
cd ../frontend
npm run dev
```

Visit http://localhost:3000

## Key Features

- **Product Catalog:** Browse Vietnamese specialty categories with search and filtering
- **User Authentication:** Secure login via Supabase with email/password or OAuth
- **Shopping Cart:** Client-side cart powered by Zustand
- **Checkout & Payments:** Stripe integration with webhook-based order status updates
- **Live Commerce:** Real-time video streaming with product pinning and chat
- **Admin Dashboard:** Product and order management for administrators
- **AI Assistant:** Product chatbot for customer guidance
- **Order History:** Customers can view past orders and status

## Project Structure

```
├── frontend/              # Next.js 16 application
│   ├── src/
│   │   ├── app/          # App Router pages + API routes
│   │   ├── components/   # React components
│   │   ├── lib/          # Server utilities (db, stripe, auth)
│   │   ├── store/        # Zustand state management
│   │   └── utils/        # Helper functions
│   └── prisma/           # Database schema
├── backend/              # Prisma ORM & DB scripts
│   └── prisma/           # Shared schema reference
├── docs/                 # Documentation
└── plans/                # Implementation plans and reports
```

## Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
```

### Database
```bash
cd backend
npm run db:push      # Push schema changes
npm run db:migrate   # Create and apply migration
npm run db:generate  # Regenerate Prisma client
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio UI
npm run db:reset     # Reset database (destructive)
```

## Documentation

Comprehensive documentation available in `/docs`:

- **[Project Overview & PDR](./docs/project-overview-pdr.md)** - Vision, goals, and requirements
- **[Code Standards](./docs/code-standards.md)** - Naming conventions and patterns
- **[Codebase Summary](./docs/codebase-summary.md)** - File structure and modules
- **[System Architecture](./docs/system-architecture.md)** - Design and data flow
- **[Project Roadmap](./docs/project-roadmap.md)** - Phases and milestones
- **[Deployment Guide](./docs/deployment-guide.md)** - Production setup and configuration
- **[Design Guidelines](./docs/design-guidelines.md)** - UI/UX standards

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 16, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React icons |
| **State** | Zustand (client), Prisma (server) |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | Supabase (SSR cookies) |
| **Payments** | Stripe SDK |
| **ORM** | Prisma 6.19.2 |

## Authentication

User authentication handled via Supabase with session management through HTTP-only cookies. Protected routes:
- `/checkout`, `/orders` - Requires login
- `/admin` - Requires admin role (`app_metadata.role === 'admin'` or `ADMIN_EMAIL`)

## Payment Flow

1. User adds items to cart and proceeds to checkout
2. `/api/checkout` creates `Order` with status `PENDING`
3. Stripe Checkout Session is initiated
4. User completes payment on Stripe
5. Stripe webhook at `/api/webhooks/stripe` updates Order to `PAID`

## Environment Variables

Required keys (see `.env.example` files):

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Admin
ADMIN_EMAIL=
```

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker / VPS
See [Deployment Guide](./docs/deployment-guide.md) for detailed VPS setup instructions.

## Contributing

1. Create a feature branch
2. Follow code standards in `/docs/code-standards.md`
3. Ensure tests pass
4. Submit PR with clear description

## Project Status

Currently in **Stage 2: MVP Development**
- Core e-commerce functionality complete
- Live commerce features in progress
- AI assistant integration ongoing

See [Project Roadmap](./docs/project-roadmap.md) for detailed progress tracking.

## License

Licensed under the [Apache License 2.0](./LICENSE).

## Support

For issues or questions, refer to documentation in `/docs` or create an issue in the repository.
