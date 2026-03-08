# Project Roadmap

## 1. Stage 1: Preparation & Planning (Completed)
- Establish business problem and target customer (U.S. Vietnamese community).
- Define product scope (Vietnamese specialties) and UI/UX directions.
- Draft UI blueprints and HTML prototypes.

## 2. Stage 2: Minimum Viable Product (MVP) - Current Phase
The objective of this stage is to build a fully working platform capable of demonstrating real live commerce capabilities, aiming for competition presentation and foundational business operations.

### Must-Have Objectives
- **Frontend Migration:** Transition all static HTML designs into responsive Next.js components.
- **Product & Data Modeling:** Implement Prisma + PostgreSQL schema for categories, products, users, and orders.
- **Authentication:** Operational user accounts via Supabase.
- **Checkout Flow:** Implement Cart via Zustand and real payment processing via Stripe Checkout.
- **Live Streaming Prototype:** A working Live page demonstrating embedded video alongside pinning products.
- **AI Assistant:** Implement a chatbot capable of handling product queries (implemented on the frontend with basic mock or LLM endpoints).

## 3. Stage 3: Expansion & Production Scaling (Future)
Following a successful MVP demonstration, the platform will pivot from a prototype to a full-fledged enterprise system capable of scaling to high traffic over holiday periods.

### E-Commerce Logistics
- Multi-warehouse inventory tracking and management.
- Integration of U.S. state-based sales tax calculations (e.g., via Stripe Tax or Avalara).
- Automated Refund and Return flows.

### Live Commerce Enhancements
- Expand WebSocket capacity for tens of thousands of concurrent users chatting.
- "Live Replay" features, allowing users to watch past VODs while still interacting with timed product deals.
- Better moderator tooling.

### User Retention
- Introduce a comprehensive Loyalty Program with point accumulation.
- Build a Recommendation System analyzing purchasing behavior and AI Bot queries.
- Marketing automation (abandoned cart emails, SMS reminders on scheduled livestreams).

### Administration
- Advanced analytics dashboard observing user drop-off flows.
- Deep Role-Based Access Control (RBAC) permitting marketing, warehouse, and finance personnel targeted views.
- Automated backup architectures and continuous monitoring.
