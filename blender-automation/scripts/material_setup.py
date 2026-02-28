"""
Material and lighting setup for furniture rendering.
Maintains red/green color coding for AI processing.

This module configures:
- Red tabletop materials (for AI wood texture replacement)
- Green leg materials (for AI powder coat replacement)
- Three-point studio lighting (matching prompt specifications)
"""

import bpy
import math


def setup_red_green_materials(model_obj):
    """
    Apply red tabletop and green leg materials to maintain color coding for AI.

    Args:
        model_obj: Imported Blender object (furniture model)

    Notes:
        - Red marks tabletop surfaces for wood texture replacement
        - Green marks legs/frame for powder coat replacement
        - Colors must be bright and distinct for AI recognition
    """
    # Create red material for tabletop
    red_mat = bpy.data.materials.new(name="Tabletop_Red")
    red_mat.use_nodes = True
    nodes = red_mat.node_tree.nodes

    # Configure Principled BSDF for red tabletop
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (0.8, 0.05, 0.05, 1.0)  # Bright red
    bsdf.inputs['Roughness'].default_value = 0.7  # Matte finish
    bsdf.inputs['Specular'].default_value = 0.3
    bsdf.inputs['Metallic'].default_value = 0.0

    # Create green material for legs
    green_mat = bpy.data.materials.new(name="Legs_Green")
    green_mat.use_nodes = True
    nodes = green_mat.node_tree.nodes

    # Configure Principled BSDF for green legs
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs['Base Color'].default_value = (0.05, 0.8, 0.05, 1.0)  # Bright green
    bsdf.inputs['Roughness'].default_value = 0.6
    bsdf.inputs['Specular'].default_value = 0.4
    bsdf.inputs['Metallic'].default_value = 0.0

    # Assign materials to object
    # Clear existing materials first
    model_obj.data.materials.clear()

    # Add materials (order matters if using material slots)
    model_obj.data.materials.append(red_mat)
    model_obj.data.materials.append(green_mat)

    # If the model has multiple objects, apply to all
    if hasattr(model_obj, 'children'):
        for child in model_obj.children:
            if child.type == 'MESH':
                child.data.materials.clear()
                child.data.materials.append(red_mat)
                child.data.materials.append(green_mat)

    print("✓ Materials configured (red tabletop, green legs)")


def setup_lighting():
    """
    Create three-point studio lighting setup.
    Matches specifications in src/config/prompts.js v2.0.0:
    - 5500K color temperature (daylight)
    - Three-point softbox configuration
    - Key light: 250W, 45° camera-left
    - Fill light: 125W (50% key), 45° camera-right
    - Rim light: 100W, backlight
    """
    # Remove existing lights
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        if obj.type == 'LIGHT':
            obj.select_set(True)
    bpy.ops.object.delete()

    # Key Light (main light, 45° left, 30° elevation)
    bpy.ops.object.light_add(type='AREA', location=(2.0, -3.0, 2.5))
    key_light = bpy.context.active_object
    key_light.name = "Key_Light"
    key_light.data.energy = 250  # Watts
    key_light.data.color = (1.0, 1.0, 0.95)  # 5500K daylight (slightly warm white)
    key_light.data.size = 1.2  # Softbox size in meters
    key_light.rotation_euler = (math.radians(45), 0, math.radians(45))

    # Fill Light (softer, opposite side, 50% power)
    bpy.ops.object.light_add(type='AREA', location=(-2.0, -3.0, 2.0))
    fill_light = bpy.context.active_object
    fill_light.name = "Fill_Light"
    fill_light.data.energy = 125  # 50% of key light
    fill_light.data.color = (1.0, 1.0, 0.95)
    fill_light.data.size = 1.0
    fill_light.rotation_euler = (math.radians(45), 0, math.radians(-45))

    # Rim Light (back lighting for edge definition)
    bpy.ops.object.light_add(type='AREA', location=(0, 2.0, 2.5))
    rim_light = bpy.context.active_object
    rim_light.name = "Rim_Light"
    rim_light.data.energy = 100
    rim_light.data.color = (1.0, 1.0, 0.95)
    rim_light.data.size = 0.8
    rim_light.rotation_euler = (math.radians(135), 0, 0)

    print("✓ Three-point studio lighting configured")
    print("  • Key light: 250W, 45° left, 5500K")
    print("  • Fill light: 125W, 45° right, 5500K")
    print("  • Rim light: 100W, back, 5500K")


def setup_ground_plane():
    """
    Create ground plane with shadow catcher material.
    Allows realistic contact shadows while maintaining transparent or solid background.
    """
    # Remove existing ground planes
    for obj in bpy.data.objects:
        if obj.name.startswith("Ground_Plane"):
            bpy.data.objects.remove(obj, do_unlink=True)

    # Create new ground plane
    bpy.ops.mesh.primitive_plane_add(size=10, location=(0, 0, 0))
    ground = bpy.context.active_object
    ground.name = "Ground_Plane"

    # Shadow catcher material
    shadow_mat = bpy.data.materials.new(name="Shadow_Catcher")
    shadow_mat.use_nodes = True
    ground.data.materials.append(shadow_mat)

    # Enable shadow catcher (Cycles only)
    ground.is_shadow_catcher = True

    # Alternatively, create a simple gray matte material for solid background
    # Uncomment if you want visible ground instead of shadow-only:
    # nodes = shadow_mat.node_tree.nodes
    # bsdf = nodes.get("Principled BSDF")
    # bsdf.inputs['Base Color'].default_value = (0.95, 0.95, 0.95, 1.0)  # Light gray
    # bsdf.inputs['Roughness'].default_value = 1.0  # Completely matte

    print("✓ Ground plane with shadow catcher configured")


def setup_world_background(color=(0.95, 0.95, 0.95)):
    """
    Configure world background color.

    Args:
        color: RGB tuple (0-1 range), default light gray
    """
    world = bpy.context.scene.world
    world.use_nodes = True

    bg_node = world.node_tree.nodes.get("Background")
    if bg_node:
        bg_node.inputs['Color'].default_value = (*color, 1.0)
        bg_node.inputs['Strength'].default_value = 1.0

    print(f"✓ World background set to RGB{color}")


def apply_material_by_geometry(model_obj, z_threshold=0.5):
    """
    Advanced: Apply materials based on geometry (top surfaces = red, rest = green).
    Useful if imported .obj doesn't have pre-assigned materials.

    Args:
        model_obj: Mesh object
        z_threshold: Height threshold (meters) to distinguish tabletop from legs

    Notes:
        This is an automated approach that detects horizontal top surfaces.
        May need adjustment based on your specific 3D model structure.
    """
    if model_obj.type != 'MESH':
        print(f"⚠ Cannot apply materials to non-mesh object: {model_obj.name}")
        return

    mesh = model_obj.data

    # Ensure we have materials
    if len(mesh.materials) < 2:
        print("⚠ Object needs 2 material slots. Use setup_red_green_materials() first.")
        return

    # Enter edit mode
    bpy.context.view_layer.objects.active = model_obj
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='DESELECT')
    bpy.ops.object.mode_set(mode='OBJECT')

    # Analyze faces and assign materials
    red_mat_index = 0  # Tabletop
    green_mat_index = 1  # Legs

    for poly in mesh.polygons:
        # Check if face is horizontal and elevated (likely tabletop)
        if poly.normal.z > 0.9 and poly.center.z > z_threshold:
            poly.material_index = red_mat_index
        else:
            poly.material_index = green_mat_index

    print(f"✓ Materials assigned by geometry (z_threshold={z_threshold}m)")


def complete_scene_setup(model_obj, auto_assign_materials=False):
    """
    Complete scene setup with all components.

    Args:
        model_obj: Imported furniture model
        auto_assign_materials: If True, attempts automatic material assignment by geometry
    """
    print("\n" + "="*60)
    print("Setting up complete rendering scene")
    print("="*60 + "\n")

    # Setup materials
    setup_red_green_materials(model_obj)

    if auto_assign_materials:
        apply_material_by_geometry(model_obj)

    # Setup lighting
    setup_lighting()

    # Setup ground plane
    setup_ground_plane()

    # Setup world background
    setup_world_background()

    print("\n" + "="*60)
    print("✓ Scene setup complete")
    print("="*60 + "\n")


if __name__ == "__main__":
    # Demo: This would run inside Blender's Python environment
    print("="*60)
    print("Material & Lighting Setup Module")
    print("="*60)
    print("\nThis module provides:")
    print("  • Red/green material configuration for AI processing")
    print("  • Three-point studio lighting (5500K, professional setup)")
    print("  • Shadow catcher ground plane")
    print("  • World background configuration")
    print("\nUsage:")
    print("  1. Import this module in batch_render.py")
    print("  2. Call complete_scene_setup(model_obj) after importing .obj")
    print("  3. Blender will configure all materials and lighting automatically")
    print("\n" + "="*60)
