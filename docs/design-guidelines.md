# Design Guidelines (UI/UX)

## 1. Design Vision

**LIKEFOOD** is positioned as a "Vietnamese Gourmet Live Commerce Platform" that:
- Evokes warmth, authenticity, and cultural connection to traditional Vietnamese foods
- Maintains premium, modern presentation to build trust with U.S. customers
- Prioritizes conversion and user engagement through live shopping experiences
- Provides seamless, intuitive navigation for both browsing and purchasing

## 2. Brand Aesthetics

### Color Palette

**Primary Brand Color:** Deep Red (#8b1e2d)
- Used for main CTA buttons (Add to Cart, Buy Now)
- Active navigation states
- Brand highlights and accents
- Creates emotional warmth and cultural resonance

**Secondary/Accent Colors:**
- **Gold/Amber (#d4af37):** Stars, favorites, premium badges, promotions
- **Cream (#fcfafa):** Background, subtle textures, premium feel
- **Dark Theme (#201214):** Dark mode support while maintaining warmth

**Neutral Colors:**
- **White (#ffffff):** Primary backgrounds
- **Gray (#6b7280, #9ca3af, #d1d5db):** Text, borders, disabled states
- **Black (#000000):** Primary text

### Typography

**Display/Serif Font:** Playfair Display
- Headline sizes (h1, h2, h3)
- Brand logo and wordmark
- Product prices (premium feel)
- Section headers (category names)
- Elegant, editorial aesthetic

**Body/Sans-Serif Font:** Inter or Noto Sans
- Body text and descriptions
- Navigation elements
- Button labels
- Form inputs
- High legibility, functional

## 3. UI Component Principles

### Buttons
- **Primary (CTA):** Solid deep red background, uppercase text, letter-spacing
- **Secondary:** Gray background with dark text
- **Disabled:** Lighter gray, reduced opacity
- **Hover state:** Slight darken, subtle shadow
- **Shape:** Sharp corners (minimal border-radius) for mature, editorial look
- **Size:** Standard 44px+ height for touch targets
- **Padding:** Generous (px-6 py-3 minimum)

### Card Components
- **Product Cards:**
  - High-quality product image (primary focus)
  - Product name (Playfair Display)
  - Price in deep red
  - Category tag or badge
  - Hover state: scale-105, increased shadow, slight saturation boost
  - "Add to Cart" overlay slides up from bottom on hover
  
- **Order Cards:**
  - Order ID, date, total
  - Status badge (color-coded: pending=orange, paid=green, shipped=blue)
  - Action buttons (View Details, Reorder)

### Forms & Inputs
- **Inputs:** Clean, minimal border (gray #e5e7eb)
- **Focus state:** Blue outline or border color change
- **Labels:** Above input, always visible (no placeholders)
- **Error state:** Red border, error message below
- **Success state:** Green checkmark or confirmation message

### Navigation
- **Header:** Fixed or sticky, minimal logo, centered navigation
- **Active state:** Deep red underline or background highlight
- **Mobile:** Hamburger menu, expandable navigation
- **Breadcrumbs:** Text links with > separator

## 4. Spacing & Layout

- **Base unit:** 4px (all spacing uses multiples of 4)
- **Generous padding:** py-16, gap-12, px-8 for breathing room
- **Grid:** 12-column grid, responsive breakpoints (sm, md, lg, xl)
- **Containers:** Max-width 1280px, centered
- **White space:** Emphasize product photography, not clutter

## 5. Micro-interactions & Animations

- **Hover states:**
  - Links: Underline appears or color changes
  - Buttons: Slight shadow, color shift
  - Cards: Scale 105%, shadow increase
  - "Favorite" button: Fade-in heart icon

- **Transitions:**
  - Modal open/close: Fade in/out (200ms)
  - Form submit: Loading spinner, success message (400ms)
  - Cart drawer: Slide in from right (300ms)
  - Product image load: Fade-in skeleton to actual image

- **Animations:**
  - Pulse animation: Flash sale timers, limited stock warnings
  - Shimmer: Image loading skeleton
  - Bounce: New product badges
  - Slide-up: "Add to Cart" confirmation toast

## 6. Responsive Design

### Breakpoints
- **Mobile (sm):** < 640px (iPhone, small tablets)
- **Tablet (md):** 640px - 1024px
- **Desktop (lg):** 1024px - 1280px
- **Large (xl):** > 1280px

### Mobile-First Approach
- Start with mobile layout
- Stack vertical, full-width
- Single column for products
- Bottom navigation or hamburger menu
- Large touch targets (44px minimum)

### Tablet & Desktop
- 2-3 column product grid
- Horizontal navigation
- Sidebars for filters
- Hero images featured prominently

## 7. Images & Media

- **Product Images:**
  - High resolution (1200x1200px minimum)
  - Clean background (white or lifestyle)
  - Multiple angles/views for detail pages
  - Fast loading: WebP format, lazy loading, CDN delivery
  
- **Hero Images:**
  - Full-width, 50-60% height
  - Feature seasonal products or livestream teasers
  - Text overlay with gradient for readability
  
- **Icons:**
  - Lucide React library for consistency
  - 24px or 32px sizes
  - Consistent stroke weight

## 8. Live Commerce UI

- **Video Player:** Prominent, center of screen
- **Pinned Products:** Overlay or sidebar showing current products
- **Timer:** Bold, pulsing animation for flash sales
- **Chat/Comments:** Scrollable list, new messages highlighted
- **Add to Cart:** Large button overlaying video feed
- **Viewer Count:** Top corner, real-time update

## 9. Dark Mode

- Background: Dark charcoal (#201214)
- Text: Off-white (#f9fafb)
- Accent colors: Maintained (gold still visible)
- Cards: Slightly lighter dark (#2a1f24)
- Borders: Very subtle gray (#3f3740)

## 10. Accessibility

- **Color Contrast:** 4.5:1 for text, 3:1 for graphics
- **Text Size:** Minimum 14px body text
- **Focus Indicators:** Visible outlines on keyboard navigation
- **Alt Text:** Descriptive for all images
- **Semantic HTML:** Proper heading hierarchy, form labels
- **Keyboard Navigation:** Tab through all interactive elements
- **ARIA Labels:** For complex interactions (modals, dropdowns)

## 11. Loading & Empty States

- **Loading:** Skeleton screens matching card layout
- **Empty Cart:** Illustration + "Continue Shopping" CTA
- **No Results:** Illustration + "Try different filters" message
- **Error State:** Clear message + "Retry" button

## 12. Toast Notifications

- **Success:** Green background, checkmark icon, "Item added to cart"
- **Error:** Red background, X icon, clear error message
- **Info:** Blue background, info icon, notification details
- **Position:** Bottom-right corner, slide in/out
- **Duration:** 3-5 seconds auto-dismiss

## 13. Consistency Checklist

- [ ] All buttons use brand colors and sizing
- [ ] Typography: Playfair for headings, Inter for body
- [ ] Spacing uses 4px base unit
- [ ] Images optimized and responsive
- [ ] Forms have proper labels and error states
- [ ] Dark mode fully supported
- [ ] Accessible color contrasts
- [ ] Animations smooth and purposeful (not distracting)
- [ ] Mobile responsive across all breakpoints
- [ ] Touch targets >= 44px
