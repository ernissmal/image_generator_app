# Clean Product Photography Prompt

## Purpose
This prompt generates clean, professional product photography with minimal distractions - perfect for e-commerce and product catalogs.

## Master Prompt Template

```
Create a photorealistic product image of a table with the provided tabletop surface texture and black powder-coated steel legs, positioned at the specified three D model angle.

Background:
- Use a smooth linear gradient background transitioning from dark gray at the top to light gray at the bottom
- No additional props, objects, or environmental elements
- Clean and minimal aesthetic

Lighting:
- Professional studio lighting setup
- Highlight the table as the centerpiece
- Create subtle shadows for depth and dimension
- Ensure even illumination across the surface
- Bring out the texture details of the tabletop material
- Showcase the matte finish of the black steel legs

Camera & Composition:
- Position: [REFERENCE_ANGLE from references/angles/]
- Focus: Sharp focus across entire table
- Depth of field: Appropriate for product photography
- Framing: Table fills majority of frame with breathing room

Quality Requirements:
- Photorealistic rendering
- High resolution suitable for print and web
- Accurate material representation
- Professional product photography standard
```

## Input Variables

Before generating, specify:
1. **Tabletop Surface**: Reference from `references/surfaces/[SURFACE_TYPE]/`
2. **Leg Style**: Reference from `references/products/[STYLE]_3.png`
3. **Camera Angle**: Reference from `references/angles/[ANGLE].PNG`

## Example Usage

```
INPUTS:
- Surface: Live_edge_table_top_26x800x1500 (image #4)
- Legs: XSTYLE_3.png
- Angle: IMG_0393.PNG

PROMPT:
Create a photorealistic product image of a live edge wood table with black X-style powder-coated steel legs. The table features a warm honey-toned wood surface with natural edge detail, positioned at a three-quarter front view angle. Use a smooth linear gradient background transitioning from dark gray (#2a2a2a) at the top to light gray (#e0e0e0) at the bottom. Studio lighting should highlight the table as the centerpiece with subtle shadows for depth, emphasizing the wood grain texture and the matte black finish of the steel frame.
```

## Output Examples
- Reference successful outputs: `references/examples/`

## Usage Notes
- This is for CLEAN product shots only - no lifestyle context
- Background should always be the gradient (dark to light gray)
- Focus is entirely on the table product itself
- Suitable for product catalogs, e-commerce listings, and specification sheets
