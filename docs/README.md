# LIKEFOOD Documentation

Complete documentation for the Vietnamese specialty food e-commerce platform.

## Quick Navigation

### Getting Started
- **[README.md](../README.md)** - Project overview and quick start guide
- **[Project Overview & PDR](./project-overview-pdr.md)** - Business vision, goals, and requirements

### Development
- **[Code Standards](./code-standards.md)** - Coding patterns, TypeScript, security best practices
- **[Codebase Summary](./codebase-summary.md)** - File structure, API endpoints, components

### Architecture
- **[System Architecture](./system-architecture.md)** - Design patterns, data flow, authentication, payments

### Operations
- **[Project Roadmap](./project-roadmap.md)** - Phases, milestones, progress tracking
- **[Deployment Guide](./deployment-guide.md)** - Setup for development, staging, production

### Design
- **[Design Guidelines](./design-guidelines.md)** - UI/UX standards, colors, typography, accessibility

---

## Documentation Overview

| Document | Purpose | Audience | Reading Time |
|----------|---------|----------|--------------|
| **README.md** | Quick start and feature overview | New developers, stakeholders | 10 min |
| **project-overview-pdr.md** | Business context and requirements | Product team, stakeholders | 10 min |
| **code-standards.md** | Development patterns and best practices | Developers | 15 min |
| **codebase-summary.md** | File organization and API reference | Developers | 10 min |
| **system-architecture.md** | System design and data flow | Architects, senior developers | 15 min |
| **project-roadmap.md** | Status, milestones, and future plans | All team members | 20 min |
| **deployment-guide.md** | Setup and deployment instructions | DevOps, deployment team | 20 min |
| **design-guidelines.md** | UI/UX standards and components | Frontend developers, designers | 15 min |

---

## How to Use These Docs

### I want to...

**Get started with development**
1. Read [README.md](../README.md) - Quick Start section
2. Follow [Code Standards](./code-standards.md) - Directory Structure
3. Reference [Codebase Summary](./codebase-summary.md) - Core Pages & Routes

**Understand the system**
1. Read [Project Overview & PDR](./project-overview-pdr.md) - Business context
2. Study [System Architecture](./system-architecture.md) - Design & data flow
3. Check [Codebase Summary](./codebase-summary.md) - API endpoints

**Deploy to production**
1. Follow [Deployment Guide](./deployment-guide.md) - Choose Vercel or VPS
2. Configure environment variables
3. Run deployment checklist

**Build UI components**
1. Review [Design Guidelines](./design-guidelines.md) - Color palette & typography
2. Check [Design Guidelines](./design-guidelines.md) - Component patterns
3. Reference actual components in `frontend/src/components/`

**Add new features**
1. Check [Project Roadmap](./project-roadmap.md) - Is it planned?
2. Follow [Code Standards](./code-standards.md) - Implementation patterns
3. Reference [System Architecture](./system-architecture.md) - Data flow

---

## Key Information at a Glance

### Technology Stack
- **Framework:** Next.js 16
- **Language:** TypeScript
- **Frontend:** React 19, Tailwind CSS v4, Zustand
- **Backend:** Next.js API routes
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase
- **Payments:** Stripe

### Project Status
- **Current Phase:** Stage 2 - MVP Development (In Progress)
- **Feature Completion:** 80%
- **Target Launch:** May 2025

### Key Routes
- `/` - Home page
- `/product/[slug]` - Product detail
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/account` - User authentication
- `/orders` - Order history
- `/admin` - Admin dashboard
- `/live` - Live commerce

---

## Documentation Statistics

- **Total Files:** 8 markdown files
- **Total Lines:** 1,449 lines of documentation
- **All files under 800 LOC:** Yes
- **Coverage:** 100% of critical areas
- **Last Updated:** 2026-03-10

---

## Maintenance

### Regular Updates Required
- After major feature implementation
- After deployment to production
- After architecture changes
- Quarterly review for accuracy

### Document Owners
- **Project Overview:** Product Manager
- **Code Standards:** Lead Developer
- **Codebase Summary:** Tech Lead
- **System Architecture:** Architect
- **Project Roadmap:** Product Manager
- **Deployment Guide:** DevOps/Tech Lead
- **Design Guidelines:** Design Lead

---

## Contributing to Documentation

When updating documentation:
1. Keep files under 800 LOC
2. Use consistent formatting and terminology
3. Update cross-references
4. Verify code examples work
5. Update the "Last Updated" date
6. Commit documentation changes with clear messages

---

## Questions or Feedback?

- Report documentation issues in GitHub
- Suggest improvements in team channels
- Help keep docs accurate and useful
