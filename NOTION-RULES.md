# Notion Workspace Rules & Organization

## Workspace Overview

**Primary Purpose**: Hybrid hub combining project progress tracking + knowledge base
**Access**: Private (Ernest only + AI agents via Claude Code)
**Sync Model**: Semi-automated via Claude Code integration
**Knowledge Focus**: Architecture decisions, setup guides, standards, best practices

---

## Notion Structure: Hybrid Dashboard Model

### Top-Level Navigation (Main Dashboard Page)

```
Image Generator App Workspace
├── 📊 Project Overview
│   ├── Epic Timeline (Roadmap view)
│   ├── Epic Kanban (Progress board)
│   └── Status Summary (Quick stats)
├── 📖 Knowledge Base
│   ├── Architecture Decisions
│   ├── Setup & Installation Guides
│   ├── Coding Standards
│   └── Best Practices
├── 📋 Epic Database (Master reference)
└── 🔗 GitHub Integration Info
```

---

## Database: Epics Master Reference

### Epic Database Purpose
- Single source of truth for all epics
- Links to GitHub branches
- Tracks status, timeline, and resources
- Feeds into Timeline and Kanban views

### Epic Database Schema

**Properties**:
- **Epic ID** (Text): e.g., `LCX-01`
- **Epic Name** (Text): e.g., `Auth`
- **Full Name** (Formula): `{Epic ID}-{Epic Name}` → `LCX-01-Auth`
- **Description** (Text): Clear purpose/scope
- **Owner** (Person): Lead developer
- **Status** (Select):
  - `Backlog`
  - `In Progress`
  - `QA Review`
  - `QA CONCERNED`
  - `QA PASS`
  - `Done`
  - `Archived`
- **GitHub Branch** (URL): Link to GitHub epic branch
- **GitHub Merge Status** (Select):
  - `Not Merged`
  - `Merged to Development`
  - `Merged to Main`
  - `Archived Reference`
- **Start Date** (Date)
- **Target Completion** (Date)
- **Actual Completion** (Date)
- **Stories Count** (Number): How many stories in this epic
- **Test Coverage** (Number): Current test coverage %
- **QA Notes** (Text): Comments from QA review
- **Knowledge Base Links** (Relation): Link to related KB articles
- **Created** (Created time)
- **Last Updated** (Last edited time)

### Epic Database Views

**1. Timeline View (Roadmap)**
- Grouped by: Start Date
- Shows: Epic name, target completion, owner
- Purpose: See project timeline at a glance

**2. Kanban View (Progress Board)**
- Grouped by: Status
- Order: Backlog → In Progress → QA Review → QA CONCERNED → QA PASS → Done → Archived
- Shows: Epic name, owner, target date, test coverage
- Purpose: Track workflow status visually

**3. Table View (Master Reference)**
- All properties visible
- Sortable by: Status, Date, Coverage
- Purpose: Detailed reference and management

**4. Calendar View (Timeline)**
- Shows: Target completion dates
- Purpose: Quick visual of deadlines

---

## Agent Prefix System for Documentation

### Documentation Naming Convention
All documentation files follow this naming pattern:
`{AGENT_PREFIX}-{DOCUMENT_NAME}.md`

### Agent Prefixes in Notion
- **Tags**: Add agent prefix as Notion database tag for filtering
- **Filename**: Use prefix for files in GitHub `/docs/` or knowledge base exports
- **Notes**: Document author in metadata/header

### Agent Prefix Reference
| Prefix | Agent | Documentation Types |
|---|---|---|
| ARCH | Project Architect | Architecture decisions, system design, tech strategy |
| BACKEND | Secure Backend Architect | API specs, database design, security documentation |
| FRONTEND | Frontend Architect | Component libraries, UI patterns, design system |
| TEST | Unit Test Architect | Testing strategies, coverage reports, test patterns |
| CODE | Code Doc Master | Code walkthroughs, complex logic explanation, refactoring notes |
| DOC | Documentation Master | Setup guides, standards, best practices, general documentation |

### Examples
- `ARCH-microservices-strategy.md`
- `BACKEND-database-schema-design.md`
- `FRONTEND-component-library.md`
- `TEST-testing-strategy.md`
- `CODE-auth-flow-explanation.md`
- `DOC-setup-guide.md`

---

## Knowledge Base Structure

### 1. Architecture Decisions Page

**Purpose**: Document major architectural choices and rationale
**Agent Prefix**: ARCH

**Template for each decision**:
- **Decision Title**: e.g., "Use React for Frontend"
- **Date**: When decision was made
- **Status**: Approved / In Discussion / Deprecated
- **Context**: Why this decision was needed
- **Rationale**: Pros/cons, alternatives considered
- **Implementation Notes**: How to use/follow this decision
- **Related Decisions**: Links to other architectural docs
- **Related Epic**: Link to epic implementing this

**Examples to create**:
- Tech stack selection (frontend, backend, database)
- Authentication approach
- API design patterns
- Database schema strategy
- Deployment architecture
- Security standards

---

### 2. Setup & Installation Guides Page

**Purpose**: Step-by-step guides for developers to get up and running
**Agent Prefix**: DOC

**Subsections**:
- **Environment Setup**
  - Prerequisites (Node version, etc.)
  - Installation steps
  - Configuration
  - Verification checklist

- **Local Development**
  - Running dev server
  - Database setup
  - API key configuration
  - Debugging tips

- **Testing Locally**
  - Running tests
  - Coverage checking
  - Test file locations

- **Building for Production**
  - Build process
  - Environment variables
  - Deployment steps

**Template for each guide**:
- Clear prerequisites
- Numbered steps with examples
- Code blocks for commands
- Troubleshooting section
- Links to related standards/best practices

---

### 3. Coding Standards Page

**Purpose**: Consistency across codebase
**Agent Prefix**: DOC (maintained by Documentation Master)

**Sections**:
- **Naming Conventions**
  - Variables, functions, classes
  - Files and folders
  - Components (if frontend)
  - Database tables/fields

- **Code Organization**
  - Folder structure patterns
  - File organization
  - Module patterns
  - Import order

- **Language-Specific Standards**
  - JavaScript/TypeScript rules
  - React patterns (if applicable)
  - Backend framework patterns
  - Database query patterns

- **Formatting**
  - Indentation (spaces/tabs)
  - Line length limits
  - Bracket style
  - Comment style

- **Git Standards** (References GITHUB-RULES.md)
  - Commit message format
  - Branch naming
  - PR descriptions

- **Testing Standards**
  - Test file naming
  - Test structure
  - Coverage minimums
  - Test categories (unit, integration, e2e)

---

### 4. Best Practices Page

**Purpose**: Patterns and anti-patterns
**Agent Prefix**: DOC (with contributions from CODE and other agents)

**Sections**:
- **Performance**
  - Database query optimization
  - Frontend optimization tips
  - Caching strategies
  - API response optimization

- **Security**
  - Input validation patterns
  - Authentication flows
  - Data encryption
  - Credential handling (what NOT to do)

- **Error Handling**
  - Error structure
  - Logging patterns
  - User-facing error messages
  - Recovery strategies

- **Code Quality**
  - DRY principles with examples
  - Single responsibility
  - Dependency injection
  - Testing best practices

- **Documentation**
  - Code comments (when to use)
  - Function documentation
  - Complex logic explanation
  - README patterns

- **Common Pitfalls**
  - "Don't commit credentials"
  - "Don't hardcode configuration"
  - "Don't skip tests"
  - "Don't merge without QA approval"

---

## Semi-Automated GitHub-Notion Integration (Claude Code Managed)

### Integration Workflow

**When Claude Code manages development** (Epic creation, PR merging, etc.):

1. **Epic Created**:
   - GitHub: `epic/LCX-01-Auth` branch created
   - Notion: New row added to Epic Database
   - Status: `Backlog` → `In Progress`
   - GitHub Branch field: Populated with branch URL

2. **Story Developed**:
   - GitHub: Commits added to epic branch
   - Notion: Status remains `In Progress`
   - Coverage: Updated as tests increase

3. **Epic Ready for Merge**:
   - GitHub: PR created (epic → development)
   - Notion: Status changes to `QA Review`
   - QA Notes: Field populated with PR link

4. **QA Decision**:
   - GitHub: QA gate reviews PR (PASS/CONCERNED/FAIL)
   - Notion: Status updated accordingly
   - QA Notes: Comments added

5. **Merged to Development**:
   - GitHub: Epic branch merged, kept as archive
   - Notion: Status → `Done`
   - GitHub Merge Status: → `Merged to Development`

6. **Released to Main**:
   - GitHub: Main merge happens (development → main)
   - Notion: All related epics status → `Done`
   - GitHub Merge Status: → `Merged to Main`

7. **Archived**:
   - GitHub: Epic branch tagged for reference
   - Notion: Status → `Archived`
   - GitHub Merge Status: → `Archived Reference`

### Claude Code Integration Points

**Claude Code will**:
- Auto-create Notion epic records when GitHub epic branches are created
- Update status fields based on GitHub PR state
- Sync test coverage data from GitHub to Notion
- Link GitHub branches to Notion epic records
- Populate QA notes from GitHub PR comments
- Mark epics as done/archived after successful merges

**Manual updates** (if status doesn't auto-sync):
- Update Notion status if GitHub state changes unexpectedly
- Add clarification notes in QA Notes field
- Update timeline dates if project scope changes

---

## Views & Dashboards

### Main Dashboard Page Layout

**Top Section: Quick Status Summary**
```
┌─────────────────────────────────────┐
│ Project Health Snapshot             │
├─────────────────────────────────────┤
│ Total Epics: 10                     │
│ In Progress: 3                      │
│ Completed: 2                        │
│ Average Coverage: 72%               │
│ Next Deadline: 2024-11-15          │
└─────────────────────────────────────┘
```

**Middle Section: Epic Timeline (Roadmap View)**
- Visual timeline of all epics
- Shows: Name, owner, start/completion dates
- Color-coded by status
- Sortable by date or epic ID

**Bottom Section: Epic Kanban (Progress Board)**
- 7 columns: Backlog | In Progress | QA Review | QA CONCERNED | QA PASS | Done | Archived
- Cards show: Epic name, owner, target date, % coverage
- Drag-and-drop to update status (optional manual override)
- Click through to full epic details

---

## Epic Detail Page (Template)

Each epic in the database has a detailed page with:

**Header**:
- Epic ID & Name (e.g., "LCX-01 Authentication")
- Status badge (color-coded)
- Owner name
- Dates: Start | Target | Actual

**Overview Section**:
- Description (full purpose & scope)
- GitHub branch link (clickable)
- Link to GitHub epic definition file

**Progress Section**:
- Test coverage % (visual progress bar)
- Stories count
- QA gate status (PASS/CONCERNED/FAIL)
- QA notes & feedback

**Technical Details**:
- Related architecture decisions (links)
- Related setup guides
- Related coding standards
- Related best practices

**Timeline**:
- Created date
- Last updated
- Projected completion
- Actual completion (when done)

**References**:
- Link back to main dashboard
- Related epics
- Knowledge base articles

---

## Knowledge Base Linking Strategy

### Cross-References

**From Epic to KB**:
- Epic page links to relevant KB articles
- Example: "Auth" epic links to "Authentication Architecture Decision", "Setup: API Keys Guide", "Security Best Practices"

**From KB to Epics**:
- KB articles link to epics implementing them
- Example: "React Setup Guide" links to "LCX-03 Frontend Framework" epic

**From KB to Standards**:
- Best practices link to relevant coding standards
- Architecture decisions link to implementation guides

---

## Maintenance & Updates

### Weekly/Sprint Review
- Review epic kanban board
- Update statuses as needed
- Check test coverage trends
- Review QA notes

### After Epic Completion
- Mark as "Done" then "Archived"
- Archive GitHub branch
- Create release notes (optional)
- Celebrate! 🎉

### Knowledge Base Maintenance
- Review KB articles quarterly
- Update setup guides with new requirements
- Add new best practices as they emerge
- Link new epics to relevant KB articles
- Deprecate outdated architecture decisions

---

## Notion Access & Permissions

### Workspace Settings
- **Access**: Private workspace
- **Owner**: Ernest
- **Viewers**: AI agents via Claude Code (read/write as needed)
- **Public pages**: None (internal only)

### Share Settings (When Needed)
- If collaborators join: Invite with Editor role
- Share specific pages only with third parties
- Keep credential pages private

---

## Integration with Other Tools

### GitHub
- Epic database linked to GitHub branches
- PRs reference Notion epic pages
- Commit messages reference epic IDs

### Claude Code
- Reads Notion epic database for context
- Updates Notion status based on GitHub activity
- Creates new epic records automatically
- Syncs test coverage data

### (Future) CI/CD Integration
- When configured: Auto-sync test results to Notion
- Auto-update coverage percentages
- Auto-notify on QA gate changes

---

## Notion Best Practices

### Database Management
- ✅ Use templates for consistent epic creation
- ✅ Keep all statuses up-to-date
- ✅ Use relations to link related items
- ✅ Archive old epics (don't delete)
- ❌ Don't create random pages outside the structure
- ❌ Don't use Notion as a chat/notes tool (use comments)

### Knowledge Base Management
- ✅ Date articles when created
- ✅ Mark status of architectural decisions
- ✅ Keep guides up-to-date with codebase
- ✅ Use clear headings and structure
- ❌ Don't leave outdated info without deprecation notice
- ❌ Don't create duplicate guides

### Linking & Organization
- ✅ Use database relations for connections
- ✅ Embed GitHub links in epic pages
- ✅ Create a consistent naming scheme
- ✅ Keep main dashboard as entry point
- ❌ Don't create orphaned pages
- ❌ Don't nest too many pages (use databases instead)

---

## Related Documentation
- GitHub workflow: `GITHUB-RULES.md`
- QA process: `QA-RULES.md` (coming next)
- Epic definitions: Repository `/epics/` folder
- Main CLAUDE.md: Project overview
