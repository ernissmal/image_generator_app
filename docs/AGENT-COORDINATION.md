# Agent Coordination & Workflow

**Epic**: Epic 2.1 - AI-Powered Angle Generation
**Project**: Image Generator App
**Created**: 2025-10-23

---

## Overview

This document coordinates work across three specialized agents working in parallel on the AI Angle Generation feature. Each agent has specific responsibilities with clear handoff points.

---

## Agent Roles & Responsibilities

### 🔵 Agent 1: API Integration Specialist
**Story**: STORY-2.1.1
**Focus**: Backend API integration, error handling, rate limiting
**Working Directory**: `src/services/`, `src/routes/`, `src/config/`

**Deliverables**:
- Google Gemini Nano API client wrapper
- Rate limiting middleware
- Error handling and retry logic
- Health check endpoint
- Unit tests for API wrapper

**Timeline**: Days 1-3 (3 days)

---

### 🟢 Agent 2: Prompt Engineer
**Story**: STORY-2.1.2
**Focus**: AI prompt optimization, template system
**Working Directory**: `prompts/`, `src/services/prompt-template-loader.js`

**Deliverables**:
- 9 JSON prompt templates (one per angle type)
- Template loader service
- Variable substitution system
- Prompt engineering documentation
- Quality benchmarks

**Timeline**: Days 1-5 (5 days, starts Day 1, extends beyond Agent 1)

---

### 🟡 Agent 3: Frontend Developer
**Story**: STORY-2.1.3
**Focus**: UI/UX, API integration, user flow
**Working Directory**: `prototype/`, `src/routes/upload.js`, `src/routes/generate-angles.js`

**Deliverables**:
- Upload endpoint + UI
- Angle generation endpoint
- Updated prototype with API calls
- Loading/error states
- Mobile responsive design

**Timeline**: Days 4-11 (8 days, starts after Agent 1 completes core API wrapper)

---

## Dependency Chart

```
Day 1-3: Agent 1 (API Wrapper) ━━━━━━━━━━━━┓
                                          ┃
Day 1-5: Agent 2 (Prompts)   ━━━━━━━━━━━━╋━━━┓
                                          ┃   ┃
Day 4-11: Agent 3 (Frontend) ━━━━━━━━━━━━┛   ┃
                                              ┃
Day 12-14: Integration Testing ━━━━━━━━━━━━━━┛
```

**Critical Path**:
1. Agent 1 must complete `GeminiClient` class before Agent 3 can build endpoints
2. Agent 2 works in parallel but must finish templates before Agent 3 tests generation
3. All agents must complete before integration testing

---

## Handoff Points

### Handoff 1: Agent 1 → Agent 2
**When**: Day 3 (after Agent 1 completes API wrapper)
**What Agent 1 Provides**:
```javascript
// API interface that Agent 2's prompts will use
const geminiClient = new GeminiClient(apiKey);

const result = await geminiClient.generateImage({
  prompt: "Your optimized prompt here",
  imageUrl: "http://example.com/product.jpg",
  parameters: {
    temperature: 0.4,
    top_p: 0.8,
    top_k: 40,
    max_output_tokens: 2048
  }
});
```

**What Agent 2 Needs**:
- Confirmation of parameter names and types
- Example successful API response
- Error format documentation

**Deliverable**: `docs/API-INTEGRATION-GUIDE.md` from Agent 1

---

### Handoff 2: Agent 1 → Agent 3
**When**: Day 3 (after Agent 1 completes API wrapper)
**What Agent 1 Provides**:
- `GeminiClient` class ready to use
- Health check endpoint: `GET /health/gemini`
- Expected response formats
- Error handling patterns

**What Agent 3 Needs**:
- Import path for `GeminiClient`
- How to call `generateImage()` method
- Error types and retry behavior

**Deliverable**: Working `gemini-client.js` with JSDoc comments

---

### Handoff 3: Agent 2 → Agent 3
**When**: Day 5 (after Agent 2 completes templates)
**What Agent 2 Provides**:
```javascript
// List of available angles
const availableAngles = [
  { id: 'angle-0deg-top', type: '0deg', description: '0° Top View' },
  { id: 'angle-90deg-top', type: '90deg', description: '90° Top View' },
  // ... 7 more
];

// Template loader
const templateLoader = new PromptTemplateLoader();
const template = templateLoader.getByAngleType('0deg');
const prompt = templateLoader.substitute(template, { product_name: 'Wallet' });
```

**What Agent 3 Needs**:
- How to load templates
- How to substitute variables
- Which angle IDs to display in UI

**Deliverable**: `prompts/README.md` with usage examples

---

## Communication Protocol

### Daily Standup Questions
Each agent answers:
1. What did you complete yesterday?
2. What are you working on today?
3. Any blockers or questions for other agents?

### Blocking Issues
If Agent X is blocked by Agent Y:
1. Post in shared doc: `BLOCKED: Agent X waiting on [specific item] from Agent Y`
2. Agent Y responds with ETA or immediate fix
3. Agent X works on non-blocked tasks meanwhile

### Code Reviews
- Agent 1 reviews Agent 3's endpoint implementations
- Agent 2 reviews generation quality from Agent 3's integration
- Agent 3 tests API reliability from Agent 1

---

## Shared Resources

### Environment Variables
**File**: `.env`
```
GOOGLE_AI_STUDIO_API=AIzaSyA--nbFddI5EigQNDBfy9tiGxm5pXzX3VA
GCS_BUCKET_NAME=image-generator-uploads
NODE_ENV=development
```

**Managed By**: Agent 1
**Used By**: All agents

---

### Reference Images
**Location**: `/prototype/images/`
```
l-shape-angle-0deg-top.png
l-shape-angle-90deg-top.png
l-shape-angle-180deg-top.png
l-shape-isometric-3d.png
l-shape-top-orthographic.png
l-shape-side-profile.png
```

**Managed By**: Agent 2 (used in prompt templates)
**Used By**: Agent 2, Agent 3 (for comparison testing)

---

### API Endpoints
**Owned By**: Agent 3 (implements), Agent 1 (provides logic)

| Endpoint | Method | Purpose | Owner |
|----------|--------|---------|-------|
| `/health/gemini` | GET | Check API health | Agent 1 |
| `/api/upload` | POST | Upload product image | Agent 3 |
| `/api/generate-angles` | POST | Generate 9 angles | Agent 3 |

---

## Testing Strategy

### Unit Tests
**Agent 1**: API wrapper methods, error classification, rate limiting
**Agent 2**: Template loader, variable substitution
**Agent 3**: React components (if using React), upload validation

**Target**: 80%+ coverage per agent

---

### Integration Tests
**After All Agents Complete**:
1. Upload real product image
2. Verify all 9 angles generate
3. Check quality matches reference images
4. Confirm error handling works
5. Test retry logic
6. Verify mobile responsive

**Responsibility**: Agent 3 leads, all agents participate

---

### Performance Benchmarks
**Metrics to Track**:
- Generation time: < 3 minutes for 9 angles
- API cost: < $0.20 per product
- Success rate: > 90% of generations succeed
- Uptime: API available > 99% of test period

**Responsibility**: Agent 1 tracks API metrics, Agent 3 tracks UX metrics

---

## Git Workflow

### Branch Strategy
```
main
  ├── feature/api-integration (Agent 1)
  ├── feature/prompt-templates (Agent 2)
  └── feature/frontend-angles (Agent 3)
```

### Merge Order
1. Agent 1 merges first (foundation)
2. Agent 2 merges second (depends on API)
3. Agent 3 merges last (integrates both)

### Commit Message Format
```
[Agent X] [Component] Description

Example:
[Agent 1] [API] Add Gemini client wrapper with retry logic
[Agent 2] [Prompts] Create 0deg angle template
[Agent 3] [Frontend] Implement upload UI with validation
```

---

## Issue Tracking

### GitHub Issues Format
```
Title: [Agent X] [Story 2.1.X] Issue description
Labels: agent-1 | agent-2 | agent-3, bug | task | question
Assignee: Respective agent

Body:
**Story**: STORY-2.1.X
**Description**: [Clear description]
**Expected**: [What should happen]
**Actual**: [What actually happens]
**Steps to Reproduce**: [If bug]
```

---

## Definition of Done (Epic Level)

Epic 2.1 is complete when:

**Agent 1**:
- [ ] `GeminiClient` class implemented and tested
- [ ] Health check endpoint working
- [ ] Unit tests passing (>80% coverage)
- [ ] Documentation complete

**Agent 2**:
- [ ] All 9 prompt templates created
- [ ] Template loader implemented
- [ ] Quality meets reference images
- [ ] Documentation complete

**Agent 3**:
- [ ] Upload endpoint working
- [ ] Generation endpoint working
- [ ] Frontend integrated with backend
- [ ] Loading/error states implemented
- [ ] Mobile responsive
- [ ] Integration tests passing

**Integration**:
- [ ] End-to-end flow working
- [ ] Performance benchmarks met
- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Demo completed for stakeholders

---

## Emergency Contacts

**Blocker Resolution**:
- If Agent 1 blocked: Check API key, rate limits, network
- If Agent 2 blocked: Review prompt quality, test with different products
- If Agent 3 blocked: Check CORS, network requests, console errors

**Escalation Path**:
1. Post in shared doc with `URGENT:` prefix
2. All agents review within 2 hours
3. Sync meeting if not resolved

---

## Success Criteria

### Individual Agent Success
- All acceptance criteria met
- Tests passing
- Code reviewed
- Documentation complete
- Handoffs delivered on time

### Team Success
- Epic completed in 14 days
- 90%+ generation success rate
- < 3 minute generation time
- Happy path working smoothly
- Error handling robust

---

## Post-Epic Review

After Epic 2.1 completes, hold retrospective:

**Questions**:
1. What went well with agent coordination?
2. What blockers occurred?
3. How can handoffs improve?
4. Any technical debt to address?
5. Lessons for Epic 2.2 (Environment Generation)?

**Document**: `docs/epic-2.1-retrospective.md`

---

**Document Owner**: Project Lead
**Last Updated**: 2025-10-23
**Next Review**: End of Sprint 1
