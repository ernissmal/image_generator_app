# Communication & Collaboration Rules

---

## Overview

**TL;DR**: Keep it simple, asynchronous, and documented. Claude Code reports progress via status updates. You give feedback via inline comments and merge requests.

**Verdict**: No meetings required. GitHub PRs and Notion updates are the communication channel.

---

## 1. Request & Kickoff Protocol

### TL;DR
You request work → Claude Code confirms understanding → Work begins → Status updates provided

### Verdict
All work requests happen in GitHub issues or inline comments. No ambiguity allowed.

### Summary
- Submit work requests clearly in GitHub issues or PR comments
- Include: what to build, any constraints, acceptance criteria
- Claude Code responds with confirmation of understanding
- If unclear, Claude Code asks clarifying questions before starting

### Details

**Request Format**:
```
[Task Title]

What: [What needs to be done]
Why: [Business reason / context]
Constraints: [Any limitations, tech requirements, deadlines]
Definition of Done: [How to know when complete]
```

**Example**:
```
Create user authentication epic

What: Implement email/password login system
Why: First feature for app launch
Constraints: Must use Firebase Auth, deploy to dev env
Definition of Done: User can sign up, log in, log out; tests at 85%+ coverage
```

**Claude Code Response**:
- Confirms understanding
- Clarifies any ambiguities
- Provides rough timeline estimate
- Begins work

---

## 2. Progress Communication

### TL;DR
Claude Code updates Notion and creates/updates PRs. You check progress anytime in GitHub or Notion.

### Verdict
No daily stand-ups. Pull-based communication (you check when you want). Notion is source of truth for status.

### Summary
- Claude Code updates Notion epic status as work progresses
- PRs stay updated with current progress
- You check Notion dashboard or GitHub for latest status
- No status reports sent unless you ask

### Details

**Status Update Points**:

1. **Epic Created** → Notion status: `Backlog` → `In Progress`
2. **First commit** → Notion: Coverage % starts updating
3. **PR created** → Notion status: `QA Review`
4. **QA decision** → Notion status: `QA PASS` / `QA CONCERNED` / `FAIL`
5. **Merged** → Notion status: `Done`

**Where to Check Progress**:
- **Quick snapshot**: Notion dashboard (status, coverage, timeline)
- **Detailed view**: GitHub epic branch (commits, test results)
- **PR details**: GitHub PR (code changes, test output)

**If You Ask for Status Update**:
Claude Code provides concise summary:
```
Epic: LCX-01-Auth
Status: In Progress (60% coverage)
Next: Completing OAuth integration
Expected completion: 2024-11-20
Blockers: None
```

---

## 3. Feedback & Code Review

### TL;DR
You comment on PRs → Claude Code responds and iterates. Comments can be inline or in PR description.

### Verdict
All feedback happens in GitHub. No separate emails or messages needed.

### Summary
- Review code and tests in GitHub PRs
- Leave comments on specific lines
- Mark PR as "Changes Requested" if major revisions needed
- Mark as "Approved" when ready to merge
- Claude Code iterates based on feedback

### Details

**Feedback Types**:

**1. Request Changes**
```
GitHub PR Comment:
"This function needs error handling. What happens if the API times out?"

Claude Code: Updates code, responds with solution
```

**2. Suggest Improvement**
```
GitHub PR Comment:
"Consider using const instead of let here for immutability"

Claude Code: Makes change or explains why not, responds
```

**3. Question/Clarification**
```
GitHub PR Comment:
"Why did you choose this approach over X?"

Claude Code: Explains rationale, updates code if needed
```

**4. Approve**
```
GitHub PR Review:
Approve button + optional comment: "Looks good!"

Claude Code: Proceeds to merge (after QA gate)
```

**Comment Conventions**:
- Be specific (reference line numbers)
- Keep tone constructive
- One comment per issue
- Use GitHub suggestions for small fixes

---

## 4. Blocking Issues & Escalation

### TL;DR
Claude Code gets stuck → Claude Code reports blocker → You decide: unblock or pivot

### Verdict
No silent failures. Blockers reported immediately as GitHub issue or PR comment.

### Summary
- Claude Code identifies blockers (missing info, dependencies, conflicts)
- Reports blocker clearly with:
  - What's blocked
  - Why it's blocked
  - What's needed to unblock
- You decide: provide info, change scope, or accept delay

### Details

**Blocker Report Format**:
```
GitHub Issue / PR Comment:

🚫 BLOCKER: [Clear title]

Current Status: [Where we are in the work]
What's Blocked: [What can't proceed]
Root Cause: [Why it's blocked]
Options:
  1. [Option A + impact]
  2. [Option B + impact]
  3. [Option C + impact]

Recommendation: [Claude Code's suggestion]
```

**Example**:
```
🚫 BLOCKER: Need API credentials for payment processor

Current Status: Building payment integration (LCX-05)
What's Blocked: Can't test payment flow without live API key
Root Cause: .env.local not configured with Stripe key
Options:
  1. Provide Stripe test API key (unblocks immediately)
  2. Mock payment API in tests (delays real integration testing)
  3. Skip payment feature for now (scope change)

Recommendation: Option 1 - provide key. Takes 2 min, unblocks all work.
```

**Your Response Options**:
- ✅ Provide info needed → Claude Code continues
- 🔄 Change scope → Claude Code pivots to different work
- ⏸️ Accept delay → Work pauses, continues when unblocked

---

## 5. QA & Testing Communication

### TL;DR
Claude Code runs tests, reports coverage. You approve (or request changes) via GitHub PR review.

### Verdict
All QA communication through GitHub PR status checks and comments.

### Summary
- Tests auto-run on all PRs
- Coverage % displayed in PR
- Claude Code provides test summary in PR description
- You review test results and approve/request changes
- QA gate status (PASS/CONCERNED) determined by you in PR review

### Details

**PR Description Template** (filled by Claude Code):

```markdown
## Summary
[What this PR does]

## Changes
- [Change 1]
- [Change 2]

## Tests
✅ Unit tests: 45 tests passing
✅ Integration tests: 12 tests passing
📊 Coverage: 65% (target: 60%)

## Test Results
- All critical paths tested
- Edge cases covered: [list]
- Performance impact: None

## QA Checklist
- [ ] Code matches standards
- [ ] Tests are meaningful
- [ ] No hardcoded credentials
- [ ] Documentation updated

## Related Epic
Closes: LCX-01-Auth
```

**Your QA Gate Decision**:

**PASS** (approve):
```
GitHub Review: Approve
"✅ Looks good. Ready to merge."
```

**CONCERNED** (approve with notes):
```
GitHub Review: Comment
"⚠️ CONCERNED - Minor issues but acceptable:
- [Issue 1]: [Explanation]
- [Issue 2]: [Explanation]
Proceed, but address these next time."
```

**FAIL** (request changes):
```
GitHub Review: Request Changes
"❌ FAIL - Blockers:
- Coverage below 60%
- Missing edge case test
Fix these before merge."
```

---

## 6. Documentation Sync & Agent Prefixes

### TL;DR
Code changes → GitHub updated with [AGENT] prefix → Notion tagged → KB updated by appropriate agent

### Verdict
Single source of truth: GitHub repo. Notion mirrors it. All docs tagged with agent prefix for traceability.

### Summary
- Code is always source of truth
- All commits include [AGENT_PREFIX] for traceability
- Epic definitions kept in `/epics/{EPIC}.md` files in repo
- Notion database auto-syncs with GitHub (via Claude Code)
- Notion KB articles tagged with agent prefix
- Documentation files follow `{AGENT_PREFIX}-{name}.md` convention

### Agent Prefix System

**Six Agent Types**:
- **[ARCH]** - Project Architect (architecture, tech decisions, system design)
- **[BACKEND]** - Secure Backend Architect (APIs, databases, security)
- **[FRONTEND]** - Frontend Architect (UI/UX, components, frontend architecture)
- **[TEST]** - Unit Test Architect (tests, coverage, testing strategies)
- **[CODE]** - Code Doc Master (code review, documentation, complex logic)
- **[DOC]** - Documentation Master (guides, standards, general documentation)

**Where Prefixes Appear**:
- **GitHub**: Commit messages → `[ARCH] LCX-01: Add system design`
- **Notion**: KB articles tagged with agent prefix
- **Filenames**: Docs → `ARCH-authentication-strategy.md`

### Details

**Documentation Update Flow**:

1. **Code changes** → Committed to GitHub with [AGENT_PREFIX]
2. **Epic definitions** → Updated in `/epics/{EPIC}.md`
3. **Notion database** → Claude Code syncs status/coverage
4. **Knowledge Base** → Updated with agent-tagged articles
5. **CLAUDE.md** → Review quarterly, update if major changes

**What Gets Updated Where**:

| Change | Location | Agent | When |
|---|---|---|---|
| Code implementation | GitHub repo | Relevant | Continuously |
| Epic definition | `/epics/*.md` | ARCH/DOC | Epic creation + changes |
| Epic status/progress | Notion database | Any | After GitHub state change |
| Architecture docs | Notion KB (tagged ARCH) | ARCH | Major design decisions |
| API documentation | Notion KB (tagged BACKEND) | BACKEND | API changes |
| Component library | Notion KB (tagged FRONTEND) | FRONTEND | UI changes |
| Test strategies | Notion KB (tagged TEST) | TEST | Testing changes |
| Code walkthroughs | Notion KB (tagged CODE) | CODE | Complex logic |
| General guides | Notion KB (tagged DOC) | DOC | Setup, standards |
| Project overview | CLAUDE.md | DOC | Quarterly review |

**Sync Checklist** (Claude Code confirms):
- ✅ Epic created in `/epics/` folder
- ✅ Commit message includes [AGENT_PREFIX]
- ✅ Epic record created in Notion
- ✅ GitHub branch created
- ✅ Notion links to GitHub
- ✅ Agent tag added to Notion KB articles
- ✅ Status in sync

**Traceability Benefits**:
- Know which agent wrote each piece of code/doc
- Filter Notion KB by agent type
- Track agent expertise and contributions
- Easy to find documentation by responsible party

---

## 7. Daily/Weekly Rhythms

### TL;DR
No daily meetings. Check Notion dashboard whenever you want. Weekly: review epics in progress.

### Verdict
Asynchronous by default. You pull information when needed.

### Summary
- Check Notion dashboard anytime for project health
- Weekly: Spend 15 min reviewing epic kanban
- No daily stand-ups
- Only meet/message if blocker needs decision

### Details

**Weekly Review** (suggested, not required):
```
Time: 15 minutes, whenever suits you
Location: Notion dashboard

Check:
1. Are any epics blocked? (filter by status)
2. Is test coverage trending up? (check coverage %)
3. Are deadlines on track? (review dates)
4. Any QA concerns? (read QA Notes field)

Action:
- If blocker: Comment on GitHub to respond
- If off-track: Discuss scope with Claude Code
- If all good: No action needed
```

**When to Check GitHub**:
- Want to see actual code changes: GitHub repo
- Want to review PR: When Claude Code mentions it
- Want commit history: GitHub branch commits

**When to Check Notion**:
- Quick project health snapshot: Notion dashboard
- See all epics and status: Notion kanban
- Detailed epic info: Notion epic page

---

## 8. Edge Cases & Special Situations

### TL;DR
Unexpected issues → Reported immediately with context → You decide next steps

### Verdict
No silent failures. Always communicate problems explicitly.

### Summary
- Breaking changes: Report immediately with impact
- Test failures: Root cause + recovery plan
- Merge conflicts: Report with resolution approach
- Security concerns: Flag immediately

### Details

**Breaking Changes** (e.g., database schema change):
```
GitHub Issue / PR Comment:

⚠️ BREAKING CHANGE: Database migration required

What changed: User table schema (new auth_method column)
Impact: Existing deployments won't work without migration
Recovery: Run migration script in `/scripts/migrate-v1.1.sql`
Risk: Low (additive change, nullable field)
Recommendation: Include in next release, notify users
```

**Test Failures** (unexpected):
```
GitHub PR Comment:

🔴 Test Failure: Payment integration test

Test: test_process_payment_with_timeout
Failure: "Expected true but got false"
Root Cause: Mock API not handling timeout correctly
Fix: Updated mock to simulate network delay
New status: ✅ Test now passing
```

**Merge Conflicts**:
```
GitHub PR Status:

⚠️ CONFLICT: Can't merge - conflict with main branch

Files: src/api/auth.ts (lines 45-67)
Cause: Both branches modified authentication logic
Resolution: Merging development changes, keeping new OAuth logic
Action: Conflict resolved, ready for review
```

**Security Concern**:
```
GitHub PR Comment:

🔒 SECURITY: API key potentially exposed in logs

Issue: Database password logged in error message
Severity: High - credentials visible in production logs
Fix: Remove password from error, log generic message
Status: ✅ Fixed in latest commit
```

---

## 9. Collaboration Style

### TL;DR
Clear, direct communication. Assume good intent. Async first. Synchronous only for blockers.

### Verdict
Efficiency over formality. Focus on work, not process.

### Summary
- Be specific in requests and feedback
- Comments should be constructive
- Assume Claude Code is doing its best
- Use code/PRs as primary communication medium
- Save meeting time for actual blockers

### Details

**Good Communication Examples**:

✅ **Clear Request**:
```
"Add validation that email is unique before signup.
Reference the validator in src/utils/validators.ts"
```

❌ **Vague Request**:
```
"Make the auth better"
```

---

✅ **Constructive Feedback**:
```
"This function is 80 lines - consider splitting it.
Suggestion: Extract password validation to separate function"
```

❌ **Harsh Feedback**:
```
"This is too long. Fix it."
```

---

✅ **Clear Blocker**:
```
"Need AWS credentials to complete payment integration testing.
Can you provide AWS_SECRET_KEY for test account?"
```

❌ **Vague Blocker**:
```
"Something's not working, need help"
```

---

## 10. Related Documents

### TL;DR
Three rule files work together. GitHub for code, Notion for tracking, this file for communication.

**The Three Rules**:
1. **GITHUB-RULES.md** → How to branch, commit, merge
2. **NOTION-RULES.md** → How to track progress
3. **COMMUNICATION-RULES.md** (this) → How we talk about work

**Also Reference**:
- **CLAUDE.md** → Project overview
- **QA-RULES.md** → Testing standards (if created)
- **Epic definitions** → `/epics/{EPIC_ID}-{Name}.md`

---

## Summary Checklist

When requesting work:
- [ ] Clear what/why/when
- [ ] Acceptance criteria defined
- [ ] Constraints listed

When reviewing work:
- [ ] Check PR description
- [ ] Review code changes
- [ ] Verify test coverage
- [ ] Check for credentials
- [ ] Approve or request changes

When blocked:
- [ ] Report immediately
- [ ] Explain what/why/how to fix
- [ ] Provide options
- [ ] Wait for decision

When syncing:
- [ ] Code committed to GitHub
- [ ] Epic definition updated
- [ ] Notion status synced
- [ ] No duplicate info in different places
