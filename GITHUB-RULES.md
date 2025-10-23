# GitHub Workflow & Branching Rules

## Branch Structure

```
main (Production)
  └── development (Staging/Testing)
        └── epic/{ORG_PREFIX}-{EPIC_ID}-{Feature}
              └── story branches (only for high-complexity stories)
  └── hotfix/{HOTFIX_ID}-{Description}
```

### Branch Naming Convention

- **Main**: `main` (protected, production-ready code)
- **Development**: `development` (protected, integration branch for epics)
- **Epic**: `epic/LCX-01-Auth` (all stories for this epic developed here)
- **Story**: `epic/LCX-01-Auth/story/login-oauth` (only for high-complexity stories)
- **Hotfix**: `hotfix/URGENT-payment-bug` (critical production fixes)

## Epic Definition

### Epic Naming & Structure
- **Format**: `{ORG_PREFIX}-{EPIC_ID}-{Feature}`
- **Example**: `LCX-01-Auth`, `LCX-02-ImageGeneration`, `LCX-03-UserProfiles`
- **Prefix**: Use your organization prefix (e.g., LCX = LuceneX)

### Epic Definition File
- **Location**: Repository root in `/epics/` folder
- **Format**: Markdown file named `{EPIC_NAME}.md`
- **Example**: `/epics/LCX-01-Auth.md`

### Epic Definition File Content
- Clear purpose & scope
- List all stories within the epic
- Owner/Lead assignee
- Timeline/target completion date
- Link to corresponding Notion page
- High-level acceptance criteria

### Epic Lifecycle
- **Active**: Develops on its own branch (`epic/{EPIC_NAME}`)
- **Merged to main**: Epic branch is kept as **archive/reference** (not deleted)
- **Branch archival**: Tag the final commit with version/release info

## Story Management

### Story File Naming & Location
- **Location**: Within the epic branch (no separate folder required)
- **Format**: Commit messages reference story scope
- **Example commit**: `LCX-01: Implement OAuth login provider`

### Story Complexity Classification

**Low-to-Medium Complexity** (60% of work)
- Commit directly to epic branch
- No separate story branch needed
- Clear commit messages explaining changes

**High Complexity** (40% of work)
- Create dedicated story branch: `epic/{EPIC_NAME}/story/{story-name}`
- Open PR to merge into epic branch
- Requires same QA gate review as epic merge (CONCERNED or PASS)
- Complexity indicators:
  - Cross-epic dependencies
  - Major architectural changes
  - Multiple subsystems involved
  - Estimated 16+ hours of work
  - Significant risk or uncertainty

## Commit Message Guidelines

### Format
`[{AGENT_PREFIX}] {EPIC_ID}: {Short, self-explanatory summary}`

### Agent Prefixes
Agent prefixes identify which AI agent created or modified the code/docs:

| Prefix | Agent | Responsibility |
|---|---|---|
| ARCH | Project Architect | System design, tech decisions, architecture |
| BACKEND | Secure Backend Architect | API design, database, security implementation |
| FRONTEND | Frontend Architect | UI/UX, component design, frontend architecture |
| TEST | Unit Test Architect | Testing strategies, test implementation, coverage |
| CODE | Code Doc Master | Code review, documentation, complex logic explanation |
| DOC | Documentation Master | General docs, guides, updates |

### Examples
- `[ARCH] LCX-01: Add OAuth login form validation`
- `[FRONTEND] LCX-02: Implement image uploader component`
- `[BACKEND] LCX-03: Create user profile database schema`
- `[TEST] LCX-01: Fix password reset email delivery`
- `[CODE] LCX-05: Refactor payment processor for clarity`

### Rules
- Keep messages short (50-72 characters preferred after prefix)
- Capitalize first letter after colon
- Be specific about what changed and why
- No generic messages like "Update files" or "Bug fix"
- Always include agent prefix for traceability
- Link to Notion story if relevant

## Pull Request & Merge Rules

### Feature/Story → Epic Branch
**Requirements**:
- ✅ Minimum 60% test coverage
- ✅ All tests passing
- ✅ QA gate: CONCERNED or PASS
- ✅ No sensitive credentials or configs
- ✅ Code review (peer recommended, not required)

**Merge Strategy**: Squash commits preferred to keep epic history clean

---

### Epic → Development Branch
**Requirements**:
- ✅ Minimum 60% test coverage
- ✅ All tests passing
- ✅ QA gate: CONCERNED or PASS
- ✅ No sensitive credentials or configs
- ✅ Owner sign-off on epic completion
- ✅ Integration testing passed

**Merge Strategy**: Merge commit to preserve epic history

**Post-Merge**:
- Epic branch kept as archive (tagged for reference)
- Not deleted from repository

---

### Development → Main Branch (Release)
**Requirements**:
- ✅ **Minimum 90% test coverage** (strict requirement)
- ✅ **All tests PASSED** (no failures)
- ✅ **QA gate: PASS only** (CONCERNED blocks merge)
- ✅ **Zero sensitive credentials/configs** (automated + manual scan)
- ✅ **Security review completed**
- ✅ **Release notes documented**
- ✅ **Version bump applied** (semantic versioning)

**Merge Strategy**: Merge commit with release tag

**Post-Merge**:
- Automatically triggers production deployment (if CI/CD configured)
- Tag format: `v{MAJOR}.{MINOR}.{PATCH}`
- Example: `v1.2.3`

---

### Hotfix → Main Branch
**Requirements**:
- ✅ **Minimum 90% test coverage** (same as main merges)
- ✅ **All tests PASSED**
- ✅ **QA gate: PASS only**
- ✅ **No sensitive credentials/configs**
- ✅ **Critical issue documentation**
- ✅ **Urgent approval from tech lead**

**Post-Merge**:
- Hotfix branch deleted after merge
- Tagged with hotfix version (e.g., `v1.2.4-hotfix`)
- **Must be merged back to development** immediately after main merge

---

## Branch Protection Rules

### Main Branch
- ✅ Require pull request reviews before merge
- ✅ Require status checks to pass (tests, linting, security scan)
- ✅ Require test coverage ≥ 90%
- ✅ Dismiss stale PR approvals
- ✅ Require code owner review (if code owners file exists)
- ✅ Allow force pushes: **NO**
- ✅ Allow deletions: **NO**

### Development Branch
- ✅ Require pull request reviews before merge
- ✅ Require status checks to pass (tests, linting)
- ✅ Require test coverage ≥ 60%
- ✅ Allow force pushes: **NO**
- ✅ Allow deletions: **NO**

### Epic Branches
- ⚠️ Recommended protections (not enforced):
  - Require test coverage ≥ 60%
  - Allow force pushes: **NO** (prevents accidental overwrites)

### Hotfix Branches
- ⚠️ No protection (to allow rapid fixes)
- ✅ Delete after merge to main & development

---

## Test Coverage Requirements Summary

| Branch Target | Min Coverage | Test Status | QA Gate |
|---|---|---|---|
| Epic ← Story | 60% | PASS | CONCERNED or PASS |
| Development ← Epic | 60% | PASS | CONCERNED or PASS |
| Main ← Development | **90%** | PASS | **PASS only** |
| Main ← Hotfix | **90%** | PASS | **PASS only** |

---

## Credential & Security Scanning

### Automated Checks
- Pre-commit hooks scan for common patterns (API keys, tokens, etc.)
- CI/CD pipeline runs secret scanning before merge
- Blocks merge if credentials detected

### Manual Review
- Code reviewer checks for hardcoded configs
- Environment variables never committed to repo
- All secrets stored in `.env.local` (gitignored)

### Sensitive Items to Avoid
- AWS keys, GCP keys, Azure credentials
- API tokens (OpenAI, external services)
- Database connection strings
- Private encryption keys
- Personal authentication tokens

---

## Workflow Summary

### For Developers

1. **Creating a new epic**:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b epic/LCX-01-Auth
   ```
   - Create `/epics/LCX-01-Auth.md` with epic definition
   - Commit and push

2. **Adding a low-complexity story**:
   ```bash
   git checkout epic/LCX-01-Auth
   git pull origin epic/LCX-01-Auth
   # Make changes
   git add .
   git commit -m "LCX-01: Add login form validation"
   git push origin epic/LCX-01-Auth
   ```

3. **Adding a high-complexity story**:
   ```bash
   git checkout -b epic/LCX-01-Auth/story/oauth-provider
   # Make changes
   git add .
   git commit -m "LCX-01: Implement OAuth provider integration"
   git push origin epic/LCX-01-Auth/story/oauth-provider
   # Open PR to epic/LCX-01-Auth branch
   ```

4. **Merging epic to development** (when epic complete):
   - Open PR from `epic/LCX-01-Auth` → `development`
   - Ensure 60% coverage, tests pass, QA PASS/CONCERNED
   - Merge and keep epic branch

5. **Merging development to main** (release):
   - Open PR from `development` → `main`
   - Ensure 90% coverage, tests pass, QA PASS (strict)
   - Merge with release tag

6. **Hotfix workflow** (critical production issue):
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/URGENT-payment-bug
   # Fix issue
   git add .
   git commit -m "LCX-00: Fix payment processing timeout"
   git push origin hotfix/URGENT-payment-bug
   # Open PR to main
   # After merge: merge back to development
   git checkout development
   git pull origin hotfix/URGENT-payment-bug
   git merge hotfix/URGENT-payment-bug
   ```

---

## CI/CD Integration (Ready for Implementation)

When GitHub Actions or equivalent is configured:
- Auto-run tests on PR creation
- Auto-check test coverage
- Auto-scan for secrets
- Auto-run linting
- Auto-deploy development to staging
- Auto-deploy main to production

---

## Status Indicators & QA Gates

### QA Gate Statuses
- **PASS**: All quality checks passed, safe to merge
- **CONCERNED**: Minor issues present, merge allowed with acknowledgment
- **FAIL**: Critical issues present, blocks merge until resolved

### Quality Checks (TBD - To be detailed in QA ruleset)
- Code coverage thresholds
- Linting compliance
- Security vulnerabilities
- Performance benchmarks
- Type safety (TypeScript/similar)

---

## Related Documentation
- Epic definitions: `/epics/`
- Notion workspace: [Add your Notion URL]
- CI/CD configuration: `.github/workflows/`
- QA Rules: `QA-RULES.md` (coming next)
- Notion Rules: `NOTION-RULES.md` (coming next)
