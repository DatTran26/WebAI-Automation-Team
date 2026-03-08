# Deployment Guide

The LIKEFOOD frontend and backend are housed within a Next.js 15 Monolithic repository, relying on external services for database and authentication.

## 1. Infrastructure Requirements

- **Server:** Node.js environment (VPS or Serverless provider like Vercel).
- **Database:** PostgreSQL instance.
- **Authentication Base:** Supabase project.
- **Payment Gateway:** Stripe Account.

## 2. Environment Variables

To deploy, ensure the target environment contains the following keys (`.env`):

```env
# Database
DATABASE_URL="postgres://user:password@host:port/database"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_INSTANCE].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## 3. Building and Running

### Development
1. `npm install`
2. `npx prisma generate`
3. `npx prisma db push`
4. `npm run build`
5. `npm run dev`

### Production (Serverless/Vercel)
Vercel is the easiest, zero-configuration deployment target for Next.js App Routers.
1. Connect the GitHub repository to the Vercel dashboard.
2. Inject the listed Environment Variables above.
3. Deploy. Prisma commands (`prisma generate`) should be automated in Vercel's build step (commonly setup as `postinstall` script in package.json).

### Production (VPS / Docker)
If choosing a VPS to maintain full infrastructure control (as outlined in the MVP goals):
1. Setup a standard Ubuntu instance.
2. Install Docker. Wait for Dockerfile configurations to be finalized in the repo.
3. Containerize the Next.js process utilizing a lightweight `node:alpine` image.
4. Establish an Nginx reverse proxy targeting the exposed Node.js port, configuring SSL/TLS via Certbot.

## 4. Managing Stripe Webhooks

- Crucial for updating Order status. Ensure that Stripe's Webhook configuration points strictly to:
  `https://[YOUR_PRODUCTION_URL]/api/webhooks/stripe`
- Select the `checkout.session.completed` event.
- Take the newly generated Webhook Signing Secret from Stripe and place it in `STRIPE_WEBHOOK_SECRET` on the production server.
