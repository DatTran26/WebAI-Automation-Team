# Deployment Guide

## Overview

LIKEFOOD is deployed as a Next.js 16 full-stack application with external services for database, authentication, and payments. This guide covers setup for development, staging, and production environments.

## Architecture Overview

```
Domain (vercel.app or custom)
    └─ Vercel/VPS (Node.js runtime)
       ├─ Next.js Application
       ├─ API Routes (business logic)
       └─ Server Components (data fetching)
           └─ PostgreSQL (Supabase)
               └─ User, Product, Order data
```

## Development Environment

### Prerequisites
- Node.js 20+ and npm 9+
- PostgreSQL 14+ (local or Supabase)
- Git
- Docker & Docker Compose (optional, for local containerization)

### Initial Setup

```bash
# Clone repository
git clone <repo-url>
cd WebAI/frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables (Development)

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/likefood_dev
DIRECT_URL=postgresql://user:password@localhost:5432/likefood_dev

# Supabase (get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

# Stripe (get from https://stripe.com/dashboard)
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx

# Admin
ADMIN_EMAIL=admin@likefood.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Open Prisma Studio (GUI for database)
npm run db:studio
```

### Running Development Server

```bash
# Start Next.js dev server
npm run dev

# Access at http://localhost:3000
```

## Staging/Testing Environment

### On Supabase

1. Create a new Supabase project for staging
2. Copy connection string to .env.staging
3. Configure Stripe test keys
4. Deploy via Vercel staging branch

```bash
# Create staging branch
git checkout -b staging

# Push to trigger Vercel deployment
git push origin staging
```

## Production Environment

### Option 1: Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure main branch is clean
git checkout main
git pull origin main

# Verify build
npm run build
```

#### Step 2: Connect to Vercel
1. Visit vercel.com and sign in
2. Click "Add New" → "Project"
3. Import the WebAI repository
4. Select "Next.js" framework
5. Configure build settings (auto-detected)

#### Step 3: Environment Variables
In Vercel dashboard → Settings → Environment Variables:

```
DATABASE_URL = (Supabase production string)
DIRECT_URL = (Supabase production direct URL)
NEXT_PUBLIC_SUPABASE_URL = (Supabase project URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (Supabase anon key)
STRIPE_SECRET_KEY = sk_live_xxxxx (PRODUCTION KEY)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_live_xxxxx
ADMIN_EMAIL = your-admin@email.com
NEXT_PUBLIC_APP_URL = https://yourdomain.com
```

#### Step 4: Deploy
```bash
# Trigger deployment via git
git push origin main

# Or manually deploy via Vercel dashboard
# Vercel will automatically:
# - Build the Next.js app
# - Run npm run build
# - Deploy to CDN edge network
# - Set up SSL/TLS
```

#### Step 5: Configure Domain
In Vercel dashboard → Settings → Domains:
- Add your custom domain (e.g., likefood.com)
- Point DNS records to Vercel

### Option 2: VPS/Docker

#### Prerequisites
- Ubuntu 20.04+ VPS (Linode, DigitalOcean, AWS)
- Docker & Docker Compose
- Nginx or Caddy (reverse proxy)
- SSL certificate (Certbot + Let's Encrypt)

#### Dockerfile (Create if not exists)

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY frontend/ ./

# Generate Prisma client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "run", "start"]
```

#### Docker Compose Setup

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - DIRECT_URL=${DIRECT_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - app
    restart: unless-stopped
```

#### Deployment Steps

```bash
# 1. Build and push Docker image
docker build -t likefood:latest -f Dockerfile .
docker push your-registry/likefood:latest

# 2. On VPS, pull and run
docker pull your-registry/likefood:latest
docker-compose up -d

# 3. Set up SSL with Certbot
sudo certbot certonly --standalone -d yourdomain.com

# 4. Configure Nginx for HTTPS
# Update nginx.conf with SSL certificates
```

## CI/CD Pipeline (GitHub Actions)

### Automated Workflow (`ci.yml`)
Triggered on push to any branch:
1. **Lint Check** - ESLint validation
2. **Type Check** - TypeScript compilation
3. **Build Test** - Next.js production build
4. **Docker Build** - Build production image (master branch only)

### GitHub Actions Setup
```bash
# Workflow location: .github/workflows/ci.yml
# Automatically runs on push
# Sends notifications on failure
```

---

## Docker Deployment

### Build Image
```bash
# From WebAI root
docker build -t likefood:latest -f frontend/Dockerfile .
```

### Multi-Stage Dockerfile Features
- Stage 1 (deps): Install production dependencies
- Stage 2 (builder): Generate Prisma client + build app
- Stage 3 (runner): Alpine Linux, non-root user, minimal image (~150MB)
- Healthcheck: GET /api/health (30s interval)

### Local Docker Compose (Development)
```bash
# From WebAI root
docker-compose up -d

# Services:
# - app: Port 3000 (Next.js application)
# - prometheus: Port 9090 (metrics scraper)
# - grafana: Port 4000 (monitoring dashboard)
```

### Environment Variables in Docker
Passed via `.env` file (see Development Environment section):
```env
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
ADMIN_EMAIL=...
```

### Monitoring with Prometheus & Grafana
- **Prometheus** scrapes `/api/metrics` (10s interval) and `/api/health` (30s)
- **Grafana** dashboard auto-provisioned with 4 panels:
  - App Uptime (uptime_seconds)
  - HTTP Requests Rate (requests/min)
  - HTTP Errors Rate (errors/min)
  - Error Rate Percentage (%)
- Access Grafana: http://localhost:4000

### Health Check Endpoint
```bash
# Test endpoint
curl http://localhost:3000/api/health

# Response:
# { "status": "ok", "uptime": 3600, "dbLatency": 12 }
```

---

## Stripe Webhook Configuration

### For Vercel/Production:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Testing Locally:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe account
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Get signing secret from output
# Add to .env.local as STRIPE_WEBHOOK_SECRET
```

## Database Backups

### Supabase Backups
- Automatic daily backups (retention: 30 days)
- Manual backups via dashboard
- Point-in-time recovery available

### Manual Backup

```bash
# Export database dump
pg_dump $DATABASE_URL > backup.sql

# Restore from dump
psql $DATABASE_URL < backup.sql
```

## Monitoring & Logging

### Docker Deployment
```bash
# View application logs
docker logs likefood-app

# Monitor system resources
docker stats likefood-app

# Check Prometheus metrics collection
curl http://localhost:9090/api/v1/targets

# Access Grafana dashboards
# http://localhost:4000 (default: admin/admin)
```

### Vercel Production
- Real-time logs: vercel.com → Project → Settings → Logs
- Performance metrics in Vercel Analytics + Speed Insights
- Error tracking via Sentry (optional)
- Health endpoint: `https://yourdomain.com/api/health`

## Post-Deployment Checklist

- [ ] Database backup configured
- [ ] SSL certificate valid
- [ ] Admin user created in database
- [ ] Stripe webhooks configured and tested
- [ ] Email notifications working
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring and alerting set up
- [ ] DNS propagated
- [ ] Performance tested (PageSpeed Insights)
- [ ] Security audit passed (OWASP)

## Scaling Considerations

### When to Scale
- Response time > 1s (p95)
- Error rate > 0.1%
- CPU usage > 80% consistently
- Database connection pool exhaustion

### Scaling Strategies
- **Caching:** Use Redis for session/cart data
- **Database:** Read replicas, connection pooling
- **CDN:** CloudFlare for static assets
- **Load balancing:** Multiple app instances behind load balancer
- **Microservices:** Extract API routes to separate services
