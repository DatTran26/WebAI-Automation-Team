# Design Guidelines (UI/UX)

## 1. Brand Concept

**LIKEFOOD** is positioned as a "Vietnamese Gourmet Live Commerce Platform". 

The overall interface should evoke an experience that is:
- **Warm & Authentic:** Creating an emotional connection with traditional Vietnamese flavors and nostalgic home experiences.
- **Modern & Clean:** Maintaining high trustworthiness for users in the U.S.
- **Conversion-Focused:** Elements must seamlessly lead the user from browsing to buying.
- **Live Commerce-Centric:** The signature experience, integrating media and purchases fluidly.

## 2. Color Palette & Aesthetics

- **Primary Brand Color:** Deep red (`#8b1e2d`). Used for main call-to-action buttons, active navigation states, and brand highlights.
- **Secondary / Accent:** Gold/Amber tones for stars, "favorite" alerts, or premium badges.
- **Backgrounds:** Utilizing subtle paper textures (`bg-paper-texture`) blending light whites/creams (`#fcfafa`) to imply tradition, authenticity, and premium qualities without feeling sterile.
- **Dark Mode:** A careful translation into dark backgrounds (`#201214`) while preserving the warm, premium feel.

## 3. Typography

- **Serif/Display:** Playfair Display (or `Newsreader`). Chosen for its elegance, it is used for primary headings, brand logos, and prices to enforce a premium, artisanal feel.
- **Sans-Serif:** Inter (or `Noto Sans`). Selected for high legibility, it is used for functional text, descriptions, buttons, and navigation elements.

## 4. UI Component Principles

- **Buttons:** Sharp, solid primary buttons with clear uppercase tracking (`tracking-widest`). Avoid overly rounded border-radius on primary actions to maintain a mature, editorial look.
- **Images:** High-quality imagery focusing on the texture and detail of the food. Hover states on `ProductCard` should trigger slight zoom (`scale-105`) and saturation shifts to draw the eye.
- **Live Commerce:** The live stream interface should prioritize the video feed but maintain a clear, non-intrusive overlay for product pinning and chat interaction. Timers for flash sales should be prominent (pulsing or bold animations) to induce FOMO.
- **Spacing:** Generous padding and margins (`py-16`, `gap-12`) provide breathing room, letting the product photography serve as the primary focus. 

## 5. Interactions

- Utilize subtle micro-interactions to make the platform feel responsive. Examples include fade-ins for "Favorite" buttons on hover and translating Add-to-cart overlays upwards softly from the bottom of product cards.
