# Project Cleanup & Restructure Plan

**Created**: 2025-11-04
**Purpose**: Eliminate "cluttered junk" and streamline codebase to focus on core table environment generation workflow

---

## Current State Assessment

### Core Workflow (NEW - KEEP)
The project's actual purpose is:
1. User uploads clean pictures of tables
2. App generates 6 images in selected environment (Modern, Rustic, London, Urban, Nature)
3. App uses random angles for each image to prevent "too perfect" look
4. User clicks to select/deselect generated images
5. User clicks "Generate Missing" (if <6 selected) or "Download All" (if 6 selected)

### Files That Support Core Workflow ✅

**Frontend**:
- `prototype/table-environment-generator.html` - **PRIMARY UI**
- `prototype/index.html` - **NEEDS UPDATE** to point to table-environment-generator

**Backend Routes**:
- `src/routes/table-environment.js` - **CORE FEATURE** (generate 6 images with random angles)
- `src/routes/reference-products.js` - **SUPPORTING** (lists table gallery)
- `src/routes/upload.js` - **SUPPORTING** (handles table photo uploads)
- `src/routes/health.js` - **UTILITY** (health checks)

**Services**:
- `src/services/gemini-client.js` - **CORE** (AI generation)
- `src/services/prompt-template-loader.js` - **CORE** (loads angle templates)

**Prompts**:
- `prompts/angle-generation/*.json` - **CORE** (all 9 angle templates)

**Documentation**:
- `docs/PROMPT_IMPROVEMENTS_2025.md` - **CURRENT** (prompt engineering guide)
- `docs/brief.md` - **PLANNING** (project overview)
- `docs/prd.md` - **PLANNING** (product requirements)

---

## Files to Archive/Remove 🗑️

### Obsolete Prototypes
These are old testing UIs that don't match the current workflow:

1. **`prototype/nano-banana.html`**
   - Purpose: Early testing prototype
   - Status: Superseded by table-environment-generator.html
   - Action: **ARCHIVE** to `archive/prototype/`

2. **`prototype/ecommerce-studio.html`**
   - Purpose: Old e-commerce prototype
   - Status: Not part of core workflow
   - Action: **ARCHIVE** to `archive/prototype/`

3. **`prototype/product-angle-generator.html`**
   - Purpose: Manual angle selection UI
   - Status: Superseded by automatic random angle selection
   - Action: **ARCHIVE** to `archive/prototype/`

### Obsolete Routes
These backend routes aren't used by the core workflow:

4. **`src/routes/nano-banana.js`**
   - Purpose: Old testing route
   - Status: Not used by table-environment-generator
   - Action: **ARCHIVE** to `archive/routes/`

5. **`src/routes/ecommerce.js`**
   - Purpose: Old e-commerce route
   - Status: Not used by table-environment-generator
   - Action: **ARCHIVE** to `archive/routes/`

6. **`src/routes/generate-angles.js`** ⚠️ **DECISION NEEDED**
   - Purpose: Manual angle generation (user selects specific angles)
   - Status: Not core workflow, but might be useful for future features
   - Options:
     - A) Archive if not needed
     - B) Keep if it might be reused
   - Recommendation: **ARCHIVE** (can restore from git if needed)

### Obsolete Documentation
These docs describe features that no longer exist:

7. **`docs/PRODUCT_ANGLE_GENERATOR_GUIDE.md`**
   - Purpose: Documents manual angle selection workflow
   - Status: Describes obsolete feature
   - Action: **ARCHIVE** to `archive/docs/`

8. **`docs/GALLERY_FEATURE_GUIDE.md`**
   - Purpose: Documents old gallery with upload toggle
   - Status: Gallery now integrated into table-environment workflow differently
   - Action: **ARCHIVE** to `archive/docs/`

9. **`docs/NANO_BANANA_GUIDE.md`**
   - Purpose: Early API testing guide
   - Status: May be outdated, needs review
   - Action: **REVIEW** then archive if obsolete

10. **`docs/epic-ai-angle-generation.md`**
    - Purpose: Planning document for angle generation
    - Status: Feature now implemented
    - Action: **ARCHIVE** to `archive/docs/`

11. **`docs/COMPETITOR-ANALYSIS.md`**
    - Purpose: Competitor research
    - Status: May still be relevant for reference
    - Action: **KEEP** (market research is timeless)

12. **`docs/AGENT-COORDINATION.md`**
    - Purpose: Unknown (needs review)
    - Action: **REVIEW** then decide

---

## Cleanup Actions

### Step 1: Create Archive Structure
```bash
mkdir -p archive/prototype
mkdir -p archive/routes
mkdir -p archive/docs
```

### Step 2: Archive Obsolete Prototypes
```bash
mv prototype/nano-banana.html archive/prototype/
mv prototype/ecommerce-studio.html archive/prototype/
mv prototype/product-angle-generator.html archive/prototype/
```

### Step 3: Archive Obsolete Routes
```bash
mv src/routes/nano-banana.js archive/routes/
mv src/routes/ecommerce.js archive/routes/
mv src/routes/generate-angles.js archive/routes/  # If decision is to archive
```

### Step 4: Archive Obsolete Documentation
```bash
mv docs/PRODUCT_ANGLE_GENERATOR_GUIDE.md archive/docs/
mv docs/GALLERY_FEATURE_GUIDE.md archive/docs/
mv docs/epic-ai-angle-generation.md archive/docs/
# Review NANO_BANANA_GUIDE.md and AGENT-COORDINATION.md first
```

### Step 5: Update Server Configuration
Remove archived routes from `src/server.js`:
```javascript
// REMOVE these lines:
const nanoBananaRoutes = require('./routes/nano-banana');
const ecommerceRoutes = require('./routes/ecommerce');
const generateAnglesRoutes = require('./routes/generate-angles'); // If archived

app.use(nanoBananaRoutes);
app.use(ecommerceRoutes);
app.use(generateAnglesRoutes); // If archived
```

### Step 6: Update Index Page
Update `prototype/index.html` to point users to the correct tool:
```html
<a href="/table-environment-generator.html">
  Table Environment Generator - MAIN TOOL
</a>
```

### Step 7: Create New Master Documentation
Create `docs/TABLE_ENVIRONMENT_GENERATOR.md` to replace obsolete guides with current workflow documentation.

---

## Post-Cleanup File Structure

```
image_generator_app/
├── src/
│   ├── routes/
│   │   ├── health.js                    ✅ KEEP
│   │   ├── upload.js                    ✅ KEEP
│   │   ├── reference-products.js        ✅ KEEP
│   │   └── table-environment.js         ✅ KEEP - CORE FEATURE
│   ├── services/
│   │   ├── gemini-client.js             ✅ KEEP
│   │   └── prompt-template-loader.js    ✅ KEEP
│   └── server.js                        ✅ UPDATE (remove archived routes)
├── prototype/
│   ├── index.html                       ✅ UPDATE (point to table-environment)
│   └── table-environment-generator.html ✅ KEEP - PRIMARY UI
├── prompts/
│   └── angle-generation/                ✅ KEEP ALL (9 templates)
├── docs/
│   ├── brief.md                         ✅ KEEP
│   ├── prd.md                           ✅ KEEP
│   ├── COMPETITOR-ANALYSIS.md           ✅ KEEP
│   ├── PROMPT_IMPROVEMENTS_2025.md      ✅ KEEP
│   └── TABLE_ENVIRONMENT_GENERATOR.md   ✅ CREATE NEW
├── archive/
│   ├── prototype/
│   │   ├── nano-banana.html
│   │   ├── ecommerce-studio.html
│   │   └── product-angle-generator.html
│   ├── routes/
│   │   ├── nano-banana.js
│   │   ├── ecommerce.js
│   │   └── generate-angles.js
│   └── docs/
│       ├── PRODUCT_ANGLE_GENERATOR_GUIDE.md
│       ├── GALLERY_FEATURE_GUIDE.md
│       └── epic-ai-angle-generation.md
├── references/
│   └── products/                        ✅ KEEP (6 table images)
├── uploads/                             ✅ KEEP (user uploads)
└── generated/                           ✅ KEEP (AI outputs)
```

---

## Benefits of Cleanup

### For Developers:
✅ **Clear Focus** - Only files related to core workflow remain
✅ **Faster Navigation** - No confusion about which prototype to use
✅ **Clean Routes** - Server only loads necessary endpoints
✅ **Updated Docs** - Documentation matches actual implementation

### For Users:
✅ **Single Entry Point** - Clear path to the tool (table-environment-generator.html)
✅ **No Dead Ends** - No links to obsolete features
✅ **Faster Loading** - Fewer routes = faster server startup

### For Maintenance:
✅ **Version Control** - Archive preserves history without cluttering active codebase
✅ **Easy Recovery** - Files in archive/ can be restored if needed
✅ **Git History** - Everything still in git if we need to reference old implementations

---

## Risks & Mitigations

### Risk 1: Accidentally removing needed code
**Mitigation**: Archive instead of delete. Everything goes to `archive/` folder.

### Risk 2: Breaking existing links
**Mitigation**: Update `index.html` to redirect users to correct tool.

### Risk 3: Losing historical context
**Mitigation**: Git history preserves everything. Archive folder keeps recent versions accessible.

---

## Execution Checklist

- [ ] Create archive directory structure
- [ ] Archive obsolete prototypes (3 files)
- [ ] Archive obsolete routes (2-3 files)
- [ ] Archive obsolete docs (3-4 files)
- [ ] Update `src/server.js` to remove archived routes
- [ ] Update `prototype/index.html` to point to table-environment-generator
- [ ] Create new `docs/TABLE_ENVIRONMENT_GENERATOR.md` master documentation
- [ ] Test server starts without errors
- [ ] Test table-environment-generator.html loads correctly
- [ ] Test complete workflow (upload → generate → select → download)
- [ ] Commit cleanup changes to git

---

## Timeline

**Estimated Time**: 30 minutes

1. **Archive files** (5 min)
2. **Update server.js** (5 min)
3. **Update index.html** (5 min)
4. **Create new documentation** (10 min)
5. **Testing** (5 min)

---

## Approval Required

**Before executing cleanup, confirm**:
1. ✅ Archive `prototype/product-angle-generator.html`?
2. ✅ Archive `src/routes/generate-angles.js`?
3. ✅ Archive old documentation files?

**User Decision Needed**: Should we archive `generate-angles.js` or keep it for potential future use?

---

**Status**: ⏳ Awaiting approval to execute
**Next Step**: Review this plan and execute cleanup
