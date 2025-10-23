# Complete Project Ruleset Index

**Last Updated**: 2024-10-23
**Status**: Active & Ready to Use

---

## Quick Navigation

This is the master index for all project rules and guidelines. Each section below links to the detailed ruleset.

### The Four Rule Documents

1. **[GITHUB-RULES.md](./GITHUB-RULES.md)** - Branching, commits, PRs, merging
2. **[NOTION-RULES.md](./NOTION-RULES.md)** - Project tracking, knowledge base, organization
3. **[COMMUNICATION-RULES.md](./COMMUNICATION-RULES.md)** - How we work together, status updates, feedback
4. **[CLAUDE.md](./CLAUDE.md)** - Project overview, tech stack, getting started

---

## Overview: The Complete System

Your project uses a **three-layer ruleset** that works together:

```
┌─────────────────────────────────────────────────┐
│         COMMUNICATION-RULES.md                  │
│  How we request, report, and collaborate        │
│                                                 │
│  - Request & kickoff protocol                   │
│  - Progress communication (pull-based)          │
│  - Feedback & code review                       │
│  - Blocking issues & escalation                 │
│  - QA & testing communication                   │
│  - Documentation sync & agent prefixes          │
│  - Daily/weekly rhythms                         │
│  - Edge cases & special situations              │
└─────────────────────────────────────────────────┘
                          ▲
                          │
        ┌─────────────────┴─────────────────┐
        ▼                                    ▼
┌──────────────────────────────┐  ┌─────────────────────────────┐
│    GITHUB-RULES.md           │  │    NOTION-RULES.md          │
│  Code & version control      │  │  Project tracking & KB      │
│                              │  │                             │
│  - Branch structure          │  │  - Hybrid dashboard         │
│  - Epic naming & lifecycle   │  │  - Epic database schema     │
│  - Story management          │  │  - Knowledge base structure │
│  - Commit messages           │  │  - Agent prefix system      │
│  - PR & merge rules          │  │  - Notion views & linked   │
│  - Agent prefixes            │  │  - GitHub-Notion sync      │
│  - Test coverage             │  │  - Maintenance & updates   │
│  - Security scanning         │  │  - Access & permissions    │
│  - Branch protection         │  │                             │
└──────────────────────────────┘  └─────────────────────────────┘
```

---

## Agent Prefix System (Universal)

All work is tagged with an **agent prefix** for traceability and organization:

| Prefix | Agent | Creates | Uses |
|---|---|---|---|
| **[ARCH]** | Project Architect | Architecture decisions, system design, tech strategy | GitHub commits, Notion KB, documentation |
| **[BACKEND]** | Secure Backend Architect | API specs, database design, security implementation | GitHub commits, Notion KB, code files |
| **[FRONTEND]** | Frontend Architect | Component libraries, UI patterns, design system | GitHub commits, Notion KB, component files |
| **[TEST]** | Unit Test Architect | Test implementations, coverage reports, test strategies | GitHub commits, test files, Notion KB |
| **[CODE]** | Code Doc Master | Code reviews, documentation, complex logic explanation | GitHub commits, code comments, Notion KB |
| **[DOC]** | Documentation Master | Setup guides, standards, best practices, general docs | GitHub commits, Notion KB, markdown files |

### Where Prefixes Appear

- **GitHub**: All commits use format: `[AGENT] EPIC-ID: description`
  - Example: `[ARCH] LCX-01: Design authentication flow`
  - Example: `[BACKEND] LCX-01: Implement OAuth API endpoint`

- **Notion**: KB articles tagged with agent prefix
  - Use Notion database tag feature to filter by agent
  - Makes it easy to find "all BACKEND documentation"

- **Filenames**: Documentation files prefixed
  - Format: `{AGENT}-{document-name}.md`
  - Example: `ARCH-microservices-strategy.md`
  - Example: `BACKEND-database-schema-design.md`

---

## The Epic Workflow (End-to-End)

This is how a complete feature flows through the system:

### Phase 1: Planning
1. **Define Epic** (in Notion)
   - Create row in Epic database
   - Set owner, timeline, description
   - Link to related KB articles

2. **Create Epic Branch** (GitHub)
   - Branch name: `epic/LCX-{ID}-{Name}`
   - Example: `epic/LCX-01-Auth`
   - Create `/epics/LCX-01-Auth.md` with definition

3. **Add to Notion** (via Claude Code)
   - [ARCH] creates epic record with timeline
   - [ARCH] links to GitHub branch
   - Status: `Backlog` → `In Progress`

### Phase 2: Development
1. **Stories Created** (on epic branch)
   - Low complexity: commit directly to epic branch
   - High complexity: create feature branch
   - All commits tagged: `[AGENT] LCX-ID: description`

2. **Testing** (continuous)
   - Tests written as code develops
   - Coverage tracked in real-time
   - [TEST] agent may create test strategies

3. **Documentation** (as-you-go)
   - [CODE] updates code comments
   - [ARCH] documents design decisions in Notion
   - [BACKEND] documents API changes in Notion KB

### Phase 3: Review & QA
1. **Create PR** (epic → development)
   - Requires 60% test coverage minimum
   - PR description includes test summary
   - Status in Notion: `QA Review`

2. **QA Gate Decision** (you decide)
   - **PASS**: All checks pass, ready to merge
   - **CONCERNED**: Minor issues, merge allowed with note
   - **FAIL**: Blockers, cannot merge until fixed

3. **Notion Update** (via Claude Code)
   - [ARCH]/[DOC] updates epic status
   - Adds QA notes to epic record
   - Coverage % synced

### Phase 4: Release
1. **Epic → Development** (merge happens)
   - Notion status: `Done`
   - GitHub merge status: `Merged to Development`
   - Epic branch kept as archive (not deleted)

2. **Development → Main** (when ready)
   - Requires 90% test coverage (strict)
   - Requires QA gate: PASS only
   - All security checks must pass
   - Status in Notion: `Done`
   - GitHub merge status: `Merged to Main`

3. **Archival** (epic lifecycle complete)
   - Notion status: `Archived`
   - GitHub merge status: `Archived Reference`
   - Epic branch tagged for reference

---

## Daily Work Patterns

### As a Developer (working with Claude Code)

**Request Work**:
```
GitHub Issue or PR Comment:
[Request Title]
What: [What to build]
Why: [Business context]
Constraints: [Requirements/limitations]
Definition of Done: [How to know it's complete]
```

**Check Progress**:
- Notion dashboard → quick health snapshot
- GitHub PRs → detailed code changes
- No daily meetings needed

**Give Feedback**:
- Comment on PRs with specific feedback
- Approve when ready, or request changes
- Be constructive and specific

**Resolve Blockers**:
- If Claude Code reports blocker, respond immediately
- Provide info, change scope, or accept delay
- Blockers reported in GitHub, not silent

### Weekly (Optional)

Spend 15 minutes reviewing:
- Notion epic kanban board
- Test coverage trends
- Any QA concerns
- Timeline tracking

---

## File Organization

```
image_generator_app/
├── RULESET-INDEX.md              ← You are here
├── GITHUB-RULES.md               ← Branching & commits
├── NOTION-RULES.md               ← Project tracking
├── COMMUNICATION-RULES.md        ← How we work
├── CLAUDE.md                     ← Project overview
│
├── epics/                        ← Epic definitions
│   ├── LCX-01-Auth.md
│   ├── LCX-02-ImageGeneration.md
│   └── [other epics]
│
├── src/                          ← Source code
├── tests/                        ← Test files
├── public/                       ← Static assets
└── [other standard folders]
```

---

## Rule Priority & Conflicts

If rules ever conflict, use this priority:

1. **COMMUNICATION-RULES.md** (highest) - How we interact
2. **GITHUB-RULES.md** - Code quality gates
3. **NOTION-RULES.md** - Tracking & organization
4. **CLAUDE.md** (lowest) - Project overview

Example: If GITHUB-RULES says 60% coverage but a specific epic has higher standards, COMMUNICATION-RULES takes precedence (you can adjust standards for special cases).

---

## Key Numbers to Remember

| Metric | Threshold | Where |
|---|---|---|
| **Dev Branch Merge** | 60% test coverage | GITHUB-RULES |
| **Main Branch Merge** | 90% test coverage | GITHUB-RULES |
| **QA Gate (Dev)** | CONCERNED or PASS | GITHUB-RULES |
| **QA Gate (Main)** | PASS only | GITHUB-RULES |
| **PR Response Time** | No deadline (async) | COMMUNICATION-RULES |
| **Weekly Sync** | 15 minutes (optional) | COMMUNICATION-RULES |

---

## Getting Started Checklist

- [ ] Read GITHUB-RULES.md (5 min)
- [ ] Read NOTION-RULES.md (5 min)
- [ ] Read COMMUNICATION-RULES.md (5 min)
- [ ] Create Notion workspace with epic database
- [ ] Set up GitHub branch protection rules
- [ ] Create first epic (LCX-01-Auth or similar)
- [ ] Create first story in epic
- [ ] Run first test suite
- [ ] Create first PR
- [ ] Tag commit messages with [AGENT] prefix
- [ ] Start using Notion for tracking

---

## Continuous Improvement

These rules are **alive and evolving**. As you work:

- If a rule isn't working, update it
- If you discover a new best practice, add it
- Keep CLAUDE.md updated quarterly
- Suggest rule changes in GitHub issues (marked with 🔧 RULE label)

---

## Support & Questions

**If something is unclear**:
- Check the relevant rule document (use navigation above)
- Look for examples in the "Details" section
- If still unclear, update the rule to be clearer

**If you get stuck**:
- Report blocker clearly in GitHub (use 🚫 BLOCKER format)
- Include what/why/how to fix
- Claude Code will respond with options

---

## Document Versions

| Document | Version | Last Updated | Status |
|---|---|---|---|
| RULESET-INDEX.md | 1.0 | 2024-10-23 | Active |
| GITHUB-RULES.md | 1.0 | 2024-10-23 | Active |
| NOTION-RULES.md | 1.0 | 2024-10-23 | Active |
| COMMUNICATION-RULES.md | 1.0 | 2024-10-23 | Active |
| CLAUDE.md | 1.0 | 2024-10-23 | Active |

---

## Quick Links

**Start Here**: [COMMUNICATION-RULES.md](./COMMUNICATION-RULES.md) (how to work with Claude Code)

**For Code Work**: [GITHUB-RULES.md](./GITHUB-RULES.md) (branching, commits, PRs)

**For Project Tracking**: [NOTION-RULES.md](./NOTION-RULES.md) (epics, progress, KB)

**For Project Overview**: [CLAUDE.md](./CLAUDE.md) (tech stack, setup)

---

**You're all set!** You now have a complete, documented system for developing the Image Generator App with AI assistance. 🚀
