# Award-Winning Ecommerce Redesign: Seasonal Fruit Farm

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:writing-plans (recommended) or superpowers:executing-plans to implement this plan. Tasks use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current basic ecommerce site into a professional, award-worthy website for Mango Tango Farm (woman-owned, organic mango farm in SW Florida) with modern design, storytelling, and customer engagement features.

**Scope:** 
- **Phase 1 (Immediate):** Visual redesign, modern design system, homepage with storytelling, About page, Contact page (2-3 weeks)
- **Phase 2 (Follow-up):** Customer features (Wishlists, Subscriptions, Reviews, Gift Cards) — separate plan

**Architecture:** Product-first homepage with story beats woven in, deep storytelling on About page, personal connection via "Meet the Farmer" section. All pages use cohesive tropical + vibrant design system. iPhone farm photos elevated with warm overlays and professional framing.

---

## Design System

### Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Primary Warm | Golden Yellow | #F4A020 | CTAs, highlights, tropical energy |
| Primary Warm | Sunset Orange | #FF6B35 | Accents, hover states, warmth |
| Secondary | Forest Green | #2D5016 | Organic/farming elements, text accents |
| Accent | Coral Pink | #FF6B9D | Playful touches, "In Season" badges |
| Neutral Light | Cream | #FFFEF7 | Page backgrounds, cards |
| Neutral Light | Off-White | #F9F7F4 | Section backgrounds |
| Text Dark | Charcoal | #2C2C2C | Body text, headings |
| Text Light | Medium Gray | #666666 | Secondary text |

**Accessibility:** All text meets WCAG AA contrast ratios. Interactive elements have clear focus states (2px golden border + shadow).

### Typography

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| H1 (Page Title) | Poppins | 48px | 700 Bold | Hero headlines, page titles |
| H2 (Section) | Poppins | 36px | 700 Bold | Section headings |
| H3 (Card Title) | Poppins | 24px | 600 SemiBold | Card titles, subsections |
| Body | Inter | 16px | 400 Regular | Body text, descriptions |
| Small Text | Inter | 14px | 400 Regular | Captions, metadata |
| Accent/Quote | Georgia | 18px | 400 Italic | Story quotes, heritage moments |

**Line height:** 1.6 (body), 1.3 (headings) for readability and breathing room.

### Design Elements

**Spacing:** 8px baseline grid. Margins: 16px (mobile), 24px (tablet), 32px+ (desktop).

**Border Radius:** 8-12px on cards and buttons. Fully rounded (50%) on avatar photos, call-to-action badges.

**Shadows:** Subtle (0 2px 4px rgba(0,0,0,0.1)), medium (0 4px 12px rgba(0,0,0,0.15)) for depth without heaviness.

**Animations:** Smooth transitions (200-300ms ease-out). Hover effects on cards (slight lift + shadow enhance). Fade-in for sections on scroll (optional, performance-friendly).

**Photography Treatment:** 
- iPhone farm photos receive warm overlay (golden gradient 10-20% opacity, blend-mode: multiply)
- Vignette edges (subtle darkening on corners)
- Rounded corners (12px) on all images
- Cards have subtle frame effect (1-2px border, cream or light gray)

**Icons:** 
- Hand-drawn style (Feather or custom SVG) for organic feel
- Warm colors (golden, orange, green)
- Used as section markers: 🌱 Organic, 🚜 Woman-Owned, ⛰️ Resilient, 🛒 Shop, 📖 Story

---

## Page Structure

### Homepage (Product-First with Story Woven In)

#### Section 1: Hero
- **Background:** High-quality iPhone farm photo (mangoes on tree or harvesting scene) with warm overlay
- **Content:** Centered overlay on image
  - **Headline:** "Fresh Mangoes from Pine Island, SW Florida" (H1, white text, bold)
  - **Subheading:** "Picked at peak ripeness. Organic. Small-batch." (18px, white, semi-transparent background)
  - **CTA Button:** "Shop Now" (golden yellow background, dark text, rounded, shadow on hover)
- **Height:** 60vh (mobile), 70vh (desktop)
- **Feel:** Clean, immediate, authentic, tropical energy

#### Section 2: Featured Products Grid
- **Layout:** 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- **Cards:** Product variety cards showing:
  - Mango photo (rounded, warm overlay)
  - Variety name (H3)
  - Price per pound
  - "In Season" or "Coming Soon" badge (coral pink if in season)
  - Brief description (1 line)
  - "View Details" link
- **Spacing:** 24px gap between cards
- **Quantity:** 6 mangoes (or as many as currently available)

#### Section 3: "Meet the Farmer" (Story Beat)
- **Layout:** Two-column split (image left, text right; stacked on mobile)
- **Image:** Professional iPhone photo of you at the farm (or farm portrait)
- **Text:**
  - **Headline:** "From Philadelphia to Pine Island"
  - **Subheading:** "How a passion for mangoes led to organic farming in SW Florida"
  - **Body:** 3-4 sentence bio touching on:
    - Tech background → farm transition
    - Hurricane Ian resilience
    - Commitment to organic farming
  - **CTA:** "Read the full story →" (links to About page)
- **Background:** Cream or off-white
- **Feel:** Warm, personal, authentic

#### Section 4: "Why Choose Our Mangoes?" (Value Props)
- **Layout:** 3-column grid (desktop), stacked (mobile)
- **Cards:** 3 value proposition cards with icons + text:
  1. **🌱 Organic Philosophy**
     - "Grown without formal certification, but with the same rigorous standards we'd use for our own family."
  2. **🚜 Woman-Owned & Operated**
     - "Supporting a woman entrepreneur committed to sustainable farming and community."
  3. **⛰️ Built to Resilience**
     - "Recovering from Hurricane Ian. Every mango you buy supports our multi-year restoration."
- **Feel:** Values-driven, builds trust and emotional connection

#### Section 5: "This Season's Star" (Seasonal Highlight)
- **Layout:** Two-column (image left, content right; stacked on mobile)
- **Image:** High-quality photo of featured mango variety
- **Content:**
  - **Variety Name** (H2)
  - **Story:** 2-3 sentences about this mango (flavor notes, when it's available, why it's special)
  - **Availability:** "Available June - August" (prominent, golden background)
  - **CTA:** "Order Now" (button)
- **Background:** Light gradient (cream to off-white)
- **Feel:** Seasonal urgency, freshness, scarcity

#### Section 6: Testimonials / Social Proof
- **Layout:** 3-column carousel (desktop), stacked (mobile)
- **Cards:** Customer testimonials (3-4 quotes)
  - Quote text (Georgia serif, italic)
  - Customer name + "Verified Buyer"
  - 5-star rating badge
- **Background:** Cream
- **Feel:** Trust-building, authentic voices

#### Section 7: Newsletter Signup
- **Layout:** Centered card or banner
- **Content:**
  - **Headline:** "Get Harvest Updates & Seasonal Alerts"
  - **Subheading:** "Know when your favorite mangoes are in season"
  - **Input:** Email field + "Subscribe" button (golden yellow)
- **Background:** Subtle gradient (golden yellow 5% opacity over cream)
- **Feel:** Engaged community, seasonal anticipation

#### Section 8: Footer (All Pages)
- **Navigation:** Home | About | Contact | Shop | FAQ
- **Info:** Address, email, phone (optional), hours
- **Social:** Links to Instagram, Facebook (farm social accounts)
- **Legal:** Privacy Policy | Terms of Service | Contact
- **Copyright:** © 2026 Mango Tango Farm. All rights reserved.
- **Background:** Dark charcoal (#2C2C2C) with cream text

---

### About Page

Full-page storytelling. Sections:

#### Hero
- **Background:** Farm photo (you in the field, or landscape)
- **Headline:** "The Story of Mango Tango Farm"
- **Subheading:** "From tech career to organic farming—a journey of passion and resilience"

#### Section 1: "Your Journey"
- **Headline:** "From Philadelphia to Pine Island"
- **Content:** Your full bio (as provided):
  - Philadelphia → Temple University (Computer Science) → University of Pennsylvania
  - 20+ years in Dallas (tech career)
  - 2022: Moved to Pine Island, took over farm (formerly Mango Tango nursery)
  - Include personal motivations, what drew you to mangoes, why the move
- **Tone:** Personal, honest, reflective
- **Image:** Optional: timeline or farm photo

#### Section 2: "Hurricane Ian & Recovery"
- **Headline:** "Building Back Stronger"
- **Content:** 
  - Summer 2022: Hurricane Ian devastation
  - Impact: Majority of fruit trees damaged
  - Current status: Multi-year restoration underway
  - Philosophy: Committed to the mission despite challenges
  - Community impact: Each purchase supports recovery
- **Tone:** Honest about hardship, proud about resilience
- **Image:** Restoration photo (if available)

#### Section 3: "Organic Farming Philosophy"
- **Headline:** "Growing the Way We'd Feed Our Own Family"
- **Content:**
  - Why organic: Health, environment, quality
  - No formal certification (cost-prohibitive for small farm)
  - But same rigorous standards as if growing for family
  - Commitment to sustainable practices
  - What organic means for our customers
- **Tone:** Educational, authentic, values-driven
- **Visual:** Maybe icon breakdown (no pesticides, no synthetic fertilizers, etc.)

#### Section 4: "Woman-Owned & Operated"
- **Headline:** "Leading the Way as a Woman Farmer"
- **Content:**
  - What it means to run a farm as a woman
  - Challenges and triumphs
  - Commitment to community
  - Supporting other women in agriculture (if applicable)
- **Tone:** Proud, community-focused
- **Image:** Portrait photo of you

#### Section 5: "What's Next?"
- **Headline:** "Growing the Future"
- **Content:**
  - Vision for the farm (restored orchards, expanded varieties, etc.)
  - Multi-year restoration timeline
  - Expansion goals (if any)
  - Community involvement
- **Tone:** Hopeful, forward-looking
- **Visual:** Maybe a roadmap or growth timeline

---

### Contact Page

#### Form + Info Layout (Two-column, stacked on mobile)

**Left Column: Contact Form**
- Fields: Name, Email, Message, Type (dropdown: Question / Wholesale / Partnership / Feedback)
- Submit button (golden yellow)
- Validation & confirmation message
- Tone: Simple, friendly

**Right Column: Contact Info**
- **Farm Location**
  - Mango Tango Farm, Pine Island, FL
  - Embedded Google Map (if desired)
- **Contact Methods**
  - Email
  - Phone (if you want direct contact)
- **Hours**
  - Seasonal availability note
  - Best times to visit/call
- **Social Media**
  - Links to Instagram, Facebook
- **Quick Info**
  - "Wholesale inquiries welcome"
  - "Farm visits by appointment"

---

## Information Architecture

```
Home (/)
├── Hero + Shop
├── Featured Products
├── Meet the Farmer (+ link to About)
├── Why Our Mangoes
├── Seasonal Highlight
├── Testimonials
├── Newsletter
└── Footer

About (/about)
├── Hero
├── Your Journey
├── Hurricane & Recovery
├── Organic Philosophy
├── Woman-Owned
├── What's Next
└── Footer (+ CTA to Contact)

Contact (/contact)
├── Contact Form
├── Farm Info
├── Map
├── Social Links
└── Footer

Shop (/shop)
└── [Existing product grid + filters]

FAQ (/faq)
└── Common questions about mangoes, shipping, ordering

Admin (/admin)
└── [Existing fruit management]
```

---

## Component Requirements

### New Components to Build

1. **HeroSection** — Reusable hero with background image, overlay text, CTA
2. **ProductCard** — Mango variety card with photo, name, price, badge, link
3. **StoryBeat** — Two-column story section (image + text, responsive)
4. **ValueProposition** — Icon + headline + description card
5. **SeasonalHighlight** — Featured mango card with story + availability + CTA
6. **TestimonialCard** — Quote + name + rating
7. **ContactForm** — Form with validation, submit
8. **NewsletterSignup** — Email capture component
9. **Footer** — Global footer with nav, info, social, legal

### Enhanced Components

1. **Navigation** — Add About + Contact links to header
2. **Homepage** — Restructure to incorporate all new sections
3. **MangoCard** — Update styling to match new design system colors/borders

---

## Design System Implementation

### Color Tokens (CSS/Tailwind)
```
primary-yellow: #F4A020
primary-orange: #FF6B35
secondary-green: #2D5016
accent-pink: #FF6B9D
neutral-cream: #FFFEF7
neutral-off-white: #F9F7F4
text-dark: #2C2C2C
text-medium: #666666
```

### Tailwind Configuration
- Custom colors added to `tailwind.config.ts`
- Custom spacing (8px baseline)
- Border radius utilities (rounded-lg = 12px)
- Shadow utilities (shadow-sm, shadow-md)
- Typography scale (h1, h2, h3, body, small)

### Photography Standards
- All images: rounded corners (12px)
- Farm photos: warm overlay (golden gradient, 10-20% opacity)
- Cards: subtle border (1px, cream or light gray)
- Vignette optional on hero images

---

## Content Requirements

### Homepage
- Hero headline + subheading (you provide or we craft)
- 6 product descriptions (can pull from existing lib/mangoes.ts)
- "Meet the Farmer" bio (4-5 sentences from your story)
- 3 testimonials (placeholder or real customer quotes)
- Newsletter CTA

### About Page
- Full farm story (provided above + elaboration from you)
- Hurricane story (details, recovery updates)
- Organic philosophy (your words/practices)
- Woman-owned perspective (your experience)
- Future vision (your plans)

### Contact Page
- Email address (publicly visible or form-only)
- Phone (optional)
- Farm address + map embed
- Social media handles
- Hours/availability

### Existing Content to Preserve
- Product descriptions + prices (from lib/mangoes.ts)
- Admin functionality (separate section, unchanged)

---

## Phase 1 Deliverables

✅ Modern design system (colors, typography, components)
✅ Redesigned homepage (hero → products → stories → social proof → newsletter)
✅ About page (full farm story)
✅ Contact page (form + info)
✅ Enhanced navigation (header with new pages)
✅ Footer (global, all pages)
✅ Responsive design (mobile-first, works on all devices)
✅ CSS/Tailwind styling (consistent, professional)
✅ Image treatments (warm overlays, rounded corners, professional framing)

---

## Phase 2 Preview (Future)

**Customer Features** (separate implementation plan):
1. **Wishlists** — Save favorite mangoes, get notifications when in season
2. **Subscriptions** — Seasonal delivery boxes (curated mangoes each month)
3. **Reviews & Ratings** — Customers rate/review mango varieties
4. **Gift Cards** — Digital/physical gift options
5. **Enhanced Search** — Filter by ripeness, price, availability
6. **Recommendations** — "Customers also bought..." suggestions

---

## Success Metrics

- **Visual:** Looks modern, professional, premium (not basic/high-school)
- **Storytelling:** Visitors understand your farm's unique story and values
- **Engagement:** CTA clicks (Shop, Contact, Newsletter) increase
- **Mobile:** Responsive, smooth on phones (farm customers browsing on-the-go)
- **Performance:** Fast load times, smooth interactions
- **Trust:** Design builds confidence in product quality and farm authenticity

---

## Technical Notes

- **Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4 (existing)
- **Images:** Optimize iPhone photos (compression, formats)
- **Forms:** Contact + Newsletter (server actions, validation, email notification)
- **SEO:** Meta tags, Open Graph, structured data for products
- **Hosting:** Deploy to Vercel (existing)

