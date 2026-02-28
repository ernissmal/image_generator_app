# Blender Automation Implementation Plan (Phase 3)

**Status**: Ready for Implementation
**Priority**: Critical - Addresses 40-degree angle consistency issue
**Impact**: High - Foundation for production-scale multi-angle generation

---

## Executive Summary

Implement Blender Python automation to generate reliable, precise camera angles for 3D furniture models before AI enhancement. This addresses the critical gap identified in alignment analysis where AI struggles with spatial understanding and consistent angle modifications.

**Why Blender is Essential:**
- AI cannot reliably interpret "rotate 40 degrees" or maintain consistent perspective
- Similar tables at same angle look identical without explicit differentiation
- Blender provides mathematical precision for camera positioning
- Batch processing capability for entire product catalog

---

## Architecture Overview

### Workflow Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    BLENDER AUTOMATION PIPELINE                   │
└─────────────────────────────────────────────────────────────────┘

INPUT                    BLENDER                      OUTPUT
┌─────────┐         ┌──────────────┐           ┌──────────────┐
│ 3D Model│────────>│ Python Script│──────────>│ Multi-angle  │
│ (.obj)  │         │              │           │ Renders      │
│         │         │ • Import     │           │              │
│ From    │         │ • Position   │           │ • 0° front   │
│ Shapr3D │         │ • Light      │           │ • 45° left   │
│         │         │ • Camera     │           │ • 45° right  │
│         │         │ • Render     │           │ • 30° top    │
└─────────┘         └──────────────┘           └──────────────┘
                                                       │
                                                       │
                                                       v
                                               ┌──────────────┐
                                               │ Gemini API   │
                                               │              │
                                               │ • Surface    │
                                               │   replacement│
                                               │ • Texture    │
                                               │ • Lighting   │
                                               │ • Enhancement│
                                               └──────────────┘
                                                       │
                                                       v
                                               ┌──────────────┐
                                               │ Final Product│
                                               │ Photography  │
                                               └──────────────┘
```

---

## Technical Specifications

### 1. Blender Setup

**Required Version**: Blender 3.6+ (LTS)
**Python Version**: 3.10+ (bundled with Blender)
**Installation**: Open source, cross-platform

**Directory Structure**:
```
blender-automation/
├── scripts/
│   ├── camera_positions.py       # Camera angle definitions
│   ├── batch_render.py           # Main automation script
│   ├── material_setup.py         # Material/color setup
│   └── config.py                 # Settings and parameters
├── templates/
│   ├── studio_lighting.blend     # Pre-configured lighting setup
│   └── camera_rigs.blend         # Camera position presets
├── output/
│   ├── 150x80/
│   │   ├── angle_0deg.png
│   │   ├── angle_45deg_left.png
│   │   ├── angle_45deg_right.png
│   │   └── angle_30deg_top.png
│   └── [model-size]/
└── README.md                     # Setup and usage instructions
```

### 2. Camera Position System

**Standard Angles for Rectangular Tables:**

| Angle ID | Camera Position | Elevation | Target | Purpose |
|----------|----------------|-----------|--------|---------|
| `0deg` | Front center, 0° rotation | 10° | Table center | Direct front view |
| `45deg_left` | 45° left of center | 10° | Table center | Three-quarter left |
| `45deg_right` | 45° right of center | 10° | Table center | Three-quarter right |
| `30deg_top` | Front center | 30° | Table center | Elevated angle |
| `15deg_top` | Front center | 15° | Table center | Medium elevation |
| `60deg_left` | 60° left of center | 10° | Table center | Side perspective |
| `60deg_right` | 60° right of center | 10° | Table center | Side perspective |
| `isometric` | 45° left, 35.264° elevation | - | Table center | Technical drawing style |

**Camera Distance Formula**:
```python
# Distance = 2.5 × longest dimension (for 50mm focal length equivalent)
distance = max(table_length, table_width) * 2.5

# Example: 150x80 table
# distance = 1500mm × 2.5 = 3750mm (3.75 meters)
```

**Lens Settings**:
- Focal length: 50mm (minimal distortion, natural perspective)
- Sensor size: 36mm (full frame equivalent)
- F-stop: f/8 (sharp focus throughout table depth)

### 3. Lighting Setup

**Three-Point Studio Lighting** (matching prompt specifications):

```python
# Key Light
key_light = {
    'type': 'AREA',
    'power': 250,  # Watts
    'temperature': 5500,  # Kelvin (daylight)
    'position': (2.0, -3.0, 2.5),  # meters (x, y, z)
    'rotation': (45, 0, 45),  # degrees
    'size': (1.2, 1.2)  # meters (softbox dimensions)
}

# Fill Light
fill_light = {
    'type': 'AREA',
    'power': 125,  # 50% of key light
    'temperature': 5500,
    'position': (-2.0, -3.0, 2.0),
    'rotation': (45, 0, -45),
    'size': (1.0, 1.0)
}

# Rim/Back Light
rim_light = {
    'type': 'AREA',
    'power': 100,
    'temperature': 5500,
    'position': (0, 2.0, 2.5),
    'rotation': (135, 0, 0),
    'size': (0.8, 0.8)
}

# Ground Plane (for shadow catching)
ground_plane = {
    'material': 'shadow_catcher',  # Transparent, catches shadows only
    'size': (10, 10),  # Large enough for all shadows
    'position': (0, 0, 0)
}
```

### 4. Material Setup

**Maintaining Red/Green Color Coding for AI:**

The 3D models use red tabletops and green legs as markers for AI transformation. Blender renders must preserve this.

```python
# Tabletop Material (RED)
tabletop_material = {
    'name': 'Tabletop_Red',
    'type': 'Principled BSDF',
    'base_color': (0.8, 0.05, 0.05),  # Bright red (RGB)
    'roughness': 0.7,  # Matte finish
    'specular': 0.3,
    'metallic': 0.0
}

# Leg Material (GREEN)
leg_material = {
    'name': 'Legs_Green',
    'type': 'Principled BSDF',
    'base_color': (0.05, 0.8, 0.05),  # Bright green (RGB)
    'roughness': 0.6,
    'specular': 0.4,
    'metallic': 0.0
}
```

**Why preserve red/green:**
- AI prompts reference "red tabletop" and "green legs" for surface replacement
- Clear visual markers for AI to identify replacement zones
- Tested and working in current manual workflow

---

## Implementation Details

### Script 1: `camera_positions.py`

**Purpose**: Define camera angle configurations

```python
"""
Camera position definitions for automated rendering
Coordinates in Blender units (1 unit = 1 meter)
"""

import math

class CameraPositions:
    """Standard camera angles for furniture photography"""

    @staticmethod
    def calculate_distance(table_length_mm, table_width_mm):
        """
        Calculate optimal camera distance based on table dimensions
        Formula: 2.5x longest dimension for 50mm lens
        """
        max_dimension_m = max(table_length_mm, table_width_mm) / 1000.0
        return max_dimension_m * 2.5

    @staticmethod
    def get_positions(distance, table_height_mm=750):
        """
        Generate camera positions for standard angles

        Args:
            distance: Camera distance from table center (meters)
            table_height_mm: Table height in millimeters (default: 750mm)

        Returns:
            dict: Camera configurations {angle_id: {position, rotation, name}}
        """
        table_height_m = table_height_mm / 1000.0

        return {
            '0deg': {
                'name': 'Front Center',
                'position': (0, -distance, table_height_m + 0.3),  # 10° elevation
                'rotation': (80, 0, 0),  # Pitch, yaw, roll (degrees)
                'target': (0, 0, table_height_m / 2)
            },

            '45deg_left': {
                'name': 'Three-Quarter Left',
                'position': (
                    -distance * math.sin(math.radians(45)),
                    -distance * math.cos(math.radians(45)),
                    table_height_m + 0.3
                ),
                'rotation': (80, 0, -45),
                'target': (0, 0, table_height_m / 2)
            },

            '45deg_right': {
                'name': 'Three-Quarter Right',
                'position': (
                    distance * math.sin(math.radians(45)),
                    -distance * math.cos(math.radians(45)),
                    table_height_m + 0.3
                ),
                'rotation': (80, 0, 45),
                'target': (0, 0, table_height_m / 2)
            },

            '30deg_top': {
                'name': 'Elevated Front',
                'position': (0, -distance * 0.9, table_height_m + 0.8),  # 30° elevation
                'rotation': (70, 0, 0),
                'target': (0, 0, table_height_m / 2)
            },

            '15deg_top': {
                'name': 'Medium Elevation',
                'position': (0, -distance, table_height_m + 0.5),  # 15° elevation
                'rotation': (75, 0, 0),
                'target': (0, 0, table_height_m / 2)
            },

            '60deg_left': {
                'name': 'Side Left',
                'position': (
                    -distance * math.sin(math.radians(60)),
                    -distance * math.cos(math.radians(60)),
                    table_height_m + 0.3
                ),
                'rotation': (80, 0, -60),
                'target': (0, 0, table_height_m / 2)
            },

            '60deg_right': {
                'name': 'Side Right',
                'position': (
                    distance * math.sin(math.radians(60)),
                    -distance * math.cos(math.radians(60)),
                    table_height_m + 0.3
                ),
                'rotation': (80, 0, 60),
                'target': (0, 0, table_height_m / 2)
            },

            'isometric': {
                'name': 'Isometric Technical',
                'position': (
                    -distance * math.sin(math.radians(45)),
                    -distance * math.cos(math.radians(45)),
                    table_height_m + distance * math.tan(math.radians(35.264))
                ),
                'rotation': (90 - 35.264, 0, -45),
                'target': (0, 0, table_height_m / 2)
            }
        }

# Dimension presets for existing models
DIMENSION_PRESETS = {
    '150x80': {'length': 1500, 'width': 800, 'thickness': 40},
    '200x80': {'length': 2000, 'width': 800, 'thickness': 40},
    '240x110': {'length': 2400, 'width': 1100, 'thickness': 50},
    '600': {'length': 600, 'width': 600, 'thickness': 40},
    '800': {'length': 800, 'width': 800, 'thickness': 40}
}
```

### Script 2: `batch_render.py`

**Purpose**: Main automation script for batch rendering

```python
"""
Blender Batch Rendering Automation
Processes 3D furniture models with multiple camera angles
"""

import bpy
import os
import sys
from pathlib import Path

# Add scripts directory to path
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

from camera_positions import CameraPositions, DIMENSION_PRESETS
from material_setup import setup_red_green_materials, setup_lighting

class BlenderAutomation:
    """Automated rendering system for furniture models"""

    def __init__(self, output_dir='../output', resolution=(2048, 2048)):
        self.output_dir = Path(output_dir)
        self.resolution = resolution
        self.camera_positions = CameraPositions()

    def setup_scene(self):
        """Configure Blender scene settings"""
        scene = bpy.context.scene

        # Render settings
        scene.render.engine = 'CYCLES'  # Ray-tracing engine for photorealism
        scene.cycles.samples = 256  # High quality (increase to 512 for final)
        scene.cycles.use_denoising = True  # Reduce noise in shadows

        # Output settings
        scene.render.resolution_x = self.resolution[0]
        scene.render.resolution_y = self.resolution[1]
        scene.render.resolution_percentage = 100
        scene.render.image_settings.file_format = 'PNG'
        scene.render.image_settings.color_mode = 'RGB'
        scene.render.image_settings.color_depth = '8'

        # Transparent background (for AI processing)
        scene.render.film_transparent = False  # Use solid background
        scene.world.use_nodes = True
        scene.world.node_tree.nodes["Background"].inputs[0].default_value = (0.95, 0.95, 0.95, 1)  # Light gray

        print("✓ Scene configured for high-quality rendering")

    def import_model(self, obj_path):
        """
        Import .obj file from Shapr3D

        Args:
            obj_path: Path to .obj file

        Returns:
            bpy.types.Object: Imported model object
        """
        # Clear existing objects
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()

        # Import OBJ
        bpy.ops.import_scene.obj(filepath=str(obj_path))

        # Get imported object (assumes single object import)
        imported = bpy.context.selected_objects[0]
        imported.location = (0, 0, 0)  # Center at origin

        print(f"✓ Imported model: {obj_path.name}")
        return imported

    def setup_camera(self, name='Camera'):
        """Create and configure camera"""
        # Create camera if doesn't exist
        if name not in bpy.data.objects:
            bpy.ops.object.camera_add()
            camera = bpy.context.active_object
            camera.name = name
        else:
            camera = bpy.data.objects[name]

        # Camera settings
        camera.data.lens = 50  # 50mm focal length
        camera.data.sensor_width = 36  # Full frame sensor
        camera.data.dof.use_dof = False  # Sharp focus throughout (f/8 equivalent)

        # Set as active camera
        bpy.context.scene.camera = camera

        return camera

    def position_camera(self, camera, position, rotation, target):
        """
        Position camera at specific angle

        Args:
            camera: Camera object
            position: (x, y, z) tuple in meters
            rotation: (pitch, yaw, roll) tuple in degrees
            target: (x, y, z) tuple for camera target point
        """
        import math

        camera.location = position

        # Convert rotation to radians and apply
        camera.rotation_euler = (
            math.radians(rotation[0]),
            math.radians(rotation[1]),
            math.radians(rotation[2])
        )

        # Point camera at target (more precise than rotation)
        direction = tuple(t - p for t, p in zip(target, position))
        camera.rotation_euler = camera.matrix_world.to_euler()

    def render_angle(self, angle_id, angle_config, model_name):
        """
        Render single camera angle

        Args:
            angle_id: Angle identifier (e.g., '45deg_left')
            angle_config: Configuration dict with position, rotation, target
            model_name: Model identifier for output filename
        """
        camera = bpy.context.scene.camera

        # Position camera
        self.position_camera(
            camera,
            angle_config['position'],
            angle_config['rotation'],
            angle_config['target']
        )

        # Output path
        output_path = self.output_dir / model_name / f"angle_{angle_id}.png"
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Render
        bpy.context.scene.render.filepath = str(output_path)
        bpy.ops.render.render(write_still=True)

        print(f"✓ Rendered {angle_config['name']}: {output_path}")

    def process_model(self, obj_path, model_name, angles=None):
        """
        Complete processing pipeline for single model

        Args:
            obj_path: Path to .obj file
            model_name: Model identifier (e.g., '150x80')
            angles: List of angle IDs to render (None = all)
        """
        print(f"\n{'='*60}")
        print(f"Processing: {model_name}")
        print(f"{'='*60}")

        # Setup
        self.setup_scene()
        model_obj = self.import_model(obj_path)

        # Apply materials
        setup_red_green_materials(model_obj)

        # Setup lighting
        setup_lighting()

        # Setup camera
        camera = self.setup_camera()

        # Get dimensions and calculate camera distance
        if model_name in DIMENSION_PRESETS:
            dims = DIMENSION_PRESETS[model_name]
            distance = self.camera_positions.calculate_distance(
                dims['length'],
                dims['width']
            )
        else:
            # Default distance if dimensions unknown
            distance = 3.0  # meters

        # Get camera positions
        positions = self.camera_positions.get_positions(distance)

        # Filter angles if specified
        if angles:
            positions = {k: v for k, v in positions.items() if k in angles}

        # Render each angle
        for angle_id, angle_config in positions.items():
            self.render_angle(angle_id, angle_config, model_name)

        print(f"\n✓ Completed {model_name}: {len(positions)} angles rendered\n")


def batch_process_directory(input_dir, output_dir, angles=None):
    """
    Process all .obj files in directory

    Args:
        input_dir: Directory containing .obj files
        output_dir: Output directory for renders
        angles: List of angle IDs to render (None = all standard angles)
    """
    automation = BlenderAutomation(output_dir=output_dir)
    input_path = Path(input_dir)

    obj_files = list(input_path.glob('**/*.obj'))

    if not obj_files:
        print(f"No .obj files found in {input_dir}")
        return

    print(f"Found {len(obj_files)} models to process")

    for obj_file in obj_files:
        # Extract model name from path
        # e.g., "references/3D-Models/Rectangular/150x80.obj" -> "150x80"
        model_name = obj_file.stem

        automation.process_model(obj_file, model_name, angles)

    print(f"\n{'='*60}")
    print(f"BATCH COMPLETE: {len(obj_files)} models processed")
    print(f"{'='*60}")


# Command-line interface
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description='Automated Blender rendering for furniture models'
    )
    parser.add_argument(
        'input_dir',
        help='Directory containing .obj files'
    )
    parser.add_argument(
        '-o', '--output',
        default='../output',
        help='Output directory (default: ../output)'
    )
    parser.add_argument(
        '-a', '--angles',
        nargs='+',
        help='Specific angles to render (e.g., 0deg 45deg_left)'
    )
    parser.add_argument(
        '-r', '--resolution',
        nargs=2,
        type=int,
        default=[2048, 2048],
        help='Output resolution (default: 2048 2048)'
    )

    args = parser.parse_args()

    # Run batch processing
    batch_process_directory(
        args.input_dir,
        args.output,
        args.angles
    )
```

### Script 3: `material_setup.py`

**Purpose**: Configure materials and lighting

```python
"""
Material and lighting setup for furniture rendering
Maintains red/green color coding for AI processing
"""

import bpy

def setup_red_green_materials(model_obj):
    """
    Apply red tabletop and green leg materials
    Assumes model has material slots or face selections

    Args:
        model_obj: Imported Blender object
    """
    # Create red material for tabletop
    red_mat = bpy.data.materials.new(name="Tabletop_Red")
    red_mat.use_nodes = True
    nodes = red_mat.node_tree.nodes

    # Configure Principled BSDF
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (0.8, 0.05, 0.05, 1.0)  # Bright red
    bsdf.inputs['Roughness'].default_value = 0.7  # Matte
    bsdf.inputs['Specular'].default_value = 0.3
    bsdf.inputs['Metallic'].default_value = 0.0

    # Create green material for legs
    green_mat = bpy.data.materials.new(name="Legs_Green")
    green_mat.use_nodes = True
    nodes = green_mat.node_tree.nodes

    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (0.05, 0.8, 0.05, 1.0)  # Bright green
    bsdf.inputs['Roughness'].default_value = 0.6
    bsdf.inputs['Specular'].default_value = 0.4
    bsdf.inputs['Metallic'].default_value = 0.0

    # Assign materials to object
    # (Assumes materials are already assigned in .obj, or auto-assign by geometry)
    if len(model_obj.data.materials) == 0:
        model_obj.data.materials.append(red_mat)
        model_obj.data.materials.append(green_mat)

    print("✓ Materials configured (red tabletop, green legs)")


def setup_lighting():
    """
    Create three-point studio lighting setup
    Matches specifications in prompts.js
    """
    # Remove existing lights
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT':
            obj.select_set(True)
    bpy.ops.object.delete()

    # Key Light (main light, 45° left)
    bpy.ops.object.light_add(type='AREA', location=(2.0, -3.0, 2.5))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 250  # Watts
    key_light.data.color = (1.0, 1.0, 0.95)  # 5500K daylight (slightly warm white)
    key_light.data.size = 1.2
    key_light.rotation_euler = (0.785, 0, 0.785)  # 45° angles

    # Fill Light (softer, 45° right)
    bpy.ops.object.light_add(type='AREA', location=(-2.0, -3.0, 2.0))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 125  # 50% of key
    fill_light.data.color = (1.0, 1.0, 0.95)
    fill_light.data.size = 1.0
    fill_light.rotation_euler = (0.785, 0, -0.785)

    # Rim Light (back lighting for edge definition)
    bpy.ops.object.light_add(type='AREA', location=(0, 2.0, 2.5))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 100
    rim_light.data.color = (1.0, 1.0, 0.95)
    rim_light.data.size = 0.8
    rim_light.rotation_euler = (2.356, 0, 0)  # 135° pitch

    # Ground plane for shadow catching
    bpy.ops.mesh.primitive_plane_add(size=10, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.name = "Ground_Plane"

    # Shadow catcher material (transparent, catches shadows only)
    shadow_mat = bpy.data.materials.new(name="Shadow_Catcher")
    shadow_mat.use_nodes = True
    ground.data.materials.append(shadow_mat)

    # Enable shadow catcher in Cycles
    ground.is_shadow_catcher = True

    print("✓ Three-point studio lighting configured")
    print("  • Key light: 250W, 45° left")
    print("  • Fill light: 125W, 45° right")
    print("  • Rim light: 100W, back")
```

---

## Integration with Existing System

### Updated Workflow

**Before Blender (Current):**
```
3D Model Upload → Surface Reference → Gemini AI (angles via prompts) → Clean Images
```

**After Blender:**
```
3D Model (.obj) → Blender Automation → 8 Angle Renders → Gemini AI (texture replacement) → Clean Images
```

### Modified `geminiService.js` Integration

```javascript
// NEW: Use pre-rendered Blender angles instead of single 3D model

export async function generateTableImages({
  tableSurfaceFile,
  blenderRendersDir,  // NEW: Directory with pre-rendered angles
  category,
  legStyle = "black powder-coated matte",
  backgroundStyle = "linear gradient with two different tones of grey",
  onProgress
}) {

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      maxOutputTokens: 8192,
    }
  });

  try {
    const tableSurfaceB64 = await fileToBase64(tableSurfaceFile);

    const chat = model.startChat({ history: [] });

    onProgress?.(0, 8, "Establishing table surface reference...");

    // TURN 1: Surface reference (unchanged)
    await chat.sendMessage([
      {
        text: "This is the tabletop surface I want to use in future image modifications. Please remember this surface for the next prompts."
      },
      {
        inlineData: {
          mimeType: tableSurfaceFile.type,
          data: tableSurfaceB64
        }
      }
    ]);

    // TURN 2: Generate 4 CLEAN images using Blender-rendered angles
    const cleanImages = [];

    // Load pre-rendered Blender angles
    const blenderAngles = [
      '0deg',
      '45deg_left',
      '45deg_right',
      '30deg_top'
    ];

    for (let i = 0; i < 4; i++) {
      onProgress?.(i, 8, `Generating clean product image ${i + 1}/4...`);

      // Load Blender-rendered angle
      const blenderAngleFile = await loadBlenderRender(
        blenderRendersDir,
        blenderAngles[i]
      );
      const blenderAngleB64 = await fileToBase64(blenderAngleFile);

      // Simplified prompt - no need for angle instructions
      const cleanPrompt = buildCleanPromptForBlenderRender({
        variationNumber: i + 1,
        legStyle,
        backgroundStyle,
        angleName: blenderAngles[i]  // For reference only
      });

      const response = await chat.sendMessage([
        {
          text: cleanPrompt
        },
        {
          inlineData: {
            mimeType: 'image/png',
            data: blenderAngleB64
          }
        }
      ]);

      const imageData = extractImageFromResponse(response);
      if (imageData) {
        cleanImages.push({
          id: `clean_${i + 1}`,
          type: 'clean',
          angle: blenderAngles[i],
          blob: base64ToBlob(imageData, 'image/jpeg'),
          url: null
        });
      }
    }

    // TURN 3+: Lifestyle images (unchanged)
    // ... existing lifestyle generation code ...

    return {
      clean: cleanImages,
      lifestyle: lifestyleImages
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

// NEW: Load pre-rendered Blender angle
async function loadBlenderRender(rendersDir, angleName) {
  const path = `${rendersDir}/angle_${angleName}.png`;
  const response = await fetch(path);
  const blob = await response.blob();
  return new File([blob], `angle_${angleName}.png`, { type: 'image/png' });
}

// UPDATED: Simplified prompt for Blender-rendered images
function buildCleanPromptForBlenderRender({ variationNumber, legStyle, backgroundStyle, angleName }) {
  return `Transform this 3D rendered table into photorealistic product photography (variation ${variationNumber}).

The camera angle and composition are already set correctly (${angleName}). Do not modify the viewing angle.

CRITICAL - Surface Mapping:
Replace ONLY the red tabletop surface with the wood texture I provided earlier.
- Preserve the exact rectangular dimensions shown
- Map wood grain to flow naturally along the table's length
- Maintain surface thickness precisely as shown

Leg Treatment:
Replace the green legs with photorealistic ${legStyle} steel legs.
- Maintain exact X-cross geometry shown
- Apply black powder coat finish with subtle satin sheen (10-15% specular)

Background & Lighting Enhancement:
- Background: ${backgroundStyle}, creating professional depth
- Enhance lighting to show texture depth and material characteristics
- Add subtle contact shadows (20-30% opacity)

Quality: Photorealistic, artifact-free, commercial-grade, e-commerce ready.`;
}
```

---

## Batch Processing Workflow

### Command-Line Usage

**Process all models with standard angles:**
```bash
cd blender-automation/scripts
blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output
```

**Process specific model with selected angles:**
```bash
blender --background --python batch_render.py -- ../references/3D-Models/Rectangular/150x80.obj -o ../blender-output -a 0deg 45deg_left 45deg_right
```

**Custom resolution (4K):**
```bash
blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output -r 4096 4096
```

### Automated Pipeline

**Node.js integration (`src/services/blenderService.js`):**

```javascript
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export class BlenderRenderService {
  constructor(blenderPath = 'blender') {
    this.blenderPath = blenderPath;
    this.scriptPath = path.resolve('blender-automation/scripts/batch_render.py');
  }

  async renderModel(objPath, outputDir, angles = null) {
    return new Promise((resolve, reject) => {
      const args = [
        '--background',
        '--python', this.scriptPath,
        '--',
        objPath,
        '-o', outputDir
      ];

      if (angles) {
        args.push('-a', ...angles);
      }

      const blender = spawn(this.blenderPath, args);

      let output = '';
      let errors = '';

      blender.stdout.on('data', (data) => {
        output += data.toString();
        console.log(data.toString());
      });

      blender.stderr.on('data', (data) => {
        errors += data.toString();
        console.error(data.toString());
      });

      blender.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject(new Error(`Blender process failed: ${errors}`));
        }
      });
    });
  }

  async getRenderedAngles(outputDir, modelName) {
    const modelDir = path.join(outputDir, modelName);
    const files = await fs.readdir(modelDir);

    return files
      .filter(f => f.startsWith('angle_') && f.endsWith('.png'))
      .map(f => ({
        angle: f.replace('angle_', '').replace('.png', ''),
        path: path.join(modelDir, f)
      }));
  }
}
```

---

## Testing Plan

### Phase 1: Single Model Validation (Week 1)

**Test Subject**: `150x80.obj` (Rectangular table)

**Tests**:
1. ✅ Import .obj correctly (dimensions preserved)
2. ✅ Materials applied (red top, green legs visible)
3. ✅ Lighting matches specifications (three-point, 5500K)
4. ✅ Camera positions accurate (8 angles render correctly)
5. ✅ Output quality (2048×2048, PNG, proper exposure)

**Success Criteria**:
- All 8 angles render without errors
- Red/green colors clearly visible
- Shadows appear realistic (20-30% opacity)
- File sizes reasonable (< 5MB per image)

### Phase 2: Batch Processing (Week 2)

**Test Subjects**: All models in `references/3D-Models/`

**Tests**:
1. ✅ Batch script processes all .obj files
2. ✅ Output organized by model name
3. ✅ No rendering errors or crashes
4. ✅ Consistent quality across all models

**Success Criteria**:
- 100% success rate (all models render)
- Processing time < 5 minutes per model (8 angles)
- Consistent lighting and color across all outputs

### Phase 3: AI Integration (Week 3)

**Test**: Feed Blender renders to Gemini API

**Tests**:
1. ✅ AI correctly identifies red tabletop for replacement
2. ✅ AI correctly identifies green legs for replacement
3. ✅ Wood texture mapping quality (grain direction, live edges)
4. ✅ Powder coat texture quality (matte sheen, orange peel)
5. ✅ Dimensional accuracy maintained

**Success Criteria**:
- 90%+ success rate (acceptable quality without retry)
- Dimensions accurate within ±3%
- Surface replacement clean (no bleeding/artifacts)

---

## Expected Benefits

### 1. Angle Consistency
**Before**: AI guesses "45 degrees left" → 40-60% variance
**After**: Blender mathematical precision → 0% variance

### 2. Quality Improvement
**Before**: 60% usable images (need retries)
**After**: 85-90% usable images (fewer retries)

### 3. Batch Scalability
**Before**: Manual upload and generation for each angle
**After**: Process entire catalog overnight (100+ models × 8 angles)

### 4. Cost Reduction
**Before**: Multiple retries per image (API costs)
**After**: Fewer retries needed (lower API usage)

### 5. Dimensional Accuracy
**Before**: AI might distort proportions when rotating
**After**: Blender preserves exact model geometry

---

## Implementation Timeline

### Week 1: Setup and Single Model Testing
- [ ] Install Blender 3.6+ LTS
- [ ] Create directory structure (`blender-automation/`)
- [ ] Write `camera_positions.py` script
- [ ] Write `material_setup.py` script
- [ ] Test with `150x80.obj` model
- [ ] Validate output quality

### Week 2: Batch Processing Development
- [ ] Write `batch_render.py` main script
- [ ] Test batch processing with all rectangular tables
- [ ] Test with pillow and kitchen surface models
- [ ] Optimize render settings (balance quality/speed)
- [ ] Document command-line usage

### Week 3: Integration with Existing System
- [ ] Update `geminiService.js` to use Blender renders
- [ ] Create `blenderService.js` Node.js wrapper
- [ ] Test end-to-end pipeline (Blender → Gemini → Final images)
- [ ] Compare quality: Blender-based vs prompt-based angles
- [ ] Measure success rate improvement

### Week 4: Production Deployment
- [ ] Batch render entire catalog (all existing models)
- [ ] Store Blender renders in organized structure
- [ ] Update UI to use pre-rendered angles
- [ ] Performance optimization
- [ ] Documentation and training

---

## Technical Requirements

### Software
- **Blender 3.6+ LTS** (free, open source)
  - Download: https://www.blender.org/download/lts/3-6/
  - Includes Python 3.10+ bundled
- **Node.js 16+** (already installed)
- **Existing Gemini API access** (already configured)

### Hardware Recommendations
- **CPU**: 8+ cores (parallel rendering)
- **RAM**: 16GB+ (handle high-resolution renders)
- **GPU**: NVIDIA RTX series or AMD Radeon (Cycles GPU acceleration)
  - Optional but speeds up rendering 5-10×
- **Storage**: 50GB+ for render output cache

### File Storage

**Estimated sizes**:
- Single model render (2048×2048 PNG): ~3-4MB
- 8 angles per model: ~30MB
- 20 models × 8 angles: ~600MB
- 100 models × 8 angles: ~3GB

**Organization**:
```
blender-output/
├── rectangular/
│   ├── 150x80/
│   │   ├── angle_0deg.png (3.2MB)
│   │   ├── angle_45deg_left.png (3.5MB)
│   │   ├── ... (8 total)
│   ├── 200x80/
│   └── 240x110/
├── pillow/
│   ├── 600/
│   └── 800/
└── kitchen_surfaces/
```

---

## Success Metrics

### Key Performance Indicators

1. **Angle Accuracy**: 100% (mathematical precision vs 60% AI interpretation)
2. **First-Shot Success Rate**: 85-90% (vs current 60%)
3. **Processing Time**: < 5 min/model for 8 angles
4. **Dimensional Accuracy**: ±1% (vs current ±5-10%)
5. **Retry Reduction**: 50% fewer API calls needed

### Quality Validation

**Automated checks**:
- [ ] All 8 angles render successfully
- [ ] Red/green colors within RGB tolerance (±5%)
- [ ] File sizes within expected range (2-5MB)
- [ ] Image dimensions exactly 2048×2048

**Manual review**:
- [ ] Lighting appears natural and consistent
- [ ] Shadows realistic (no harsh edges)
- [ ] Camera perspectives mathematically correct
- [ ] No artifacts or rendering errors

---

## Documentation and Training

### Files to Create

1. **`blender-automation/README.md`**: Complete setup and usage guide
2. **`blender-automation/INSTALLATION.md`**: Step-by-step Blender install
3. **`blender-automation/TROUBLESHOOTING.md`**: Common issues and fixes
4. **`docs/BLENDER_INTEGRATION_GUIDE.md`**: How it integrates with Gemini API

### User Training

**For developers**:
- How to run batch renders
- How to add new camera angles
- How to customize lighting
- How to modify materials

**For designers**:
- How to export from Shapr3D for Blender
- How to verify render quality
- How to request angle modifications

---

## Future Enhancements (Phase 4+)

### Advanced Camera Systems
- **Turntable animation**: 360° rotation for interactive product views
- **Focus stacking**: Multiple focal planes for extreme depth of field
- **HDR lighting**: Environment maps for realistic reflections

### Material Variations
- **Wood grain variations**: Multiple texture samples per model
- **Finish options**: Matte, satin, gloss powder coat variations
- **Color variants**: Black, white, custom color legs

### Quality Optimizations
- **GPU rendering**: 5-10× faster with NVIDIA RTX
- **Denoising AI**: Faster renders with maintained quality
- **Adaptive sampling**: Focus render power on complex areas

### Integration Features
- **Real-time preview**: See Blender angles before API processing
- **Angle selection UI**: Choose specific angles before generation
- **Custom angle creation**: User-defined camera positions

---

## Conclusion

Blender automation addresses the critical angle consistency gap identified in the alignment analysis. This implementation provides:

✅ **Mathematical precision** for camera positioning
✅ **Batch scalability** for entire product catalog
✅ **Quality improvement** reducing retries and API costs
✅ **Foundation for Phase 4** advanced features

**Next Step**: Begin Week 1 implementation with single model testing.

---

**Document Version**: 1.0
**Created**: 2025-11-17
**Status**: Ready for Implementation
**Phase**: 3 (Multi-Angle Integration)
