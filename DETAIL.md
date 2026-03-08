# LIKEFOOD – Vietnamese Specialty Live Commerce Platform for the U.S. Market

## 1. Project Overview

**Project Name:** LIKEFOOD  
**Domain:** E-commerce, food retail, digital platform  
**Model:** Omnichannel (combining existing offline operations with online sales)  
**Target Market:** United States, focusing on the Vietnamese community  
**Deployment Direction:** The website is the central sales channel; Facebook and TikTok are mainly used for promotion, traffic acquisition, and communication support

LIKEFOOD is a platform for selling Vietnamese specialty foods to Vietnamese customers in the U.S., centered around a modern online shopping experience combined with **live commerce**, **automated payment**, **order management**, and **AI-powered product assistance**.

The project is intended not only for competition presentation purposes, but also as a foundation that can continue evolving into a real operating business system after the competition.

---

## 2. Background and Problem Statement

The Vietnamese community in the U.S. has strong demand for traditional specialty foods such as:

- Traditional cakes and pastries
- Fermented fish sauces and fish paste products
- Dried foods (dried fish, dried shrimp, dried squid, etc.)
- Candies
- Nuts and snack products
- Tea, jam, and gift specialty products

However, the current market still faces several issues:

- It is difficult to access products that truly preserve authentic Vietnamese flavors
- There is a lack of highly trusted brands with clear information and professional presentation
- Sales activities still rely heavily on offline channels or social media
- There is not yet a professional digital platform focused on both shopping experience and online conversion
- The model of **livestream selling directly on the website** has not been fully leveraged

LIKEFOOD is built to solve this problem by creating a specialized, modern, scalable digital platform tailored to the shopping behavior of the Vietnamese community in the U.S.

---

## 3. Project Goals

### 3.1 Short-Term Goals
- Build a complete MVP for competition participation
- Demonstrate a real **live commerce** model
- Implement **automated payment through Stripe**
- Prove the ability to deploy the product on cloud/VPS infrastructure
- Integrate AI at a basic level to increase product value

### 3.2 Mid-Term Goals
- Standardize the online sales model for the business
- Connect existing offline sales activities with the online system
- Expand customer reach through the website, Facebook, and TikTok

### 3.3 Long-Term Goals
- Develop LIKEFOOD into a recognized Vietnamese specialty platform in the U.S.
- Expand AI, marketing automation, and recommendation features
- Upgrade the system into a production-ready platform for real business operations

---

## 4. Product Scope

LIKEFOOD focuses on Vietnamese specialty product groups such as:

- **Cakes and pastries:** traditional cakes, dry cakes, giftable bakery products
- **Fish sauces and fish paste products:** regional fermented specialties
- **Dried foods:** dried fish, dried shrimp, dried squid, etc.
- **Candies:** traditional candies and regional sweets
- **Nuts:** nutritious nuts, roasted nuts, dried snack products
- **Related products:** tea, jam, and specialty gift items

---

## 5. Target Customers

### 5.1 Primary Audience
- Vietnamese people living, studying, and working in the U.S.
- Age range: approximately **25–55**

### 5.2 Behavior and Needs
- They want to buy Vietnamese specialty products for personal use or gifting
- They prefer online shopping with domestic U.S. delivery
- They value trustworthy brands with clear product origin
- They are attracted by livestream sales, limited-time offers, and fast checkout
- They need guidance on which products fit their intended use

---

## 6. Core Value of the System

LIKEFOOD must deliver four main values:

### 6.1 Trust
- Clear product origin
- Professional presentation
- Secure payment
- Clear brand communication

### 6.2 Convenience
- Fast online shopping on the website
- Automated payment
- Mobile-first experience
- Ability to purchase directly during livestream sessions

### 6.3 Cultural Emotion
- Evoke the warmth and familiarity of Vietnamese flavors
- Create an experience that is not only about shopping, but also about reconnecting with home

### 6.4 Conversion
- Pinned products during livestreams
- Flash deals and countdown timers
- Smooth cart and checkout flow
- Clear and effective call-to-action design

---

## 7. Business Model

### 7.1 Type
- **B2C (Business to Customer)**

### 7.2 Sales Channels
- **E-commerce website:** the central sales channel
- **Facebook:** brand promotion, traffic generation, and content support
- **TikTok:** short-form promotional content and traffic redirection to the website/live sessions

### 7.3 Key Direction
- Livestreams are hosted **directly on the website**
- Facebook and TikTok serve mainly as **marketing and traffic acquisition channels**
- Payment is prioritized through the website
- Stripe is selected as the primary payment gateway for the MVP

---

## 8. System Functional Scope

## 8.1 Customer-Facing Features

### 8.1.1 Landing Page / Homepage
- Introduce the LIKEFOOD brand
- Showcase featured products
- Display flash deals
- Show upcoming livestream schedules
- Tell the brand story to increase trust

### 8.1.2 Product Catalog
- Browse product listings
- Filter by product group
- Sort by selected criteria
- View products currently on deal or featured in live sessions

### 8.1.3 Product Detail Page
- Product images
- Product name, price, and deal price if available
- Product description
- Usage instructions
- Ingredients
- Add-to-cart CTA
- AI chatbot support for product inquiries

### 8.1.4 Cart
- Add products
- Remove products
- Update quantity
- Display total amount
- Support basic shipping fee calculation for the MVP

### 8.1.5 Checkout
- Enter shipping information
- View order summary
- Pay automatically via Stripe
- Automatically update order payment status after successful payment

### 8.1.6 Order Confirmation Page
- Display order code
- Display payment status
- Show purchased items summary

---

## 8.2 Live Commerce Features

### 8.2.1 Live Page
- Stream video directly on the website
- Show live video
- Show real-time chat
- Show pinned product
- Show flash deal
- Show countdown timer
- Allow direct add-to-cart from the live session

### 8.2.2 Pinned Product
- Admin selects the currently promoted product
- The system broadcasts it in real time to viewers
- The UI updates without page refresh

### 8.2.3 Flash Deal
- Admin sets a promotional price for a limited time
- The system displays a countdown
- When the timer ends, the deal returns to its normal state

### 8.2.4 Real-Time Chat
- Users can send messages during livestream sessions
- Moderator role can be added later
- Chat logs can be stored for analysis

---

## 8.3 Admin Features

### 8.3.1 Dashboard
- Order statistics
- Live viewer count
- Basic revenue tracking
- Best-selling product tracking

### 8.3.2 Product Management
- CRUD products
- Manage pricing
- Manage active/inactive status
- Manage product descriptions

### 8.3.3 Order Management
- View order list
- Filter by status
- Track payment state
- Track processing state

### 8.3.4 Livestream Control
- Create live sessions
- Start / End livestream
- Pin products
- Set deals
- Monitor live activity

### 8.3.5 AI Logs Management
- View user questions
- See which products are asked about most
- Improve product content based on user demand

### 8.3.6 Audit Log
- Record important actions such as:
  - who started a live session
  - who pinned a product
  - who set a deal
  - payment webhook updates

---

## 9. AI Features

### 9.1 AI Product Assistant
The MVP includes a chatbot that helps users:

- Ask about a product
- Ask how to use it
- Ask whether it is suitable as a gift
- Ask about the difference between similar products

### 9.2 Logging and Analysis
- Record questions and answers
- Identify products with high customer interest
- Provide a foundation for future AI features

### 9.3 Future AI Expansion
- Recommendation engine
- Demand forecasting
- Marketing personalization
- AI-generated content

---

## 10. Technical Architecture Direction

### 10.1 Suggested Stack
- **Frontend:** Next.js
- **Commerce backend:** Medusa
- **Database:** PostgreSQL
- **Realtime:** WebSocket / Socket.IO
- **Payment:** Stripe
- **Caching / queue (if needed):** Redis
- **Deployment:** VPS with cloud-ready architecture

### 10.2 Infrastructure
- The MVP can initially be deployed on a VPS
- Later it can be upgraded to a more standard cloud environment
- Streaming should ideally use a managed solution to reduce risk during demos and real live sessions

---

## 11. Stage 2 MVP Definition

Stage 2 must produce a **fully working system**, not just a UI prototype.

### 11.1 MVP Must Be Able To
- Display products
- Stream live sessions on the website
- Pin products during livestreams
- Add items to cart directly during the live session
- Process automated payments via Stripe
- Automatically update order status to PAID
- Provide AI product assistance
- Include a basic admin control panel
- Be deployable to a VPS

### 11.2 MVP Is Not Only for the Competition
The MVP must be designed so that:
- It can continue to evolve
- It does not need to be rebuilt from scratch
- It provides a foundation for production

---

## 12. Stage 3 Expansion Direction

After the competition phase, the system can expand with:

- U.S. state-based sales tax handling
- Multi-warehouse management
- Refund / Return flow
- Live replay
- Recommendation system
- Loyalty program
- Marketing automation
- More detailed role-based access control
- Advanced analytics
- Monitoring and backup automation

---

## 13. UI/UX Direction

LIKEFOOD should not feel like a generic online store.  
It should be positioned as:

> A Vietnamese Gourmet Live Commerce Platform  
> Culturally expressive, modern, clean, and highly trustworthy for users in the U.S.

### 13.1 Interface Spirit
- Warm
- Vietnamese in identity
- Modern and clean
- Conversion-focused
- Live commerce as the signature experience

### 13.2 Experience Highlights
- Hero section that communicates food, brand, and story
- Product detail pages with emotional storytelling
- A dynamic, conversion-focused live page
- A highly trustworthy, low-friction checkout flow

---

## 14. Competition and Business Goals

The project serves two goals at the same time:

### 14.1 Competition Goal
- Demonstrate technical depth
- Deliver real live commerce capability
- Integrate AI
- Present clear architecture
- Provide OSS, deployment, and complete documentation

### 14.2 Business Goal
- Build a real sales platform
- Continue deploying after the competition
- Scale according to real business needs

---

## 15. Conclusion

LIKEFOOD is a specialized live commerce platform for Vietnamese specialty foods in the U.S., combining:

- e-commerce
- livestream selling
- automated payment
- AI assistance
- the ability to evolve into a real business platform

The project does not only solve the online sales problem, but also creates an emotionally engaging shopping experience rooted in Vietnamese identity and tailored to the consumption behavior of the Vietnamese community in the U.S.