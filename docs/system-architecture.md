# System Architecture

## 1. High-Level Architecture

LIKEFOOD is built on a modern, monolithic (with potential for microservices) Next.js application, functioning as a full-stack platform combining both the frontend and backend API layers. 

### Core Components
- **Frontend / Client (Browser):** Next.js App Router providing Server-Side Rendering (SSR) and rich interactive client components.
- **Backend / API Layer:** Next.js Route Handlers (`/api/*`) for data fetching, business logic, and integrations.
- **Database:** PostgreSQL (managed externally or locally depending on environment), interfaced via Prisma ORM.
- **Authentication:** Supabase (PostgreSQL-based Auth) providing secure login and session management.
- **Payment Processing:** Stripe Checkout for secure credit card and alternative payment method handling.

## 2. Technology Stack

- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Lucide React (icons), custom animations
- **State Management:** Zustand (e.g., shopping cart)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** Supabase
- **Payments:** Stripe SDK

## 3. Data Flow

1. **User Authentication:** Handled via Supabase logic in the frontend that interacts with the backend. User data is synced to the internal Postgres `User` table upon creation.
2. **Product Browsing:** The frontend queries Next.js API routes (`/api/products`, `/api/categories`), which use Prisma to fetch data from PostgreSQL.
3. **Cart Management:** Stored locally in the browser using Zustand.
4. **Checkout & Payment:** 
   - User submits checkout form.
   - Frontend calls `/api/checkout` to create an Order record in the database with status `PENDING`.
   - The backend initiates a Stripe Checkout Session and returns the session URL.
   - User completes payment on Stripe.
   - Stripe sends a webhook to `/api/webhooks/stripe`. The backend verifies the webhook and updates the Order status to `PAID`.
5. **Live Commerce (Planned):** Expected to utilize WebSockets (or similar real-time tech like Socket.IO) to push live stream video and synchronous event triggers (pinned items, flash deals).

## 4. Key Infrastructural Concepts

- **Cloud/VPS Deployment:** Designed to be easily containerized (Docker) and deployed to a VPS or a managed cloud platform (like Vercel or AWS) for production scale.
- **Webhook Capabilities:** Secure HTTP endpoints exposed to third-party services (e.g., Stripe) to trigger internal state changes asynchronously.
- **AI Integration:** Integration points mapped out in Next.js backend for conversational LLM interactions, currently presented as a React Chatbot component in product details.
