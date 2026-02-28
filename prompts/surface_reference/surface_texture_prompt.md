# Tabletop Surface Reference Prompt

## Purpose
This prompt is used to generate or describe the tabletop surface texture that will be applied to the 3D table model.

## Prompt Template

```
Generate a high-resolution texture for a [SURFACE_TYPE] table top surface.

Surface specifications:
- Material: [e.g., Live edge wood, Oak, Walnut, Marble, etc.]
- Dimensions: [WIDTH]mm x [LENGTH]mm x [THICKNESS]mm
- Finish: [e.g., Natural oil, Matte lacquer, Glossy finish, etc.]
- Color tone: [e.g., Warm honey, Dark walnut, Light oak, etc.]
- Grain pattern: [e.g., Straight grain, Burled, Live edge with natural bark, etc.]
- Surface characteristics: [e.g., Smooth polished, Slightly textured, Natural imperfections, etc.]

The texture should be:
- Photorealistic and suitable for product photography
- High resolution (minimum 4K)
- Seamlessly tileable if needed for larger surfaces
- Showing natural variations and authentic material characteristics
```

## Reference Directories
- Surface textures: `references/surfaces/`
- Available surface types in references:
  - Live_edge_table_top_26x800x800
  - Live_edge_table_top_26x800x1500
  - Live_edge_table_top_26x800x2000
  - Live_edge_table_top_40x1000x2000

## Usage Notes
- Reference images in `references/surfaces/[SURFACE_TYPE]/` should be used as visual guides
- Each surface folder contains multiple angles (numbered 1-9) showing different views
- The texture should match the material properties shown in the reference images
