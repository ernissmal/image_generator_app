# Project Brief: AI Product Photography

## Executive Summary

**AI Product Photography** - Upload a product image. Click a button. Get 6 professional photos in 10-15 minutes. No photography skills needed.

**The Problem:** Product photos are expensive and slow. You need them fast.

**The Solution:** One-click AI that makes your products look professional in different rooms and lighting. Works for everyone.

**Who:** Anyone selling products online. Store owners. Non-photographers.

## Problem Statement

**Current State:** You're a store owner with 100+ products. Each one needs multiple photos—different angles, settings, lighting. You have three bad options:

1. **Hire a photographer:** $500-2000 per product. Takes weeks to schedule. Can't scale.
2. **DIY with existing AI tools (Midjourney, DALL-E):** Takes 2-4 hours per product. You need to learn "prompt engineering." Results are inconsistent—your product turns into something else half the time.
3. **Use basic product mockup tools:** They look fake. Same boring templates everyone uses.

**The Seasonal Nightmare:** Black Friday is 8 weeks away. You have 200 new products. Holiday campaigns need different themes—cozy Christmas settings, minimalist New Year looks. Spring collection launches in January.

At 2 hours per product for DIY, that's 400 hours of work. At $1000 per product for photographers, that's $200,000. Miss the deadline? Your competitors eat your sales.

**The Impact:** You're stuck. Either you spend all your money on photos, all your time learning AI tools, or your store looks amateur. Meanwhile, competitors with bigger budgets have beautiful, seasonal catalogs ready to go.

**Why Nothing Works:** Current AI tools are built for artists and designers. They assume you know photography terms, want creative control, and have time to experiment. You don't. You just want your product to look good and sell. NOW.

**Why Now:** Google's AI (Gemini Nano) finally produces realistic, consistent product photos. But it's just raw technology—no one's built the simple tool that store owners actually need. Until now.

## Proposed Solution

**The Simple Way:** Upload your product image. Select what you need (angles, environments, lighting). Click "Generate." Wait 10-15 minutes. Download 6 professional photos. Done.

**What Makes It Different:**

- **Built for sellers, not artists:** No confusing settings. No photography jargon. Just "empty room," "with furniture," "with props."
- **Batch-smart:** Upload once, get 6 variations automatically. Not one at a time like other tools.
- **Product integrity:** Your red shoes stay red. Your logo stays in place. No weird mutations.
- **Predictable results:** Same quality every time. No gambling with prompts.

**How It Works (Behind the Scenes):**
1. You upload your product photo
2. Our system uses Google's most advanced AI (Gemini Nano) with pre-tuned settings for e-commerce
3. It generates your 6 images: 3 empty rooms (different angles/lighting), 2 styled environments, 1 with contextual props
4. Everything gets checked for quality before you see it
5. You download all 6 at once, ready for your store

**Why This Succeeds:** We're not trying to be Photoshop or Midjourney. We do one thing perfectly: turn one product photo into six that sell. No learning curve. No creative decisions. Just results that work.

## Target Users

### Primary User Segment: The Busy Store Owner

**Who They Are:**
- Running Shopify stores with 100-5000 products
- Doing $10K-$500K in annual revenue
- Usually solo or small team (1-3 people)
- Selling physical products: fashion, home goods, accessories, electronics

**Their Reality:**
- Juggling everything: inventory, customer service, marketing, shipping
- Know their products well but aren't "creative types"
- Make decisions fast—no committees, no approval chains
- Care about ROI, not artistic perfection

**What They Do Now:**
- Take photos with their phone in their garage
- Pay freelance photographers occasionally for hero products
- Use free Canva templates that look generic
- Skip product variants because it's too expensive

**What They Need:**
- Photos today, not next week
- Consistency across their catalog
- Different angles/settings without learning photography
- To spend time selling, not editing

### Secondary User Segment: The Scaling Dropshipper

**Who They Are:**
- Testing 10-50 new products per month
- Need photos before inventory arrives
- Working with supplier images (usually terrible)
- Speed is everything—first to market wins

**Their Specific Pain:**
- Can't photograph products they don't physically have
- Supplier photos are unusable (watermarks, bad lighting, wrong context)
- Need localized feel (US room styles for US customers)
- Testing products means they can't invest $500 in photos that might not sell

## Goals & Success Metrics

### Business Objectives
- **Launch MVP in 8 weeks** with core image generation working reliably
- **Acquire 10 paying pilot users in first month** to validate product-market fit
- **Achieve 80% task completion rate** (upload → successful 6-image download)
- **Reach $5K MRR within 90 days** of launch (roughly 50-100 active users)
- **Maintain sub-$0.50 cost per image set** to ensure sustainable unit economics

### User Success Metrics
- **Time to first image set: <20 minutes** (including account setup)
- **Generation success rate: >90%** (no failed/unusable outputs)
- **User can process 20+ products per day** without fatigue
- **Zero photography knowledge required** (measured by support tickets)
- **Image quality satisfaction: >4/5 stars** from user feedback

### Key Performance Indicators (KPIs)
- **Daily Active Users (DAU):** Target 20+ by month 2
- **Images Generated Per User Per Week:** Target 50+ (8-10 products)
- **Customer Acquisition Cost (CAC):** Keep below $50 per user
- **Lifetime Value (LTV):** Achieve 6+ month retention ($300+ LTV)
- **Generation Time:** Maintain 10-15 minute average per product
- **API Reliability:** 99% uptime (Google API + our wrapper)

## MVP Scope

### Core Features (Must Have)

- **Single Image Upload:** User uploads one product photo, system handles the rest
- **3-Stage Mastery Workflow:**

  **Stage 1: Angle Mastery**
  - Generate 3 angle options (front, 3/4 view, side)
  - Plus/minus buttons adjust rotation degree
  - User picks best angles for their product
  - Lock in 3 angle choices

  **Stage 2: Environment & Prop Mastery**
  - Generate 3 environment options (minimal, styled, rich)
  - Plus/minus buttons for prop density (empty → decorated)
  - Plus/minus buttons for environment complexity
  - User picks 2 environments + 1 with props

  **Stage 3: Polish Variables**
  - Apply to all 6 selected images
  - Lightning: Darker ← → Brighter
  - Shadows: Soft ← → Hard
  - Theme: Cool ← → Warm
  - Style presets: Modern, Classic, Minimal (starting points)

- **Pre-defined Templates:**
  - Quick-start templates for common products (fashion, home goods, electronics)
  - All adjustable with plus/minus buttons
  - No complex menus or dropdowns

- **Final Output:** 6 curated images (3 angles in empty rooms, 2 in environments, 1 with props)
- **Download Bundle:** ZIP file with all 6 images, properly named
- **Simple Authentication:** Email/password signup, basic account dashboard
- **Usage Tracking:** Show remaining credits/images for the month
- **Payment Integration:** Stripe checkout for monthly subscription ($49/month for 100 products)

### Out of Scope for MVP

- Shopify app/integration (standalone web only)
- Going back to edit previous selections (linear flow only)
- Saving "presets" or favorite settings
- Bulk upload (multiple products at once)
- Team accounts or collaboration features
- API access for developers
- Mobile app
- Advanced scheduling or automation
- A/B testing features
- Analytics dashboard
- Custom branding/white label
- Multiple output formats beyond JPG
- History beyond 30 days
- Comparing all options side-by-side (only 3 at a time)

### MVP Success Criteria

The MVP is successful when a user can:
1. Sign up in <2 minutes
2. Upload their first product image
3. Adjust 4 sliders to preference (10 seconds)
4. Pick best option from each set of 3 (6 decisions total)
5. Complete entire flow in 15-20 minutes
6. Download 6 images they actually chose (not random outputs)
7. Feel in control without photography knowledge

"More/Less" not "F-stops and ISO." Simple choices, professional results.

## Post-MVP Vision

### Phase 2 Features (Months 3-6)

**Shopify Direct Integration:**
- One-click install from Shopify App Store
- Auto-sync product catalog
- Replace images directly in listings
- Bulk operations on collections

**Workflow Automation:**
- Save slider presets ("My Brand Style")
- Batch processing (queue 50 products overnight)
- Auto-generate when new products added
- Scheduled seasonal reshoots

**Smart Enhancements:**
- Background removal from user uploads
- Auto-detect product type and suggest best settings
- Quality scoring (AI rates output before showing)
- Variant generation for color/size options

### Long-term Vision (Year 1-2)

**Platform Expansion:**
- WooCommerce, BigCommerce, Square plugins
- Amazon/Etsy marketplace integration
- Direct social media publishing (Instagram Shopping)
- WordPress media library integration

**Advanced Capabilities:**
- Video generation (360° spins, lifestyle clips)
- Model integration (products on/with people)
- Custom brand training (learns your style)
- AR/3D preview for shoppers

**Business Evolution:**
- Agency tier (manage multiple stores)
- White-label offering for platforms
- API marketplace for developers
- Training data from user choices improves quality

### Expansion Opportunities

**Adjacent Markets:**
- Real estate (staging empty rooms)
- Restaurant menus (food photography)
- Fashion (on-model generation)
- B2B catalogs (industrial products)

**Service Layers:**
- Done-for-you managed service
- Expert review and touch-up add-on
- Custom training on brand guidelines
- Localization (region-specific room styles)

The vision: Every online seller has professional photography. Not because they hired photographers, but because AI finally works the way sellers actually need it to.

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Web browser (Chrome, Safari, Firefox, Edge)
- **Browser Support:** Modern browsers only (last 2 versions)
- **Performance Requirements:**
  - Page load <3 seconds
  - Image generation 10-15 minutes per product
  - Handle 100 concurrent users

### Technology Preferences
- **Frontend:** React or Next.js (for speed and ecosystem)
- **Backend:** Node.js with Express or Python with FastAPI
- **Database:** PostgreSQL for users/billing, Redis for queues
- **Hosting/Infrastructure:** Vercel/Netlify frontend, Google Cloud Run for API

### Architecture Considerations
- **Repository Structure:** Monorepo (frontend + backend together initially)
- **Service Architecture:** Simple client-server to start, microservices later
- **Integration Requirements:**
  - Google Gemini Nano API (core generation)
  - Stripe (payments)
  - SendGrid (emails)
- **Security/Compliance:** SSL, encrypted storage, GDPR-ready

## Constraints & Assumptions

### Constraints
- **Budget:** $5-10K for MVP development and first 3 months operations
- **Timeline:** 8 weeks to launch MVP
- **Resources:** Solo developer or small team (1-2 people)
- **Technical:** Limited by Google API rate limits and costs

### Key Assumptions
- Google Gemini Nano API remains available and pricing stable
- Users willing to wait 10-15 minutes for quality results
- $49/month price point acceptable for target market
- Product images (not people) are the primary use case
- Users have decent product photos to start with

## Risks & Open Questions

### Key Risks
- **Google API changes:** Pricing increase or feature removal could kill margins
- **Generation quality:** Gemini Nano might not maintain consistency at scale
- **Competition:** Larger players (Canva, Adobe) could build similar features
- **User patience:** 10-15 minute wait might be too long for some users

### Open Questions
- How much will Google API actually cost at scale?
- Can we maintain <15 minute generation time with 100+ concurrent users?
- Will users need education on how to take good source photos?
- Should we offer a free trial or freemium tier?

### Areas Needing Further Research
- Google Gemini Nano API documentation and limitations
- Competitive pricing analysis
- User testing on the 3-stage workflow
- Performance optimization techniques

## Next Steps

### Immediate Actions
1. Set up Google Cloud account and test Gemini Nano API
2. Create basic proof-of-concept with the 3-stage workflow
3. Test generation times and quality with 10 sample products
4. Design mockups of the user interface
5. Set up development environment and repository
6. Begin building authentication and payment infrastructure

### PM Handoff

This Project Brief provides the full context for the AI Product Photography platform. The core innovation is the 3-stage mastery workflow that gives users control without complexity. Please work with the user to create the PRD section by section, focusing on translating this vision into detailed product requirements.

**Key Focus Areas:**
- The 3-stage workflow is the heart of the MVP
- Simplicity over features
- 10-15 minute generation time is acceptable
- Users pick from options, not create from scratch