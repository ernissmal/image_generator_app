# Prompt Engineering Guide

## Overview

This directory contains AI prompt templates for generating product angle variations using Google Gemini 2.0 Flash API. These templates power the core functionality of the Image Generator App, transforming a single product photo into multiple professional angles.

## Template Structure

Each template is a JSON file following this structure:

- **id**: Unique identifier (e.g., `angle-0deg-top`)
- **version**: Semantic version number (e.g., `1.0.0`)
- **angle_type**: What angle this generates (`0deg`, `90deg`, `isometric`, etc.)
- **description**: Human-readable explanation of what this template produces
- **prompt**: The actual prompt text
  - **system**: Sets AI context/role (defines the AI's expertise)
  - **user**: Main generation instructions (detailed requirements)
  - **negative**: What to avoid (improves quality significantly)
- **parameters**: Model settings (`temperature`, `top_p`, `top_k`, `max_output_tokens`)
- **reference_examples**: Example images showing desired output quality
- **variables**: Documented placeholder variables (e.g., `{product_name}`)
- **metadata**: Tracking info (cost, performance, creation date)

### Example Template Structure

```json
{
  "id": "angle-0deg-top",
  "version": "1.0.0",
  "angle_type": "0deg",
  "description": "Generate direct overhead (0° top-down) product view",
  "prompt": {
    "system": "You are a professional e-commerce product photographer...",
    "user": "Create a professional product photograph from directly overhead...\n\nProduct: {product_name}\n\n...",
    "negative": "blur, distortion, watermarks, harsh shadows, dark background..."
  },
  "parameters": {
    "temperature": 0.3,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 2048
  },
  "reference_examples": ["../prototype/images/l-shape-angle-0deg-top.png"],
  "variables": {
    "product_name": "Name/description of the product being photographed"
  },
  "metadata": {
    "created_by": "Agent 2 - Prompt Engineer",
    "created_date": "2025-10-23",
    "last_updated": "2025-10-23",
    "cost_per_generation": "$0.02"
  }
}
```

---

## Prompt Engineering Principles

### 1. Be Specific and Detailed

The more specific your instructions, the better the output quality.

❌ **Bad**: "Take a photo of the product from above"

✅ **Good**: "Create a professional product photograph from directly overhead (0° top-down view). Background: Pure white (#FFFFFF). Lighting: Soft, even studio lighting. Shadows: Minimal. Resolution: 2048x2048px. Composition: Product centered, filling 60-70% of frame."

**Why it works**: AI models respond well to detailed, unambiguous instructions. Specificity reduces interpretation variance.

### 2. Use Technical Language

Product photography has established terminology. Use it consistently.

**Recommended Terms:**
- **Angles**: Overhead, top-down, bird's eye view, isometric, orthographic, profile, elevation
- **Lighting**: Soft lighting, diffused, studio lighting, even illumination, flat lighting
- **Backgrounds**: Seamless background, gradient, pure white (#FFFFFF), light gray (#F5F5F5)
- **Quality**: Sharp focus, crystal clear, depth of field, high resolution
- **Composition**: Centered, frame fill percentage, rule of thirds

**Example:**
```
Good: "Isometric perspective (30° from horizontal) showing top surface and two sides"
Bad: "Angled shot showing some depth"
```

### 3. Include Negative Prompts

Telling the AI what **NOT** to do significantly improves output quality. This is one of the most powerful techniques in prompt engineering.

**Effective Negative Prompts:**
- Quality issues: `blur, blurry, out of focus, distortion, low quality, amateur`
- Lighting problems: `harsh shadows, dark shadows, poor lighting, underexposed, overexposed`
- Background issues: `dark background, colored background, cluttered, busy background`
- Unwanted elements: `watermark, text overlay, logo, branding`
- Perspective errors: `angled view, perspective distortion, fisheye, tilted`

**Example:**
```json
"negative": "blur, distortion, watermarks, text, logos, low quality, harsh shadows, dark background, cluttered, angled camera, side perspective, 3D view, tilted angle"
```

### 4. Reference Examples

Always include reference images when possible. The AI uses these to understand your quality expectations and style preferences.

```json
"reference_examples": [
  "../prototype/images/l-shape-angle-0deg-top.png"
]
```

Reference images serve as visual anchors for:
- Desired angle/perspective
- Lighting style
- Background treatment
- Overall quality level

### 5. Model Parameters

Understanding model parameters helps you control output variability and quality.

#### Temperature (0-1)
Controls randomness/creativity in generation.

- **0.2-0.3**: More consistent, predictable (use for technical/documentation shots)
- **0.4-0.5**: Balanced creativity (use for product marketing)
- **0.6-0.8**: More creative, variable (use for artistic shots)

**Recommendation**: Use **0.3** for e-commerce product shots to ensure consistency.

#### top_p (0-1)
Nucleus sampling parameter. Controls diversity by probability mass.

- **0.75**: More focused, deterministic
- **0.8**: Balanced (recommended default)
- **0.85**: More diverse output

**Recommendation**: **0.8** works well for most product photography use cases.

#### top_k (1-100)
Limits sampling to top K most likely tokens.

- **20-30**: More focused
- **40**: Balanced (recommended default)
- **50-60**: More diverse

**Recommendation**: **40** is a safe, effective default.

#### max_output_tokens (256-4096)
Maximum response length. For image generation, this affects processing time and cost.

**Recommendation**: **2048** provides good balance for product photography.

---

## Variable Substitution

Templates support dynamic variables using `{variable_name}` syntax. This allows reusing templates across different products.

### Available Variables

- **`{product_name}`**: Name/description of product being photographed
- **`{angle}`**: Angle identifier (future use)
- **`{quality}`**: Quality level - standard/high/premium (future use)

### Example Usage

**Template**:
```
"Product: {product_name}\n\nTechnical Requirements:\n- Viewing angle: 0°..."
```

**After Substitution** (with `{product_name: "Leather Wallet"}`):
```
"Product: Leather Wallet\n\nTechnical Requirements:\n- Viewing angle: 0°..."
```

### Using the Template Loader

```javascript
const PromptTemplateLoader = require('./src/services/prompt-template-loader');

const loader = new PromptTemplateLoader();
loader.loadAll();

// Load template
const template = loader.getByAngleType('0deg');

// Substitute variables
const prompt = loader.substitute(template, {
  product_name: 'Leather Wallet'
});

// Use with Gemini API
const formattedPrompt = loader.formatForAPI(prompt, 'Leather Wallet');
```

---

## Available Angle Templates

| Template ID | Angle Type | Description | Use Case |
|-------------|------------|-------------|----------|
| `angle-0deg-top` | 0deg | Direct overhead view | Primary product shot |
| `angle-45deg-top` | 45deg | Overhead rotated 45° | Diagonal perspective |
| `angle-90deg-top` | 90deg | Overhead rotated 90° | Side view from above |
| `angle-135deg-top` | 135deg | Overhead rotated 135° | Opposite diagonal |
| `angle-180deg-top` | 180deg | Overhead rotated 180° | Back/reverse view |
| `angle-270deg-top` | 270deg | Overhead rotated 270° | Opposite side view |
| `isometric-3d` | isometric | 3D isometric view | Show depth/dimension |
| `top-orthographic` | orthographic | Flat technical view | Blueprint/technical |
| `side-profile` | profile | Pure edge view | Show thickness/profile |

---

## Testing New Prompts

When creating or modifying prompt templates, follow this testing workflow:

### 1. Create/Modify Template
- Edit JSON file with new prompt text
- Update version number appropriately
- Document changes in metadata

### 2. Test with Diverse Products
Test with 5-10 different product types:
- Simple products (e.g., wallet, phone case)
- Complex products (e.g., watch, electronics)
- Different materials (leather, metal, plastic, fabric)
- Various sizes and shapes

### 3. Measure Quality Metrics

**Success Rate**: Target **>90%**
- Count how many generations produce usable images
- Note: "Usable" means meets quality bar for e-commerce

**Visual Quality**: Manual inspection
- Correct angle/perspective?
- Appropriate lighting?
- Clean background?
- Sharp focus?
- Professional appearance?

**Cost per Generation**: Target **<$0.03**
- Monitor token usage
- Optimize prompt length if costs creep up

**Generation Time**: Target **<20 seconds**
- Measure API response time
- Note any timeouts or delays

### 4. Iterate Based on Results

If quality is low:
- Add more specific instructions
- Enhance negative prompts
- Adjust model parameters (lower temperature)
- Include more reference examples

If cost is high:
- Reduce prompt verbosity
- Lower `max_output_tokens`
- Remove redundant instructions

If generation is slow:
- Check API rate limits
- Reduce `max_output_tokens`
- Simplify complex instructions

### 5. Version Control

Update version number based on changes:
- **Major** (1.0.0 → 2.0.0): Complete prompt restructure
- **Minor** (1.0.0 → 1.1.0): Adding/removing significant details
- **Patch** (1.0.0 → 1.0.1): Typo fixes, minor tweaks

### 6. Archive Old Versions

Before updating, archive the previous version:

```bash
cp prompts/angle-generation/angle-0deg.json prompts/angle-generation/archive/v1.0/angle-0deg-v1.0.0.json
```

---

## Common Issues & Solutions

### Issue: Generated images are blurry

**Symptoms**: Soft focus, motion blur, lack of detail

**Solutions**:
1. Add to negative prompt: `blur, blurry, out of focus, soft focus, motion blur, unclear, fuzzy`
2. Emphasize in user prompt: `Sharp focus across entire product`, `Crystal clear detail`
3. Lower temperature to 0.2 for more consistency
4. Add reference image with excellent sharpness

### Issue: Wrong angle/perspective

**Symptoms**: Camera angle doesn't match requirements

**Solutions**:
1. Be more specific about camera position: Use multiple phrasings like `directly overhead`, `0° from above`, `bird's eye view`, `straight down`
2. Add perspective type: `orthographic projection`, `no perspective distortion`
3. Strengthen negative prompts: `NO angled view, NO side perspective, NO 3D perspective`
4. Include clear reference image

### Issue: Dark backgrounds instead of white

**Symptoms**: Gray, colored, or dark backgrounds

**Solutions**:
1. Specify exact color: `Background: Pure white (#FFFFFF)` or `Background: #FFFFFF hex color`
2. Add to negative: `dark background, colored background, gray background, gradient background, textured background`
3. Emphasize in user prompt: `Seamless white background`, `Studio white backdrop`

### Issue: Harsh shadows or wrong lighting

**Symptoms**: Hard shadows, dramatic lighting, uneven illumination

**Solutions**:
1. Be specific about lighting: `Soft, diffused studio lighting`, `Even illumination from multiple angles`, `Flat lighting`
2. Add to negative: `harsh shadows, dark shadows, dramatic lighting, side lighting only`
3. For technical shots, specify: `Minimal to no shadows`, `Shadowless lighting`

### Issue: Inconsistent quality across generations

**Symptoms**: Results vary widely between attempts

**Solutions**:
1. Lower temperature (0.2-0.3) for more deterministic output
2. Add more specific constraints to prompt
3. Strengthen negative prompts
4. Provide clear reference examples
5. Reduce `top_p` value (try 0.75)

### Issue: Watermarks or text appearing

**Symptoms**: Unwanted text, logos, or watermarks in images

**Solutions**:
1. Add to negative prompt: `watermark, watermarks, text overlay, text, logo, branding, copyright, signature`
2. Emphasize in user prompt: `Clean product shot with no text or watermarks`

### Issue: Product not centered or wrong composition

**Symptoms**: Product off-center, too small/large in frame

**Solutions**:
1. Specify composition explicitly: `Product centered in frame`, `Filling 60-70% of frame`, `Centered composition`
2. Add to negative: `off-center, cropped, edge cutoff, vignette`

---

## Cost Optimization

Each generation costs approximately **$0.02-0.03** (varies by model and token usage).

### Optimization Strategies

#### 1. Keep Prompts Concise
Longer prompts = more tokens = higher cost

**Before** (verbose):
```
Create a professional photograph of the product. Make sure the background
is white and clean. The lighting should be good and professional.
Make sure there are no shadows. The product needs to be in focus...
```

**After** (concise):
```
Professional product photo. White background (#FFFFFF). Soft studio lighting.
Minimal shadows. Sharp focus. 2048x2048px.
```

**Savings**: ~30% fewer tokens

#### 2. Optimize max_output_tokens
Don't request more tokens than needed.

- For simple products: **1024 tokens**
- For standard products: **2048 tokens** (recommended)
- For complex products only: **4096 tokens**

#### 3. Cache Common Products
Store generated images for frequently photographed products.

```javascript
// Pseudocode
const cacheKey = `${productId}-${angleType}`;
if (cache.has(cacheKey)) {
  return cache.get(cacheKey);
}
```

#### 4. Batch Similar Products
Generate multiple angles for the same product in one session to leverage context.

#### 5. Monitor Usage
Track costs in metadata:

```javascript
metadata: {
  cost_per_generation: "$0.02",
  avg_generation_time_sec: 15
}
```

Set up alerts for unusual cost spikes.

---

## Performance Benchmarks

Target metrics for production quality:

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Success Rate | >95% | 90-95% | <90% |
| Generation Time | <15s | 15-20s | >20s |
| Cost per Image | <$0.02 | $0.02-0.03 | >$0.03 |
| Quality Score | >4.5/5 | 4.0-4.5 | <4.0 |

**Quality Scoring** (manual evaluation):
- 5/5: Perfect - ready for e-commerce use
- 4/5: Good - minor touch-ups needed
- 3/5: Acceptable - requires editing
- 2/5: Poor - significant issues
- 1/5: Failed - unusable

---

## Integration Example

Complete workflow for generating product angles:

```javascript
const PromptTemplateLoader = require('./src/services/prompt-template-loader');
const GeminiClient = require('./src/services/gemini-client');

// Initialize services
const loader = new PromptTemplateLoader();
loader.loadAll();

const gemini = new GeminiClient(process.env.GOOGLE_AI_STUDIO_API);

// Generate image for specific angle
async function generateProductAngle(productName, angleType, imageUrl) {
  // 1. Load template for angle
  const template = loader.getByAngleType(angleType);

  // 2. Substitute variables
  const substituted = loader.substitute(template, {
    product_name: productName
  });

  // 3. Format for API
  const prompt = loader.formatForAPI(substituted, productName);

  // 4. Call Gemini API
  const result = await gemini.generateImage({
    prompt: prompt,
    imageUrl: imageUrl,
    parameters: template.parameters
  });

  return result;
}

// Example usage
const result = await generateProductAngle(
  'Leather Wallet',
  '0deg',
  'https://example.com/wallet.jpg'
);

if (result.success) {
  console.log('Image generated successfully!');
  console.log(`Tokens used: ${result.tokensUsed}`);
}
```

---

## Troubleshooting

### Template won't load

**Error**: `Template not found: angle-0deg-top`

**Solutions**:
1. Check file exists: `ls prompts/angle-generation/`
2. Verify filename matches: `angle-0deg.json` (not `angle-0deg-top.json`)
3. Check file permissions: `chmod 644 prompts/angle-generation/*.json`

### Validation errors

**Error**: `Invalid template: .angle_type must be one of...`

**Solutions**:
1. Check template against `template-schema.json`
2. Verify all required fields present
3. Validate JSON syntax: `node -e "JSON.parse(fs.readFileSync('file.json'))"`

### Variable not substituting

**Error**: Template still shows `{product_name}` after substitution

**Solutions**:
1. Check variable name matches exactly (case-sensitive)
2. Verify variables object passed to `substitute()`
3. Look for console warnings about unsubstituted variables

---

## Support & Contact

**For prompt-related questions**: Contact Agent 2 (Prompt Engineer)
**For API integration issues**: Contact Agent 1 (API Specialist)
**For UI/frontend issues**: Contact Agent 3 (Frontend Developer)

---

## Appendix: Prompt Engineering Resources

### Recommended Reading
- Google Gemini Prompting Guide
- OpenAI Prompt Engineering Best Practices
- Anthropic Prompting Documentation

### Tools
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Last Updated**: 2025-10-23
**Version**: 1.0.0
**Maintainer**: Agent 2 - Prompt Engineer
