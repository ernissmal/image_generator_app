# Table Product Photography - Prompt Catalog

**Version**: 1.0
**Last Updated**: 2025-11-15
**Purpose**: Organized catalog of prompts for generating table product photography

---

## 📁 Directory Structure

```
prompts/
├── surface_reference/       # Tabletop surface texture prompts
│   └── surface_texture_prompt.md
├── leg_reference/          # Table leg style prompts
│   └── leg_style_prompt.md
├── clean_photography/      # Clean product shot prompts
│   └── clean_product_shot.md
├── lifestyle_photography/  # Lifestyle scene prompts
│   └── lifestyle_scenes.md (10 curated scenes)
└── PROMPT_CATALOG.md      # This file
```

---

## 🎯 Quick Start: 3-Step Workflow

### Step 1: Select Table Components

**A. Choose Tabletop Surface**
- Location: `references/surfaces/`
- Available options:
  - `Live_edge_table_top_26x800x800/` (9 texture views)
  - `Live_edge_table_top_26x800x1500/` (9 texture views)
  - `Live_edge_table_top_26x800x2000/` (9 texture views)
  - `Live_edge_table_top_40x1000x2000/` (9 texture views)

**B. Choose Leg Style**
- Location: `references/products/`
- Available styles:
  - `XSTYLE_3.png` - X-shaped cross support
  - `DIAMOND_3.png` - Diamond geometric pattern
  - `FOURY_3.png` - Four-Y connection design
  - `SANDTIMER_3.png` - Hourglass silhouette
  - `SQUARE_3.png` - Simple square frame
  - `PEARHALF_3.png` - Curved pear-half design
- All legs: Black powder-coated steel finish

**C. Choose Camera Angle**
- Location: `references/angles/`
- Files: `IMG_0391.PNG` through `IMG_0401.PNG` (and more)
- Multiple viewpoint options for product showcase

### Step 2: Select Photography Style

**Option A: Clean Product Photography**
→ Use: [`clean_photography/clean_product_shot.md`](clean_photography/clean_product_shot.md)

**Option B: Lifestyle Photography**
→ Use: [`lifestyle_photography/lifestyle_scenes.md`](lifestyle_photography/lifestyle_scenes.md)

### Step 3: Generate

Fill in the prompt template with your selections and generate!

---

## 📋 Prompt Categories

### 1. Surface Reference Prompts
**File**: [`surface_reference/surface_texture_prompt.md`](surface_reference/surface_texture_prompt.md)

**Purpose**: Generate or describe tabletop surface textures

**Use Cases**:
- Creating custom wood grain textures
- Specifying material properties
- Matching existing surface references

**Key Features**:
- Material specifications (wood type, finish, color)
- Dimension parameters
- Texture characteristics (grain, imperfections)
- High-resolution requirements

---

### 2. Leg Reference Prompts
**File**: [`leg_reference/leg_style_prompt.md`](leg_reference/leg_style_prompt.md)

**Purpose**: Specify table leg design and construction

**Use Cases**:
- Selecting leg style for product configuration
- Describing leg specifications
- Matching to 3D model angles

**Key Features**:
- 6 distinct leg style options
- Black powder-coated steel construction
- Dimensional specifications
- Mounting and structural details

---

### 3. Clean Product Photography
**File**: [`clean_photography/clean_product_shot.md`](clean_photography/clean_product_shot.md)

**Purpose**: Professional product shots with minimal background

**Best For**:
- ✅ E-commerce product listings
- ✅ Product catalogs
- ✅ Specification sheets
- ✅ Marketing materials
- ✅ Print advertising

**Characteristics**:
- Gradient background (dark gray → light gray)
- Studio lighting setup
- No props or environmental context
- Sharp focus on product
- Clean, minimal aesthetic

**Output Examples**: `references/examples/`

---

### 4. Lifestyle Photography
**File**: [`lifestyle_photography/lifestyle_scenes.md`](lifestyle_photography/lifestyle_scenes.md)

**Purpose**: Contextual product photography in real-world settings

**Best For**:
- ✅ Social media content
- ✅ Lifestyle marketing
- ✅ Editorial features
- ✅ Brand storytelling
- ✅ Instagram/Pinterest posts

**10 Curated Scenes**:

1. **Dining Room - Morning Breakfast**
   - Target: Home lifestyle, family-oriented
   - Props: Ceramic plates, pastries, orange juice, newspaper
   - Lighting: Morning natural light through curtains

2. **Home Office - Afternoon Work Session**
   - Target: Remote workers, professionals
   - Props: Leather notebook, fountain pen, coffee, reading glasses
   - Lighting: Afternoon window light

3. **Cafe - Creative Work Space**
   - Target: Urban professionals, freelancers
   - Props: MacBook, latte art, croissant, smartphone
   - Lighting: Natural cafe lighting with bokeh background

4. **Hotel Lobby - Business Casual**
   - Target: Business travelers, corporate
   - Props: Architecture magazine, crystal vase, leather portfolio
   - Lighting: Elegant pendant/chandelier lighting

5. **Co-working Space - Collaborative Environment**
   - Target: Startups, tech workers
   - Props: Notebook, wireless headphones, reusable coffee cup
   - Lighting: Bright, energetic co-working space

6. **London Flat - Refined Living**
   - Target: International, sophisticated urbanites
   - Props: Wallpaper magazine, tea service, peonies, MacBook
   - Lighting: Natural daylight with city view

7. **Industrial Loft - Urban Creative**
   - Target: Artists, designers, creative professionals
   - Props: Design books, pour-over coffee, vintage camera
   - Lighting: Industrial fixtures with natural light

8. **Scandinavian Interior - Minimalist Lifestyle**
   - Target: Design-conscious, minimalist aesthetic
   - Props: White ceramics, eucalyptus, linen napkin, candle
   - Lighting: Abundant natural light (hygge atmosphere)

9. **Art Gallery - Cultural Space**
   - Target: Art collectors, cultured professionals
   - Props: Exhibition catalogue, wine glass, sculptural object
   - Lighting: Track lighting, gallery aesthetic

10. **Creative Studio - Maker Space**
    - Target: Designers, artists, creators
    - Props: Sketch pads, color swatches, art brushes, espresso
    - Lighting: Natural studio light with task lamp

---

## 💡 Usage Examples

### Example 1: E-Commerce Product Shot

```
SELECTIONS:
✓ Surface: Live_edge_table_top_26x800x1500 (texture #4)
✓ Legs: XSTYLE_3.png
✓ Angle: IMG_0393.PNG
✓ Style: Clean Product Photography

PROMPT (from clean_photography/clean_product_shot.md):
-----
Create a photorealistic product image of a live edge wood table
with black X-style powder-coated steel legs. The table features
a warm honey-toned wood surface with natural edge detail,
positioned at a three-quarter front view angle.

Use a smooth linear gradient background transitioning from dark
gray (#2a2a2a) at the top to light gray (#e0e0e0) at the bottom.

Studio lighting should highlight the table as the centerpiece
with subtle shadows for depth, emphasizing the wood grain texture
and the matte black finish of the steel frame.
-----

USE CASE: Product catalog listing, online store
```

### Example 2: Instagram Lifestyle Post

```
SELECTIONS:
✓ Surface: Live_edge_table_top_40x1000x2000 (texture #2)
✓ Legs: DIAMOND_3.png
✓ Angle: IMG_0395.PNG
✓ Style: Lifestyle - Scene #8 (Scandinavian Interior)

PROMPT (from lifestyle_photography/lifestyle_scenes.md):
-----
Create a photorealistic lifestyle image of the table in a
Scandinavian-inspired interior.

Table Specifications:
- Live edge wood surface (40x1000x2000mm, warm natural tones)
- Diamond-style black powder-coated steel legs
- Camera angle: Three-quarter elevated view

Styling & Props (on table):
- Light wood ceramic coffee cup (white)
- Small vase with eucalyptus stems
- Linen napkin in natural beige
- Minimal wooden cutting board with cheese
- Glass candle holder with white candle

Environment & Lighting:
- Bright, airy Scandinavian interior
- White walls, light gray accents
- Natural wood elements in soft focus background
- Abundant natural light from large windows
- Minimalist furniture visible
- Calm, hygge atmosphere
-----

USE CASE: Social media, lifestyle marketing, Pinterest
```

---

## 🔧 Customization Guide

### Variable Placeholders

All prompts use `[VARIABLE]` syntax for customization:

| Variable | Replace With | Example |
|----------|-------------|---------|
| `[TABLETOP_SURFACE]` | Surface description | "Live edge walnut, 26x800x1500mm" |
| `[LEG_STYLE]` | Leg style name | "X-style" or "Diamond" |
| `[REFERENCE_ANGLE]` | Angle file reference | "IMG_0393.PNG - three-quarter view" |
| `[SURFACE_TYPE]` | Material type | "Live edge wood", "Oak", "Walnut" |
| `[SCENE_NUMBER]` | Lifestyle scene (1-10) | "Scene 3 - Cafe" |

### Tips for Customization

1. **Be specific about materials**: "Warm honey-toned oak" vs "wood"
2. **Reference exact files**: Include file names from `references/`
3. **Describe the angle**: "Three-quarter front view" not just "IMG_0393"
4. **Match scene to audience**: Select lifestyle scene based on target customer
5. **Maintain consistency**: Use same angle across a product line

---

## 📊 Best Practices

### For Clean Product Photography
- ✅ Keep background gradient consistent (dark to light gray)
- ✅ Ensure even studio lighting
- ✅ Fill frame appropriately (60-70%)
- ✅ Maintain sharp focus across entire table
- ✅ Show material texture and finish clearly

### For Lifestyle Photography
- ✅ Select scene matching target audience
- ✅ Props should look natural and used (not brand new)
- ✅ Create depth with slight background blur
- ✅ Match lighting to time of day in scene
- ✅ Maintain cohesive color palette
- ✅ Avoid over-styling or perfect symmetry

### General Guidelines
- ✅ Always specify all three components (surface, legs, angle)
- ✅ Reference actual file names from `references/`
- ✅ Use consistent angles for product line cohesion
- ✅ Test prompts with multiple surfaces to ensure flexibility
- ✅ Save successful outputs as new reference examples

---

## 🗂️ Reference Materials

All prompts reference these directories:

| Directory | Contents | Purpose |
|-----------|----------|---------|
| `references/surfaces/` | Tabletop textures (4 types, 9 views each) | Surface material reference |
| `references/products/` | Leg styles (6 types) + product examples | Leg design reference |
| `references/angles/` | Camera viewpoints (IMG_0391-0401+) | Angle/perspective reference |
| `references/examples/` | Successfully generated images | Quality benchmarks |

---

## 🎨 Output Specifications

### Resolution Requirements
- **Web/E-commerce**: Minimum 2048x2048px
- **Print**: 4K+ recommended
- **Social Media**: Optimize after generation

### File Formats
- **Clean Product Shots**: PNG (supports transparency)
- **Lifestyle Shots**: JPG or PNG (depending on use)

### Quality Standards
- ✅ Photorealistic rendering
- ✅ Accurate material representation
- ✅ Professional lighting
- ✅ Sharp focus (except intentional background blur)
- ✅ Natural color reproduction

---

## 📖 Related Documentation

- Original prompts: [`new_prompts.md`](../new_prompts.md)
- Project overview: [`CLAUDE.md`](../CLAUDE.md)
- Angle generation guide: [`angle-generation/`](angle-generation/)
- Template schema: [`template-schema.json`](template-schema.json)

---

## 🆘 Need Help?

**Can't find the right prompt?**
- Check if you need clean or lifestyle photography
- Review the 10 lifestyle scenes for best match
- Consider combining elements from multiple scenes

**Quality issues?**
- Review reference examples in `references/examples/`
- Ensure all variables are properly filled
- Check that surface, legs, and angle are all specified

**Want to add new scenes?**
- Follow the structure in `lifestyle_scenes.md`
- Document props, lighting, and environment clearly
- Add reference images to `references/examples/`

---

**Maintained by**: Image Generator App Team
**For updates**: Check git history of this file
