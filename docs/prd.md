# AI Product Photography Platform Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Enable store owners to generate 6 professional product photos from a single image in 10-15 minutes
- Eliminate dependency on expensive photographers ($500-2000 per product) and complex AI tools (2-4 hours per product)
- Provide simple, one-click interface requiring zero photography knowledge
- Achieve product-market fit with 10 paying users in first month, scaling to $5K MRR in 90 days
- Deliver consistent, high-quality results with >90% generation success rate
- Support processing of 20+ products per day for busy store owners

### Background Context

E-commerce store owners struggle with product photography. Professional photographers are expensive and slow, while existing AI tools like Midjourney and DALL-E require technical expertise and produce inconsistent results. Google's Gemini Nano API produces excellent, realistic product images but lacks user-friendly tooling. This PRD defines an MVP that bridges this gap with a dead-simple interface built specifically for non-technical store owners who need professional product photos fast.

The solution uses a revolutionary 3-stage mastery workflow that gives users control without complexity. Instead of overwhelming users with photography jargon, we provide simple plus/minus controls and let them pick from AI-generated options. This approach delivers professional results without requiring any photography knowledge.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-01-23 | 1.0 | Initial PRD creation from Project Brief | PM (John) |

## Requirements

### Functional

- FR1: System must accept single product image upload in JPG/PNG format up to 10MB
- FR2: System must generate exactly 6 images per product using 3-stage mastery workflow
- FR3: Stage 1 (Angle Mastery) must generate 3 angle options with plus/minus rotation controls
- FR4: Stage 2 (Environment & Props) must generate 3 environment options with density controls
- FR5: Stage 3 (Polish) must apply lighting, shadows, and theme adjustments to all 6 images
- FR6: Each stage must allow regeneration of options if user is unsatisfied
- FR7: System must provide pre-defined templates for common product types
- FR8: User must be able to pick 1 option from each set of 3 generated variants
- FR9: System must deliver all 6 final images as downloadable ZIP file
- FR10: Authentication system must support email/password signup and login
- FR11: System must track usage against monthly limits (100 products per $49 subscription)
- FR12: Payment system must process monthly subscriptions via Stripe
- FR13: Generation process must complete within 10-15 minutes per product
- FR14: System must queue and process multiple user requests concurrently
- FR15: Interface must use plus/minus buttons exclusively (no dropdowns or complex inputs)

### Non Functional

- NFR1: Page load time must be under 3 seconds on 3G connection
- NFR2: System must handle 100 concurrent users without degradation
- NFR3: API uptime must maintain 99% availability
- NFR4: Generation success rate must exceed 90% (no failed outputs)
- NFR5: System must be accessible on modern browsers (Chrome, Safari, Firefox, Edge - last 2 versions)
- NFR6: User data must be encrypted at rest and in transit
- NFR7: System must be GDPR-compliant for future European expansion
- NFR8: Interface must work on screens 768px width and larger
- NFR9: Google API costs must stay below $0.50 per 6-image set
- NFR10: System must auto-save user progress through the 3-stage workflow

## User Interface Design Goals

### Overall UX Vision

Dead simple. No learning curve. Upload, adjust sliders, pick favorites, download. The interface should feel more like a simple mobile app than professional software. Every decision should be binary (more/less, darker/lighter) rather than requiring domain knowledge.

### Key Interaction Paradigms

- **Progressive Disclosure**: Show one stage at a time, lock in choices before moving forward
- **Visual Feedback**: Every plus/minus adjustment shows immediate visual preview
- **Pick Don't Create**: Users choose from AI options, never start from blank
- **Binary Choices**: All controls are more/less sliders, no number inputs
- **Mobile-First Simplicity**: Even though web-based, interactions feel touch-friendly

### Core Screens and Views

- **Landing Page**: Hero image, simple value prop, "Start Free" CTA
- **Sign Up/Login**: Email and password only, social login in Phase 2
- **Dashboard**: Shows remaining credits, recent generations, "New Product" button
- **Upload Screen**: Drag-drop zone, file selector, auto-proceed when uploaded
- **Stage 1 - Angle Selection**: 3 angle options displayed, plus/minus controls, "Pick This One" buttons
- **Stage 2 - Environment Selection**: 3 environment options, density sliders, selection buttons
- **Stage 3 - Polish Controls**: All 6 images shown small, global adjustment sliders
- **Processing Screen**: Progress bar, estimated time remaining, cancel option
- **Download Screen**: Preview all 6 final images, download ZIP button
- **Account Settings**: Subscription status, billing, usage history

### Accessibility: WCAG AA

Basic accessibility including keyboard navigation, screen reader support, and sufficient color contrast. Given target audience of busy store owners, prioritize mobile-friendly touch targets.

### Branding

Clean, modern, trustworthy. Think "Stripe meets Canva" - professional enough for business but approachable for non-designers. Minimal color palette, lots of white space, focus on product images.

### Target Device and Platforms: Web Responsive

Primary target is desktop browsers (where store owners work) but must be fully functional on tablets. Mobile phone is out of scope for MVP.

## Technical Assumptions

### Repository Structure: Monorepo

Single repository containing both frontend and backend code for faster development and easier deployment during MVP phase.

### Service Architecture

**Monolith with Queue System**: Single Node.js/Express backend serving REST API with Redis queue for image generation jobs. Frontend is separate React SPA but deployed together. This keeps it simple for MVP while allowing future microservice extraction.

### Testing Requirements

**Unit + Critical Integration**: Unit tests for business logic, integration tests for payment and Google API. No e2e tests in MVP to maintain velocity. Manual testing checklist for each release.

### Additional Technical Assumptions and Requests

- Use Next.js for frontend (SSR for landing pages, SPA for app)
- PostgreSQL for user data and billing records
- Redis for job queue and session management
- Google Cloud Storage for temporary image storage
- Stripe Checkout for payment flow (redirect style for MVP)
- SendGrid for transactional emails
- Vercel for frontend hosting
- Google Cloud Run for backend API
- Environment variables for all API keys and secrets
- GitHub Actions for CI/CD pipeline
- Implement exponential backoff for Google API retries
- Use signed URLs for image downloads (expire after 24 hours)

## Epic List

**Epic 1: Foundation & Authentication** - Set up project infrastructure, user authentication, and basic dashboard

**Epic 2: Image Generation Workflow** - Implement 3-stage mastery workflow with Google Gemini Nano integration

**Epic 3: Payment & Subscription** - Add Stripe payment processing and usage tracking

**Epic 4: Polish & Launch Prep** - Optimize performance, add analytics, prepare for production launch

## Epic 1: Foundation & Authentication

**Goal:** Establish the technical foundation with Git, CI/CD, core services, and basic authentication system. Users can sign up, log in, and access a simple dashboard showing their account status. This epic delivers the skeleton that all other features build upon.

### Story 1.1: Project Setup & Infrastructure

**As a** developer,
**I want** properly configured development and deployment environments,
**so that** the team can build and deploy features reliably.

#### Acceptance Criteria
1. Git repository initialized with proper .gitignore for Node.js/React
2. Monorepo structure created with /frontend and /backend directories
3. Package.json configured for both frontend (Next.js) and backend (Express)
4. Environment variable templates created (.env.example)
5. Docker Compose configuration for local PostgreSQL and Redis
6. README with setup instructions for new developers
7. Basic health check endpoint responds at /api/health
8. Vercel project connected for frontend deployment
9. Google Cloud project created with Cloud Run service

### Story 1.2: Database & Session Management

**As a** system administrator,
**I want** properly configured data persistence layers,
**so that** user data and sessions are managed reliably.

#### Acceptance Criteria
1. PostgreSQL schema created with users, sessions tables
2. Prisma ORM configured and initial migration completed
3. Redis connected for session storage
4. Database connection pooling configured
5: Session middleware implemented with secure cookie settings
6. Basic data access layer with user CRUD operations
7. Database seeders for development data

### Story 1.3: Authentication Flow

**As a** store owner,
**I want** to create an account and log in,
**so that** I can access the image generation service.

#### Acceptance Criteria
1. Sign up page accepts email and password
2. Password validation requires 8+ characters
3. Passwords hashed with bcrypt before storage
4. Login page authenticates users against database
5. JWT tokens issued on successful login
6. Protected route middleware validates tokens
7. Logout endpoint invalidates sessions
8. "Forgot password" flow sends reset email via SendGrid
9. Email verification on signup (can be clicked immediately for MVP)

### Story 1.4: Basic Dashboard

**As a** logged-in user,
**I want** to see my account dashboard,
**so that** I understand my subscription status and can start using the service.

#### Acceptance Criteria
1. Dashboard displays user email and account creation date
2. Placeholder for subscription status (hardcoded "Free Trial" for now)
3. Placeholder for usage counter (hardcoded "0 of 100 products used")
4. "Generate New Images" button (inactive, just UI)
5. Navigation header with logo and logout button
6. Responsive layout works on desktop and tablet
7. Loading states for all data fetches
8. Error boundary prevents white screen crashes

## Epic 2: Image Generation Workflow

**Goal:** Implement the complete 3-stage mastery workflow integrated with Google's Gemini Nano API. Users can upload a product image, make simple adjustments through the three stages, and download 6 professional images. This is the core value proposition of the entire product.

### Story 2.1: Image Upload & Validation

**As a** store owner,
**I want** to upload my product image,
**so that** I can start the generation process.

#### Acceptance Criteria
1. Drag-and-drop zone accepts JPG/PNG files up to 10MB
2. File picker fallback for traditional upload
3. Image preview displays after upload
4. Basic validation ensures image is at least 500x500px
5. Invalid files show clear error messages
6. Upload progress indicator during file transfer
7. Uploaded images temporarily stored in Google Cloud Storage
8. Automatic progression to Stage 1 after successful upload

### Story 2.2: Google Gemini Nano Integration

**As a** developer,
**I want** reliable integration with Google's Gemini Nano API,
**so that** we can generate high-quality product images.

#### Acceptance Criteria
1. Google AI SDK configured with API credentials
2. Prompt templates created for each image type (angles, environments, props)
3. API wrapper handles rate limiting and retries
4. Error handling for API failures with user-friendly messages
5. Response parsing extracts generated images
6. Generated images stored temporarily in Cloud Storage
7. Cleanup job removes images older than 24 hours
8. Cost tracking logs API usage for monitoring

### Story 2.3: Stage 1 - Angle Mastery

**As a** store owner,
**I want** to select the best angles for my product,
**so that** customers can see it from multiple perspectives.

#### Acceptance Criteria
1. Generate 3 angle variants (front, 3/4, side) using Gemini Nano
2. Display variants in selectable grid layout
3. Plus/minus buttons adjust rotation (-15° to +15° from base)
4. Adjustment triggers regeneration of current variant only
5. "Pick This" button locks in selection
6. Selected angles marked with checkmark
7. "Regenerate All" button creates 3 new variants
8. Progress to Stage 2 after selecting 3 angles
9. Processing shows spinner with "Generating angles..." message

### Story 2.4: Stage 2 - Environment & Props

**As a** store owner,
**I want** to place my product in different settings,
**so that** customers can visualize it in context.

#### Acceptance Criteria
1. Generate 3 environment variants (minimal, styled, rich)
2. Props slider adjusts density from empty to fully decorated
3. Environment slider adjusts complexity from simple to detailed
4. User selects 2 pure environments and 1 with props (3 total)
5. Selected environments apply to angles from Stage 1
6. Visual preview updates with slider adjustments
7. "Lock These" button confirms selections
8. Progress to Stage 3 after confirming selections
9. Back button returns to Stage 1 (loses Stage 2 progress)

### Story 2.5: Stage 3 - Polish Variables

**As a** store owner,
**I want** to fine-tune the lighting and mood,
**so that** my products look professionally photographed.

#### Acceptance Criteria
1. Display all 6 images in grid (3 angles × 2 environments + props)
2. Lightning slider: Darker ← → Brighter (5 positions)
3. Shadows slider: Soft ← → Hard (5 positions)
4. Theme slider: Cool ← → Warm (5 positions)
5. Preset buttons: "Modern", "Classic", "Minimal" (sets all sliders)
6. Changes apply to all 6 images simultaneously
7. "Finalize Images" button locks in adjustments
8. Processing shows progress bar with time estimate
9. Real-time preview of adjustments (may be lower quality)

### Story 2.6: Download & Delivery

**As a** store owner,
**I want** to download my generated images,
**so that** I can use them in my online store.

#### Acceptance Criteria
1. Display all 6 final images in preview grid
2. Images named descriptively (product-angle-environment-001.jpg)
3. "Download All" creates ZIP file with all 6 images
4. Individual download buttons for each image
5. Images are high-resolution (minimum 2000x2000px)
6. Download links expire after 24 hours
7. Email notification when generation completes (if user navigates away)
8. Success message with "Generate Another Product" button
9. Generation counted against user's monthly limit

## Epic 3: Payment & Subscription

**Goal:** Implement Stripe payment processing for the $49/month subscription model. Users can subscribe, manage billing, and track their usage against monthly limits. This epic makes the product commercially viable.

### Story 3.1: Stripe Integration

**As a** developer,
**I want** Stripe payment processing configured,
**so that** we can accept subscription payments.

#### Acceptance Criteria
1. Stripe SDK integrated with API keys in environment variables
2. Webhook endpoint receives Stripe events
3. Webhook signature verification prevents fake events
4. Customer creation in Stripe syncs with our database
5. Subscription status updates handled (active, cancelled, past_due)
6. Payment method updates supported
7. Error handling for failed payments
8. Test mode configuration for development

### Story 3.2: Subscription Management

**As a** store owner,
**I want** to subscribe to the service,
**so that** I can generate images for my products.

#### Acceptance Criteria
1. Pricing page shows $49/month for 100 products
2. "Subscribe" button redirects to Stripe Checkout
3. Successful payment redirects back to dashboard
4. Dashboard shows active subscription status
5. Usage counter displays "X of 100 products used this month"
6. Billing page shows next payment date
7. "Cancel Subscription" button handles cancellation
8. Cancelled users retain access until period ends
9. Resubscribe option for cancelled users

### Story 3.3: Usage Tracking & Limits

**As a** store owner,
**I want** to see my usage and understand limits,
**so that** I can manage my subscription effectively.

#### Acceptance Criteria
1. Each successful generation increments usage counter
2. Usage resets on monthly billing date
3. Warning shown at 80 products (20 remaining)
4. Final warning at 95 products
5. Generation blocked when limit reached
6. "Upgrade" option for additional capacity (future)
7. Usage history shows last 30 days of generations
8. Failed generations don't count against limit
9. Admin override for customer service issues

### Story 3.4: Free Trial Flow

**As a** new user,
**I want** to try the service before paying,
**so that** I can evaluate if it meets my needs.

#### Acceptance Criteria
1. New users get 3 free product generations
2. No credit card required for trial
3. Trial banner shows remaining free generations
4. After 3 uses, paywall appears with subscription CTA
5. Trial images include small watermark (removable with subscription)
6. Full feature access during trial (all 3 stages)
7. Trial progress saved if user subscribes
8. Email reminder after 2 trial uses
9. Trial expires after 7 days if unused

## Epic 4: Polish & Launch Prep

**Goal:** Optimize performance, add analytics, fix bugs, and prepare for production launch. This epic transforms the functional MVP into a polished product ready for real users.

### Story 4.1: Performance Optimization

**As a** store owner,
**I want** fast, responsive interface,
**so that** I can work efficiently with multiple products.

#### Acceptance Criteria
1. Lazy load images in gallery views
2. Implement image CDN with CloudFlare
3. Compress JavaScript bundles under 200KB initial load
4. Add service worker for offline resilience
5. Database queries optimized with proper indexes
6. Redis caching for frequently accessed data
7. API response times under 200ms (excluding generation)
8. Memory leaks identified and fixed
9. Load testing confirms 100 concurrent user support

### Story 4.2: Analytics & Monitoring

**As a** product owner,
**I want** to understand user behavior and system health,
**so that** we can improve the product and maintain reliability.

#### Acceptance Criteria
1. Google Analytics tracks page views and events
2. Custom events for workflow completion/abandonment
3. Generation success/failure rates tracked
4. API latency monitoring with alerts
5. Error tracking with Sentry integration
6. Database query performance monitoring
7. Google API cost tracking dashboard
8. User feedback widget in corner of app
9. Weekly metrics email to administrators

### Story 4.3: Error Handling & Recovery

**As a** store owner,
**I want** graceful handling of problems,
**so that** I don't lose work or get frustrated.

#### Acceptance Criteria
1. All API errors show user-friendly messages
2. Network failures trigger automatic retry
3. Generation failures offer regeneration option
4. Partial progress saved if user loses connection
5. Browser back button doesn't break workflow
6. Session timeout warning before logout
7. Maintenance mode page for deployments
8. Support contact information in error messages
9. Automatic bug reports for critical errors

### Story 4.4: Launch Preparation

**As a** founder,
**I want** everything ready for public launch,
**so that** we can onboard real paying customers smoothly.

#### Acceptance Criteria
1. Terms of Service and Privacy Policy pages
2. Cookie consent banner for GDPR compliance
3. Transactional email templates tested
4. Customer support email configured
5. Documentation/FAQ page created
6. Social meta tags for link sharing
7. SSL certificates verified
8. Backup and disaster recovery tested
9. Load balancer configured for high availability
10. Launch checklist completed and verified

## Checklist Results Report

*To be completed after PM checklist execution*

## Next Steps

### UX Expert Prompt

"Review this PRD for an AI product photography platform focused on extreme simplicity for non-technical users. Key element is the 3-stage mastery workflow. Create detailed UI/UX specifications prioritizing one-click simplicity and visual feedback. Focus on making complex AI simple through progressive disclosure and binary choices."

### Architect Prompt

"Create the technical architecture for this AI product photography MVP. Key constraints: 8-week timeline, $5-10K budget, monorepo structure, Google Gemini Nano API integration, 10-15 minute processing time acceptable. Focus on simple, scalable foundation that can handle 100 concurrent users. Prioritize developer velocity and operational simplicity over architectural purity."