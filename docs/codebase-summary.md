# Codebase Summary

The LIKEFOOD repository is primarily structured as a **Next.js 15 App Router** project located under the `/frontend` directory. 

## Component & Page Overview

- **`src/app/page.tsx`**: The main Landing Page. Incorporates the Hero section, Live Sessions, Curated Collections, Upcoming Streams, and Newsletter subscriptions. Dynamically fetches categories and products using Server-Side Prisma queries.
- **`src/app/product/[slug]/page.tsx`**: Product Detail page, featuring image galleries, descriptions, dynamic pricing, Add-To-Cart actions via `add-to-cart-button.tsx`, and a custom AI `chatbot.tsx`.
- **`src/app/cart/page.tsx`**: A client-side cart page relying on the Zustand `cartStore`, with logic implemented to compute totals, taxes, and shipping metrics dynamically. 
- **`src/app/checkout/page.tsx`**: Multi-stage checkout process. Validates user details, calculates grand totals, creates an `Order` using Prisma in `/api/checkout`, and creates a Stripe Checkout Session.
- **`src/app/account/page.tsx`**: Supabase authentication handler. Allows for sign up/sign in, standard email/password management, Google OAuth options, and provides a portal to view profile details.
- **`src/app/orders/...`**: Views for a logged in user to check their historical `Order` status, referencing the Prisma Database via `/api/orders`.

## Backend Capabilities

- **`lib/db.ts`**: Global Prisma Client initialization to securely connect to the local/remote PostgreSQL instance.
- **`app/api/webhooks/stripe/route.ts`**: Asynchronous secure webhook processing from Stripe updates the `Order` Status in the DB to `PAID` without requiring user interaction.
- **`app/api/checkout/route.ts`**: The bridge between frontend carts and Stripe backend. Records pending items and sends total cost to Stripe.
- **`app/api/orders/*`**: Endpoints fetching a user's specific order catalog, validating through `getCurrentUser()`.

## Stylistic Elements

- **`uiux likefood/`**: The directory containing pure HTML/Tailwind templates serving as the source of truth for the brand's layout.
- **`src/components/`**: Houses the extracted Next.js components translating those raw HTML layouts into functional React Elements like the `Header`, `Footer`, and `ProductCard`.
- **`globals.css`**: Defines fonts (`Playfair Display`, `Inter` or similar mappings), brand colors (`primary: #8b1e2d`, etc.), custom animations, and UI variants.
