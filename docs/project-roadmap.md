# Project Roadmap

## Current Status: Stage 2 - MVP Development (In Progress)

### Timeline
- **Stage 1 (Planning):** Completed Mar 2024 - Aug 2024
- **Stage 2 (MVP):** Current - Target completion Mar 2025
- **Stage 3 (Production):** Planned Q2 2025+

## Stage 1: Preparation & Planning (COMPLETED)

### Objectives
- Establish business problem and target customer (U.S. Vietnamese community)
- Define product scope (Vietnamese specialties)
- Draft UI/UX directions and HTML prototypes

### Completed
- Business model validation
- Market research and competitor analysis
- UI/UX design system created
- HTML prototype mockups
- Technology stack selection

---

## Stage 2: MVP Development (CURRENT)

### Must-Have Objectives

#### 2.1 Frontend Architecture (80% Complete)
- Next.js 16 App Router migration
- React 19 component library
- Tailwind CSS v4 styling system
- TypeScript strict mode
- Responsive design (mobile-first)

#### 2.2 Database & Data Models (95% Complete)
- Prisma ORM setup
- PostgreSQL schema (User, Product, Category, Order, OrderItem)
- Seed data for testing
- Database migrations

#### 2.3 Authentication (90% Complete)
- Supabase auth integration
- Email/password signup & login
- OAuth (Google) integration
- Protected routes via middleware
- Admin role management
- User profile pages

#### 2.4 E-Commerce Core (90% Complete)
- Product catalog with search/filter
- Product detail pages with images
- Shopping cart (Zustand state management)
- Multi-step checkout flow
- Address collection and validation
- Order creation and tracking

#### 2.5 Payment Processing (95% Complete)
- Stripe SDK integration
- Checkout session creation
- Webhook handling (order status updates)
- Order confirmation page
- Invoice generation (planned)

#### 2.6 Admin Dashboard (85% Complete)
- Admin authentication & role checks
- Dashboard with KPI cards
- Product management (CRUD)
- Category management (CRUD)
- Order management with status updates
- Livestream management (CRUD)
- Basic analytics and reporting

#### 2.7 Live Commerce (60% Complete)
- Livestream page with video player
- Product pinning during streams
- Real-time product updates
- Chat/comment section (basic)
- Inventory tracking for livestream products

#### 2.8 AI Assistant (50% Complete)
- Product chatbot on detail pages
- Basic question answering
- Recommendation logic (planned)

#### 2.9 Testing & Quality Assurance (40% Complete)
- Unit tests for utilities
- Integration tests for API routes
- E2E tests for critical flows
- Manual testing checklists
- Performance profiling

#### 2.10 Documentation (95% Complete)
- Project overview & PDR
- Code standards & guidelines
- System architecture documentation
- Codebase structure summary
- Deployment guide
- Design system documentation
- Development roadmap

### Current Progress Metrics
- Code completion: 85%
- Feature completion: 80%
- Documentation: 95%
- Test coverage: 40% (needs improvement)

### Known Issues & Technical Debt
- Cart persistence (currently client-only)
- Payment webhook retries on failure
- Image optimization and CDN setup
- Email notification system (send order confirmations)
- Product image upload (currently URL-based)
- Livestream video streaming (requires external provider)

---

## Stage 3: Production Scaling (FUTURE - Q2 2025+)

### E-Commerce Enhancements
- Multi-warehouse inventory tracking
- State-based sales tax calculations
- Refund and return workflows
- Promotional code/coupon system
- Bulk order discounts
- Subscription/recurring orders
- Gift cards and store credit

### Live Commerce Enhancements
- Increase WebSocket capacity (10k+ concurrent users)
- Live replay/VOD features
- Moderator tooling and moderation
- Timed product flash sales
- Live auction features
- Multi-stream/concurrent events

### User Retention
- Loyalty program with point accumulation
- Recommendation engine
- Personalized product discovery
- Email marketing automation (abandoned carts, reminders)
- SMS notifications
- Push notifications

### Administration & Analytics
- Advanced analytics dashboard
- User behavior analytics
- Conversion funnel tracking
- A/B testing framework
- Role-Based Access Control (RBAC)
- Team management (warehouse, marketing, finance roles)
- Audit logging
- Automated backup and monitoring

### Platform Expansion
- Mobile app (iOS & Android)
- TikTok Shop integration
- Facebook Shop integration
- Marketplace features (third-party vendors)
- B2B portal for wholesale customers
- API for partners/integrations

---

## Milestones & Key Dates

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| MVP Demo #1 | Feb 2025 | Completed |
| Payment integration | Mar 2025 | On track |
| Live commerce v1 | Apr 2025 | In progress |
| Admin dashboard v1 | Apr 2025 | In progress |
| Production deployment | May 2025 | Planned |
| Post-launch analytics | Jun 2025 | Planned |
| Stage 3 kickoff | Jul 2025 | Planned |

---

## Success Criteria

### Stage 2 MVP Success
- All must-have features implemented and tested
- At least 90% code coverage on critical paths
- Zero P1 bugs at launch
- Performance metrics met (LCP < 2.5s, TTI < 3.5s)
- Mobile usability score > 90
- Documentation 100% complete and accurate

### Post-MVP Goals
- 100+ product listings
- Live commerce with 100+ concurrent viewers
- 1000+ registered users in first month
- Zero payment failures (Stripe handling)
- 99.5% uptime
- < 500ms API response time (p95)

---

## Dependencies & Risks

### External Dependencies
- Stripe API availability
- Supabase service reliability
- Video streaming provider (livestream)
- Image CDN uptime
- DNS/domain registration

### Internal Risks
- Resource constraints (developer capacity)
- Scope creep (adding features during MVP)
- Database performance at scale
- Payment webhook failures
- Security vulnerabilities in dependencies

### Mitigation Strategies
- Regular dependency audits
- Load testing before production
- Comprehensive error handling
- Automated monitoring and alerting
- Security best practices (OWASP Top 10)
- Regular backups and disaster recovery plan
