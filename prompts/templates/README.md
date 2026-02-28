# E-Commerce Product Image Generation Templates

This directory contains prompt templates for generating professional e-commerce product photography using Google AI Studio's Nano Banana Model.

## Overview

These templates are designed to create consistent, high-quality product images across different environments and settings. Each template is modular and reusable for any furniture or home decor product.

## Available Templates

### 1. Modern London - No People
**File:** `modern-london-no-people.md`
**Style:** Clean, sophisticated, airy
**Best for:** Minimalist furniture, contemporary pieces, urban lifestyle products
**Key features:**
- Floor-to-ceiling windows
- Natural daylight
- Minimalist decor
- Neutral color palette
- No people

### 2. Modern London - With 3 People
**File:** `modern-london-with-people.md`
**Style:** Warm, social, lived-in yet sophisticated
**Best for:** Dining furniture, social spaces, collaborative furniture
**Key features:**
- 3 diverse individuals in smart-casual attire
- Natural, candid interactions
- People slightly blurred (product in sharp focus)
- Modern urban setting
- Lifestyle context

### 3. England's Rustic - No People
**File:** `england-rustic-no-people.md`
**Style:** Cozy, timeless, characterful, inviting
**Best for:** Traditional furniture, farmhouse pieces, vintage-style products
**Key features:**
- Traditional English cottage interior
- Stone walls and wooden beams
- Warm earth tones
- Vintage accessories
- Golden natural light

### 4. England's Rustic - With People
**File:** `england-rustic-with-people.md`
**Style:** Warm, familial, rustic charm
**Best for:** Dining furniture, family pieces, traditional settings
**Key features:**
- 3 people in casual country attire
- Meal or tea gathering
- People slightly blurred (product in sharp focus)
- Traditional countryside setting
- Authentic homey atmosphere

## How to Use Templates

### Step 1: Choose Your Template
Select the environment that best matches your product and target aesthetic.

### Step 2: Replace Variables
Each template contains variables marked with `{{VARIABLE_NAME}}`. Replace these with product-specific details:

- `{{PRODUCT_TYPE}}` - table, chair, sofa, cabinet, dresser, etc.
- `{{MATERIAL}}` - wood grain, fabric texture, metal finish, woven fabric, etc.
- `{{DISTINCTIVE_FEATURES}}` - leg style, armrests, carved details, drawer handles, etc.
- `{{ROOM_TYPE}}` - dining area, living space, office corner, bedroom, etc.
- `{{COMPLEMENTARY_FURNITURE}}` - chairs, cushions, side tables, benches, etc.

### Step 3: Generate Your Image
1. Open Google AI Studio
2. Upload your reference product image
3. Copy the completed prompt
4. Generate the image
5. Verify that product characteristics are preserved

### Step 4: Save and Organize
Use a consistent naming convention:
```
ProductName_Environment_Version.png
```
Example: `OakTable_ModernLondon_v1.png`

## Template Variables Quick Reference

| Variable | Description | Examples |
|----------|-------------|----------|
| `{{PRODUCT_TYPE}}` | Type of furniture/product | table, chair, sofa, cabinet, dresser, bookshelf |
| `{{MATERIAL}}` | Primary material/texture | wood grain, fabric texture, metal finish, leather texture |
| `{{DISTINCTIVE_FEATURES}}` | Unique product characteristics | leg style, armrests, carved details, drawer handles, tufting |
| `{{ROOM_TYPE}}` | Appropriate room setting | dining area, living space, office corner, bedroom, entryway |
| `{{COMPLEMENTARY_FURNITURE}}` | Supporting furniture pieces | chairs, cushions, side tables, benches, ottomans |

## Example Workflow

### Example: Generating Images for an Oak Dining Table

1. **Choose environments:** All 4 templates
2. **Fill in variables:**
   - `{{PRODUCT_TYPE}}` → "table"
   - `{{MATERIAL}}` → "wood grain"
   - `{{DISTINCTIVE_FEATURES}}` → "leg style"
   - `{{ROOM_TYPE}}` → "dining area"
   - `{{COMPLEMENTARY_FURNITURE}}` → "chairs"

3. **Generate 4 images:**
   - OakTable_ModernLondon_NoPeople_v1.png
   - OakTable_ModernLondon_WithPeople_v1.png
   - OakTable_EnglandRustic_NoPeople_v1.png
   - OakTable_EnglandRustic_WithPeople_v1.png

## Technical Specifications

All templates produce images with:
- **Quality:** Photorealistic
- **Focus:** Sharp on product, people slightly blurred (if present)
- **Shadows:** Natural
- **Format:** E-commerce ready
- **Aspect Ratio:** 1:1
- **Product Preservation:** Exact design, material patterns, dimensions maintained

## Tips for Best Results

1. **Product Focus:** Always emphasize that the product design, materials, and dimensions must be preserved exactly
2. **Background Only:** Make it clear that only the background should change
3. **People as Secondary:** In templates with people, ensure they're described as slightly blurred or out of primary focus
4. **Specific Materials:** Be specific about material patterns (e.g., "oak wood grain" vs just "wood")
5. **Consistent Lighting:** All templates use natural lighting for realistic results

## Customization

Feel free to customize these templates by:
- Adjusting color palettes
- Modifying decor elements
- Changing lighting conditions
- Adding seasonal elements
- Adapting room types

## Workflow Notes

- Process one environment at a time for consistency
- Upload the reference product image to Google AI Studio
- Copy the corresponding prompt for that environment
- Generate and verify that product characteristics are preserved
- Save images with clear naming convention
- Total output: 4 images per product (1 per environment)
- All images formatted in 1:1 aspect ratio

## Support

For questions or template modifications, refer to:
- Original environment definitions: `/prompts/enviroment/all.md`
- Individual template files in this directory
