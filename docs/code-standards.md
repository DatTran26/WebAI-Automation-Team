# Code Standards & Guidelines

## 1. General Principles

- **Framework:** Use Next.js App Router guidelines. Avoid legacy Pages router patterns.
- **Language:** TypeScript strictly enforced. Interface or type definitions for all core data models.
- **Component Design:** Prefer functional components with Hooks. Keep components as dumb/stateless as possible, reserving state for specific client-side needs.
- **Modularization:** If a file exceeds 200 lines, carefully consider breaking it down into smaller components, hooks, or utility functions.

## 2. Directory Structure

```
src/
├── app/                  # Next.js App Router (Pages, Layouts, API Routes)
│   ├── api/              # Backend Route Handlers
│   ├── account/          # Account management pages
│   ├── cart/             # Cart page
│   ├── checkout/         # Checkout flow & payment handling
│   ├── orders/           # Order history pages
│   ├── product/          # Product display pages
│   └── globals.css       # Main Tailwind configuration
├── components/           # Reusable UI/UX Elements
│   ├── layout/           # Shared structures (Header, Footer)
│   ├── ui/               # Base UI components (Buttons, Inputs)
│   └── ...               # Feature-specific parts (ProductCard, CategoryList)
├── lib/                  # Backend utilities (Prisma client, Stripe setup, helper functions)
├── store/                # Zustand client state (e.g., cartStore.ts)
└── utils/                # Frontend utilities (Supabase SSR client, formatters)
```

## 3. Styling & CSS

- **Tailwind Framework:** Use Tailwind CSS (v4) for all styling.
- **Custom Classes:** Use `@theme inline` in `globals.css` to define strict brand colors (`--color-primary`, `--color-accent`) and custom font families (`--font-serif`, `--font-sans`).
- **Conditional Classes:** Use `clsx` and `tailwind-merge` (`twMerge`) for complex conditional styling. Do not manually concatenate class names string variables.
- **Avoid:** Minimal use of inline `style={{}}` tags unless computing dynamic layout styles via Javascript.

## 4. Error Handling and Responses

- **Frontend:** Gracefully handle API errors utilizing React state, displaying user-friendly warnings (`toast` or inline errors).
- **Backend (API):** Consistently use standardized JSON responses indicating success or error. Rely on standard HTTP status codes (`200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Server Error`).

## 5. Security & Authentication

- Prefer server-side auth validation utilizing Supabase SSR when accessing sensitive protected routes. 
- Use Server Components to mask sensitive initialization variables (like Stripe Secret keys or backend DB access logic).
- Always rely on environment variables (`.env`) for secrets, ensuring they are excluded from the git repo.
