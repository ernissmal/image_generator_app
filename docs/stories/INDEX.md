# Epic 2.1: AI-Powered Angle Generation - Story Index

**Epic Goal**: Replace static prototype images with real AI-generated angle variations using Google Gemini Nano API.

**Timeline**: 14 days (3 agents working in parallel)
**Status**: 🟢 In Progress - All 3 stories complete and ready for QA

---

## Quick Links

- **Epic Overview**: [`../epic-ai-angle-generation.md`](../epic-ai-angle-generation.md)
- **Agent Coordination**: [`../AGENT-COORDINATION.md`](../AGENT-COORDINATION.md)
- **PRD Reference**: [`../prd.md`](../prd.md)

---

## Story Assignments

### 🔵 Agent 1: API Integration Specialist

**Story**: [STORY-2.1.1 - Google Gemini Nano API Integration](./agent-1-api-specialist/STORY-2.1.1-gemini-api-integration.md)

**Estimate**: 5 story points (3 days)
**Priority**: P0 - Must complete first
**Status**: ✅ Done (QA: 95/100)

**Key Deliverables**:
- `src/services/gemini-client.js` - API wrapper with retry logic
- `src/routes/health.js` - Health check endpoint
- Unit tests with >80% coverage
- API integration documentation

**Success Criteria**:
- API key validated
- Rate limiting working (60 req/min)
- Retry logic handles failures (3 attempts)
- Health endpoint returns 200 OK

---

### 🟢 Agent 2: Prompt Engineer

**Story**: [STORY-2.1.2 - AI Prompt Template System](./agent-2-prompt-engineer/STORY-2.1.2-prompt-template-system.md)

**Estimate**: 8 story points (5 days)
**Priority**: P0 - Can start immediately, runs in parallel with Agent 1
**Status**: ✅ Done (QA: 95/100)

**Key Deliverables**:
- 9 JSON prompt templates (all angle types)
- `src/services/prompt-template-loader.js` - Template loader
- `prompts/README.md` - Prompt engineering guide
- Quality benchmarks and examples

**Success Criteria**:
- All 9 templates validated against JSON schema
- Generated angles match reference image quality
- Variable substitution working correctly
- Documentation complete with examples

**Angle Types**:
1. `angle-0deg.json` - 0° Top View
2. `angle-45deg.json` - 45° Top View
3. `angle-90deg.json` - 90° Top View
4. `angle-135deg.json` - 135° Top View
5. `angle-180deg.json` - 180° Top View
6. `angle-270deg.json` - 270° Top View
7. `isometric-3d.json` - Isometric 3D View
8. `top-orthographic.json` - Orthographic Top View
9. `side-profile.json` - Side Profile View

---

### 🟡 Agent 3: Frontend Developer

**Story**: [STORY-2.1.3 - Angle Generation UI & Integration](./agent-3-frontend-dev/STORY-2.1.3-angle-generation-ui.md)

**Estimate**: 13 story points (8 days)
**Priority**: P0 - Starts after Agent 1 completes Day 3
**Status**: 🟢 Ready for Review

**Key Deliverables**:
- `src/routes/upload.js` - Upload endpoint
- `src/routes/generate-angles.js` - Generation endpoint
- Updated `prototype/index.html` - API-integrated UI
- Updated `prototype/js/app.js` - Frontend logic
- Updated `prototype/css/style.css` - Styles for new states

**Success Criteria**:
- Upload validates files correctly
- Generation displays 9 angles
- Users can select 3 angles
- Loading/error states working
- Mobile responsive
- Integration tests passing

---

## Development Workflow

### Phase 1: Foundation (Days 1-3)
```
Agent 1: Build API wrapper ━━━━━━━━━━━━┓
                                       ┃
Agent 2: Create prompts   ━━━━━━━━━━━━┫
                                       ┃
Agent 3: Wait for handoff ━━━━━━━━━━━━┛
```

**Agent 1 Delivers**:
- Working `GeminiClient` class
- Health check endpoint
- API documentation

---

### Phase 2: Integration (Days 4-8)
```
Agent 1: Support & testing ━━━━━━━━━━━┓
                                       ┃
Agent 2: Finish prompts    ━━━━━━━━━━━┫
                                       ┃
Agent 3: Build endpoints   ━━━━━━━━━━━┛
```

**Agent 2 Delivers**:
- All 9 prompt templates
- Template loader service
- Usage documentation

**Agent 3 Starts**:
- Upload endpoint
- Generation endpoint
- Frontend integration

---

### Phase 3: Frontend (Days 9-11)
```
Agent 1: Code review       ━━━━━━━━━━━┓
                                       ┃
Agent 2: Quality testing   ━━━━━━━━━━━┫
                                       ┃
Agent 3: Complete UI       ━━━━━━━━━━━┛
```

**Agent 3 Delivers**:
- Complete UI integration
- Loading/error states
- Mobile responsive design

---

### Phase 4: Testing (Days 12-14)
```
All Agents: Integration testing ━━━━━━━━━━
```

**Team Activities**:
- End-to-end testing
- Performance validation
- Bug fixes
- Documentation review

---

## Handoff Schedule

### Handoff 1: Agent 1 → Agents 2 & 3
**Day**: 3 (End of Agent 1's sprint)
**Meeting**: 30-minute sync
**Agenda**:
- Demo `GeminiClient` functionality
- Review API documentation
- Answer Agent 2 & 3 questions
- Provide code examples

**Deliverable**: `docs/API-INTEGRATION-GUIDE.md`

---

### Handoff 2: Agent 2 → Agent 3
**Day**: 5 (End of Agent 2's sprint)
**Meeting**: 30-minute sync
**Agenda**:
- Demo template loader
- Show prompt examples
- Explain variable substitution
- Provide angle ID list

**Deliverable**: `prompts/README.md` with usage examples

---

### Handoff 3: Agent 3 → All Agents
**Day**: 11 (End of Agent 3's sprint)
**Meeting**: 1-hour demo
**Agenda**:
- Demo complete workflow
- Showcase error handling
- Mobile responsive demo
- Discuss bugs/issues

**Deliverable**: Working prototype + test report

---

## Testing Checklist

### Unit Testing (Each Agent)
- [ ] **Agent 1**: API wrapper methods (>80% coverage)
- [ ] **Agent 2**: Template loader and validation
- [ ] **Agent 3**: Frontend components and validation

### Integration Testing (All Agents)
- [ ] Upload product image successfully
- [ ] Generate all 9 angles within 3 minutes
- [ ] Select 3 angles and continue workflow
- [ ] Error handling displays correct messages
- [ ] Retry logic works after failures
- [ ] Mobile responsive on tablet

### Performance Testing
- [ ] Generation time < 3 minutes
- [ ] API cost < $0.20 per product
- [ ] Success rate > 90%
- [ ] Page load time < 3 seconds

---

## Dependencies

### External
- Google Gemini Nano API access ✅
- API key configured in `.env` ✅
- Reference images available ✅
- Cloud Storage bucket (optional for MVP)

### Internal
- Node.js v16+ installed
- npm packages:
  - `@google/generative-ai`
  - `express`
  - `multer`
  - `sharp`
  - `jest` (testing)

---

## Risk Management

### High-Priority Risks

**Risk 1: API Rate Limits**
- **Impact**: High
- **Mitigation**: Implement queue system, multiple API keys
- **Owner**: Agent 1

**Risk 2: Prompt Quality Issues**
- **Impact**: High
- **Mitigation**: Iterate on prompts, A/B testing, human review
- **Owner**: Agent 2

**Risk 3: Generation Time Too Slow**
- **Impact**: Medium
- **Mitigation**: Parallel processing, optimize image sizes
- **Owner**: Agent 1 & Agent 3

**Risk 4: Integration Complexity**
- **Impact**: Medium
- **Mitigation**: Clear handoff docs, frequent communication
- **Owner**: All agents

---

## Communication

### Daily Standup (Async)
**Time**: 9:00 AM daily
**Format**: Update in shared doc

**Questions**:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers or questions

---

### Weekly Sync (Live)
**Time**: Every Monday, 2:00 PM
**Duration**: 30 minutes
**Attendees**: All 3 agents

**Agenda**:
- Review progress
- Resolve blockers
- Plan next week
- Update timeline

---

### Ad-Hoc Questions
**Channel**: Shared document comments
**Response SLA**: 2 hours during work hours

---

## Definition of Done

### Story Level
- [ ] All acceptance criteria met
- [ ] Code reviewed by another agent
- [ ] Unit tests passing (>80% coverage)
- [ ] Documentation complete
- [ ] No P0/P1 bugs remaining
- [ ] Merged to main branch

### Epic Level
- [ ] All 3 stories complete
- [ ] Integration tests passing
- [ ] Performance benchmarks met
- [ ] End-to-end demo successful
- [ ] Documentation reviewed
- [ ] Stakeholder approval obtained

---

## Success Metrics

**Measurement Period**: 2 weeks after launch

### Technical Metrics
- **Generation Success Rate**: > 90%
- **Average Generation Time**: < 3 minutes
- **API Cost per Product**: < $0.20
- **Error Rate**: < 5%

### User Metrics
- **Upload Completion Rate**: > 85%
- **Angle Selection Rate**: > 80% (complete 3 selections)
- **User Satisfaction**: > 4.0/5.0 (from feedback widget)

---

## Resources

### Reference Images
- **Location**: `/prototype/images/`
- **Purpose**: Examples of desired output quality
- **Format**: PNG, ~500-1000KB each

### Documentation
- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [MDN Web Docs](https://developer.mozilla.org/) - Frontend reference

### Tools
- **API Testing**: Postman, curl
- **Unit Testing**: Jest
- **Code Editor**: VS Code (recommended)
- **Version Control**: Git + GitHub

---

## Next Epic

After Epic 2.1 completes, proceed to:

**Epic 2.2: AI Environment & Props Generation**
- Build on angle generation foundation
- Implement Stage 2 of workflow
- Generate background environments
- Add prop placement

---

**Document Version**: 1.0
**Last Updated**: 2025-10-23
**Maintained By**: BMad Master Task Executor
