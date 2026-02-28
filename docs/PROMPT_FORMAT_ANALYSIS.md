# Prompt Format Analysis: JSON vs Markdown vs Plain Text

**Date**: 2025-11-17
**Issue**: Confusion between JSON prompts, Markdown prompts, and actual API format
**Conclusion**: API uses **plain text strings** - JSON and Markdown are just storage formats

---

## 🔍 Investigation Results

### How the Gemini API Actually Receives Prompts

I analyzed your codebase and found the **actual API calls**:

#### 1. Production API Call (geminiService.js)

```javascript
// TURN 1: Surface reference (PLAIN TEXT STRING)
await chat.sendMessage([
  {
    text: "This is the tabletop surface I want to use..." // ← PLAIN TEXT
  },
  {
    inlineData: {
      mimeType: tableSurfaceFile.type,
      data: tableSurfaceB64
    }
  }
]);

// TURN 2: Clean product (PLAIN TEXT STRING with variables substituted)
const cleanPrompt = buildCleanPrompt({...}); // Returns plain text string

const response = await chat.sendMessage([
  {
    text: cleanPrompt  // ← PLAIN TEXT STRING
  },
  {
    inlineData: { ... }
  }
]);
```

#### 2. Nano Banana Client (nano-banana-client.js)

```javascript
const result = await this.model.generateContent({
  contents: [{
    role: 'user',
    parts: [{ text: enhancedPrompt }]  // ← PLAIN TEXT STRING
  }],
  generationConfig: { ... }
});
```

### ✅ ANSWER: The API Expects **Plain Text Strings**

The Gemini API (`@google/generative-ai`) expects prompts as **plain text strings** in the `text` field.

**JSON and Markdown are just storage/organization formats** - they get converted to plain text before being sent to the API.

---

## 📁 Current Prompt Storage Formats

### Format 1: JSON Files (angle-generation/)

**Location**: `prompts/angle-generation/*.json`
**Example**: `angle-0deg.json`

```json
{
  "id": "angle-0deg-top",
  "version": "1.1.0",
  "angle_type": "0deg",
  "prompt": {
    "system": "You are a master photographer...",
    "user": "Photograph {product_name} from...",
    "negative": "Avoid blurred areas..."
  },
  "parameters": {
    "temperature": 0.3,
    "top_p": 0.8
  }
}
```

**Purpose**:
- Structured data with metadata
- Includes system/user/negative prompts separately
- Stores model parameters
- Version tracking

**Used By**: `prompt-template-loader.js` (loads and processes these)

**Converted To**: Plain text string before API call

---

### Format 2: Markdown Files (lifestyle_photography/, clean_photography/)

**Location**: `prompts/lifestyle_photography/*.md`, `prompts/clean_photography/*.md`

**Example**: `lifestyle_scenes.md`

```markdown
## Scene 1: Dining Room - Morning Breakfast

Create a photorealistic lifestyle image of the table set for a morning breakfast...

Styling & Props (on table):
- White ceramic plates with gold rim
- Fresh croissants and pastries
...
```

**Purpose**:
- Human-readable documentation
- Category descriptions
- Reference for prompt engineering
- Guidelines and best practices

**Used By**: Humans reading/editing prompts (NOT directly by code)

**Status**: **NOT USED BY API** - these are documentation/templates

---

### Format 3: Plain Text Strings in JS (src/config/prompts.js)

**Location**: `src/config/prompts.js`

```javascript
export const PROMPTS = {
  surfaceReference: `This is the tabletop surface...`,  // Plain text

  cleanPhotography: {
    base: `Generate professional product photography...
Replace this table category's tabletop...
Use {legStyle} legs.`  // Plain text with variables
  }
};
```

**Purpose**:
- **PRODUCTION CODE** - actually used by API
- Plain text strings ready for API
- Variable substitution with `{variableName}`
- No metadata, just the prompt text

**Used By**:
- `geminiService.js` (calls `buildCleanPrompt()`, `buildLifestylePrompt()`)
- Directly sent to API

**Status**: ✅ **THIS IS WHAT THE API USES**

---

## 🎯 The Confusion Explained

### Why JSON Files Exist (`prompts/angle-generation/`)

These were created as **templates** with structure:
- **Purpose**: Exploratory work for angle variations
- **Status**: NOT used in production (not referenced by `geminiService.js`)
- **Format**: Structured data for potential future use
- **Contains**: System prompts, negative prompts, parameters

**They are NOT sent to the API directly** - they would need to be loaded by `prompt-template-loader.js` and converted to plain text.

---

### Why Markdown Files Exist (`prompts/lifestyle_photography/`)

These are **documentation and templates**:
- **Purpose**: Reference for humans, prompt engineering guide
- **Status**: NOT used in production code
- **Format**: Human-readable guidelines
- **Contains**: Detailed scene descriptions, prop lists, best practices

**They are NOT sent to the API** - they're for documentation/reference.

---

### What's Actually Used in Production

**`src/config/prompts.js`** - Plain text strings:
- ✅ Used by `geminiService.js`
- ✅ Directly converted to API format
- ✅ Simple string template with `{variable}` substitution

---

## 🔧 Recommendation: Unified Format

### Option A: Keep Plain Text in JS (RECOMMENDED)

**Why This Works Best**:
1. ✅ Direct integration with API (no conversion needed)
2. ✅ Simple variable substitution
3. ✅ Easy to test and modify
4. ✅ Version control tracks changes naturally
5. ✅ Fast - no file loading overhead

**Format**:
```javascript
// src/config/prompts.js
export const PROMPTS = {
  cleanPhotography: {
    base: `Transform the 3D table model into photorealistic product photography.

CRITICAL - Surface Mapping:
Replace ONLY the red tabletop surface with the wood texture provided earlier.
- Preserve exact rectangular dimensions from 3D model
- Map wood grain to flow along table length
- Keep surface thickness exactly as shown

Leg Treatment:
Replace green legs with photorealistic {legStyle} steel legs.
- Maintain exact X-cross geometry from 3D model
- Apply matte black powder coat (10-15% sheen)

Background & Lighting:
- Background: {backgroundStyle}
- Lighting: Three-point studio setup, 5500K color temp
- Shadows: Subtle contact shadows (20-30% opacity)

Quality: Photorealistic, artifact-free, commercial-grade.
Variation {variationNumber}: Vary angle by 5-10° and lighting direction.`,

    variations: {
      1: { angle: "Three-quarter front-left, 10° elevation" },
      2: { angle: "Three-quarter front-right, 10° elevation" },
      3: { angle: "Direct front, 5° elevation" },
      4: { angle: "Three-quarter front-left, 15° elevation" }
    }
  },

  lifestylePhotography: {
    cafe: `Transform this product photo into an authentic café lifestyle scene.

CRITICAL - Product Integrity:
The table remains the HERO - maintain exact appearance from clean shot.
- Table in sharp focus (background 60-70% blur)
- Occupies 40-50% of frame
- Clearly visible and identifiable

Scene: Modern independent café, industrial-chic aesthetic
Time: Mid-morning (10-11am feel)
Lighting: Natural window light, 4800-5200K, soft shadows

Props (3-5 items max, occupy only 25% of table surface):
- Ceramic coffee cup with latte art (half-full), 80mm diameter
- Croissant on small plate
- Folded newspaper
- Smartphone face-down
- Reading glasses

Prop Placement:
- Asymmetric arrangement (rule of thirds)
- 8-12 inches from table edges
- Never obscure table corners or distinctive features

Atmosphere: Warm, inviting, creative workspace vibe
Background: Blurred café interior (exposed brick, pendant lights, hint of patrons)
Color Palette: Warm browns, cream whites, soft grays

Quality: Photorealistic, e-commerce ready, professional.
Variation {variationNumber}: Vary prop arrangement 5-10°.`
  }
};
```

**Usage in Code**:
```javascript
const prompt = PROMPTS.cleanPhotography.base
  .replace('{variationNumber}', 1)
  .replace('{legStyle}', 'black powder-coated')
  .replace('{backgroundStyle}', 'gradient gray');

await chat.sendMessage([{ text: prompt }, { inlineData: {...} }]);
```

---

### Option B: Load from JSON (More Complex)

**If you want structured metadata** (system prompts, parameters, versions):

```json
// prompts/production/clean-product.json
{
  "id": "clean-product-v2",
  "version": "2.0.0",
  "prompt": {
    "text": "Transform the 3D table model...",
    "variables": ["variationNumber", "legStyle", "backgroundStyle"]
  },
  "parameters": {
    "temperature": 0.3,
    "topP": 0.8
  },
  "metadata": {
    "lastUpdated": "2025-11-17",
    "testedWith": ["150x80", "200x80", "240x110"]
  }
}
```

**Load with**:
```javascript
import fs from 'fs';
const promptData = JSON.parse(fs.readFileSync('prompts/production/clean-product.json'));
const prompt = promptData.prompt.text
  .replace('{variationNumber}', 1);

await chat.sendMessage([{ text: prompt }]);
```

**Pros**:
- ✅ Structured metadata
- ✅ Version tracking
- ✅ Parameters stored with prompt

**Cons**:
- ❌ Extra file loading overhead
- ❌ More complex to edit
- ❌ Requires JSON validation

---

### Option C: Hybrid Approach (BEST OF BOTH)

**Use plain JS for production, JSON for metadata/testing**:

**Production (`src/config/prompts.js`)** - Plain text, fast:
```javascript
export const PROMPTS = {
  cleanPhotography: {
    base: `[prompt text here]`,
    variations: { ... }
  }
};
```

**Testing/Validation (`prompts/schemas/`)** - JSON with metadata:
```json
{
  "prompt_id": "clean-product",
  "test_cases": [
    { "model": "150x80", "expected_ratio": 1.875 }
  ],
  "parameters": { "temperature": 0.3 },
  "validation_rules": [...]
}
```

---

## 📋 Current State Analysis

### What You Have Now

1. **Production Prompts** (✅ Working):
   - Location: `src/config/prompts.js`
   - Format: Plain text strings in JavaScript
   - Status: **ACTIVELY USED BY API**

2. **JSON Angle Templates** (❌ Not Used):
   - Location: `prompts/angle-generation/*.json`
   - Format: Structured JSON with system/user/negative
   - Status: **NOT REFERENCED BY PRODUCTION CODE**
   - Purpose: Exploratory templates

3. **Markdown Documentation** (📖 Reference Only):
   - Location: `prompts/lifestyle_photography/*.md`, etc.
   - Format: Markdown with detailed descriptions
   - Status: **DOCUMENTATION ONLY**
   - Purpose: Human reference, not code

### What's Missing

1. **Updated Production Prompts**:
   - `src/config/prompts.js` needs the corrected prompts from analysis
   - Currently uses generic descriptions
   - Missing dimensional validation
   - Missing technical specifications

2. **Dimension Validation**:
   - No `dimension-specs.js` file yet
   - No ratio validation system
   - No integration with prompt builders

---

## 🎯 Recommendation: Go with Option A (Plain JS)

### Why Plain JavaScript Works Best for Your Workflow

1. **Direct API Integration**:
   - No conversion/loading needed
   - Immediate string substitution
   - Fast execution

2. **Easy to Update**:
   - Edit directly in code
   - See changes immediately
   - No file loading errors

3. **Version Control**:
   - Git tracks all changes
   - Diff shows exact prompt modifications
   - Easy rollback

4. **Performance**:
   - No JSON parsing overhead
   - No file I/O
   - Cached in memory

5. **Simplicity**:
   - One source of truth
   - Clear what's actually used
   - No format confusion

---

## 🚀 Implementation Plan

### Step 1: Update `src/config/prompts.js`

Replace current generic prompts with corrected versions:

```javascript
export const PROMPTS = {
  surfaceReference: `This is the tabletop surface I want to use in future image modifications. Please remember this surface for the next prompts.`,

  cleanPhotography: {
    base: `[CORRECTED PROMPT FROM ANALYSIS - 350 words with technical specs]`,
    variations: {
      // Specific camera angles for each variation
    }
  },

  lifestylePhotography: {
    cafe: `[DETAILED CAFE SCENE - 450 words]`,
    office: `[DETAILED OFFICE SCENE - 450 words]`,
    dining: `[DETAILED DINING SCENE - 450 words]`,
    living: `[DETAILED LIVING SCENE - 450 words]`
  }
};
```

### Step 2: Create `src/config/dimension-specs.js`

```javascript
export const DIMENSION_SPECS = {
  '150x80': {
    length: 1500,
    width: 800,
    thickness: 40,
    ratio: 1.875,
    validation: "Table must appear 1.875× longer than wide"
  },
  // ... for all models
};

export function addDimensionValidation(basePrompt, modelSize) {
  const specs = DIMENSION_SPECS[modelSize];
  if (!specs) return basePrompt;

  return basePrompt + `\n\nDIMENSIONAL ACCURACY: This table is ${specs.length}mm × ${specs.width}mm. The generated image MUST show a ${specs.ratio}:1 length-to-width ratio. Acceptable variance: ±3%.`;
}
```

### Step 3: Update `geminiService.js`

```javascript
import { PROMPTS } from '../config/prompts.js';
import { addDimensionValidation } from '../config/dimension-specs.js';

function buildCleanPrompt({ variationNumber, legStyle, backgroundStyle, modelSize }) {
  let prompt = PROMPTS.cleanPhotography.base
    .replace('{variationNumber}', variationNumber)
    .replace('{legStyle}', legStyle)
    .replace('{backgroundStyle}', backgroundStyle);

  // Add dimension validation if modelSize provided
  if (modelSize) {
    prompt = addDimensionValidation(prompt, modelSize);
  }

  return prompt;
}
```

### Step 4: Archive or Document JSON/Markdown

**Option 1**: Keep as reference documentation
```
prompts/
├── production/              # NOT USED - just reference
│   ├── json-templates/      # JSON templates (for documentation)
│   └── markdown-guides/     # Markdown guides (for humans)
└── README.md                # Explains format choice
```

**Option 2**: Remove unused files
```
# Delete JSON templates (not used in production)
rm -rf prompts/angle-generation/

# Keep Markdown as documentation
# (rename to make clear they're docs, not code)
mv prompts/lifestyle_photography prompts/docs-lifestyle-scenes
```

---

## ✅ Final Decision Matrix

| Format | API Compatible | Easy to Edit | Version Control | Metadata Support | Performance | Recommended |
|--------|----------------|--------------|-----------------|------------------|-------------|-------------|
| **Plain JS** | ✅ Direct | ✅ Yes | ✅ Excellent | ⚠️ Limited | ✅ Fast | **YES** ✅ |
| **JSON** | ⚠️ Needs loading | ⚠️ Moderate | ✅ Good | ✅ Excellent | ⚠️ Slower | Only if needed |
| **Markdown** | ❌ Not directly | ✅ Very easy | ✅ Good | ❌ None | ❌ N/A | Documentation only |

---

## 📝 Summary

### The Confusion Was:

1. **JSON prompts** in `angle-generation/` → Templates, not used in production
2. **Markdown prompts** in `lifestyle_photography/` → Documentation, not used in production
3. **Plain JS prompts** in `src/config/prompts.js` → **ACTUAL PRODUCTION PROMPTS**

### The Solution:

**Use Plain JavaScript strings in `src/config/prompts.js`** because:
- ✅ This is what's already working in production
- ✅ Direct integration with Gemini API
- ✅ Simple, fast, maintainable
- ✅ No format conversion needed

### Next Steps:

1. Update `src/config/prompts.js` with corrected prompts
2. Create `src/config/dimension-specs.js` for validation
3. Keep JSON/Markdown as documentation if desired, or remove
4. Test updated prompts with 3D models

---

**The API doesn't care about JSON or Markdown - it wants plain text strings. Use whatever storage format makes development easiest, but convert to plain text before the API call.**

**For your workflow: Plain JavaScript strings in `src/config/prompts.js` is the simplest and best solution.**
