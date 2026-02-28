"""
Blender Batch Rendering Automation
Processes 3D furniture models with multiple camera angles for e-commerce photography.

Usage:
    blender --background --python batch_render.py -- <input_dir> -o <output_dir> [options]

Example:
    blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output

Requirements:
    - Blender 3.6+ LTS
    - Python 3.10+ (bundled with Blender)
    - camera_positions.py
    - material_setup.py
"""

import bpy
import os
import sys
from pathlib import Path
import math

# Add scripts directory to path for module imports
script_dir = Path(__file__).parent
sys.path.insert(0, str(script_dir))

from camera_positions import CameraPositions, DIMENSION_PRESETS, calculate_optimal_camera_distance
from material_setup import complete_scene_setup


class BlenderAutomation:
    """Automated rendering system for furniture models"""

    def __init__(self, output_dir='../output', resolution=(2048, 2048)):
        """
        Initialize automation system.

        Args:
            output_dir: Directory for rendered images
            resolution: Output resolution (width, height) in pixels
        """
        self.output_dir = Path(output_dir)
        self.resolution = resolution
        self.camera_positions = CameraPositions()

    def setup_scene(self):
        """Configure Blender scene settings for high-quality product photography"""
        scene = bpy.context.scene

        # Render engine: Cycles for photorealistic ray-tracing
        scene.render.engine = 'CYCLES'
        scene.cycles.samples = 256  # High quality (increase to 512 for final production)
        scene.cycles.use_denoising = True  # AI denoising for clean shadows

        # GPU acceleration (if available)
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'CUDA'  # or 'OPTIX' for RTX cards
        prefs.get_devices()
        for device in prefs.devices:
            device.use = True  # Enable all available GPUs

        # Output resolution
        scene.render.resolution_x = self.resolution[0]
        scene.render.resolution_y = self.resolution[1]
        scene.render.resolution_percentage = 100

        # Image format: PNG with RGB color
        scene.render.image_settings.file_format = 'PNG'
        scene.render.image_settings.color_mode = 'RGB'
        scene.render.image_settings.color_depth = '8'
        scene.render.image_settings.compression = 15  # 0-100, higher = smaller file

        # Background: Solid light gray (not transparent)
        scene.render.film_transparent = False

        # Color management for accurate colors
        scene.view_settings.view_transform = 'Standard'
        scene.view_settings.look = 'None'

        print("✓ Scene configured for high-quality rendering")
        print(f"  • Engine: Cycles, {scene.cycles.samples} samples")
        print(f"  • Resolution: {self.resolution[0]}×{self.resolution[1]}")
        print(f"  • Format: PNG RGB")

    def clear_scene(self):
        """Remove all objects from scene"""
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()
        print("✓ Scene cleared")

    def import_model(self, obj_path):
        """
        Import .obj file from Shapr3D or other CAD software.

        Args:
            obj_path: Path to .obj file

        Returns:
            bpy.types.Object: Imported model object (or collection of objects)
        """
        self.clear_scene()

        # Import OBJ
        bpy.ops.import_scene.obj(filepath=str(obj_path))

        # Get all imported objects
        imported_objects = bpy.context.selected_objects

        if not imported_objects:
            raise Exception(f"Failed to import model: {obj_path}")

        # If multiple objects, find the parent or largest mesh
        main_obj = imported_objects[0]
        for obj in imported_objects:
            if obj.type == 'MESH':
                # Use the object with the most vertices as main
                if len(obj.data.vertices) > len(main_obj.data.vertices):
                    main_obj = obj

        # Center model at origin
        main_obj.location = (0, 0, 0)

        print(f"✓ Imported model: {obj_path.name}")
        print(f"  • Objects: {len(imported_objects)}")
        print(f"  • Vertices: {len(main_obj.data.vertices)}")

        return main_obj

    def setup_camera(self, name='Camera'):
        """
        Create and configure camera.

        Args:
            name: Camera object name

        Returns:
            bpy.types.Object: Camera object
        """
        # Remove existing camera
        if name in bpy.data.objects:
            bpy.data.objects.remove(bpy.data.objects[name], do_unlink=True)

        # Create new camera
        bpy.ops.object.camera_add()
        camera = bpy.context.active_object
        camera.name = name

        # Camera settings: 50mm focal length, full-frame sensor
        camera.data.lens = 50  # mm
        camera.data.sensor_width = 36  # mm (full frame)
        camera.data.dof.use_dof = False  # Sharp focus throughout (f/8 equivalent)

        # Set as active camera
        bpy.context.scene.camera = camera

        print(f"✓ Camera configured: 50mm lens, full-frame sensor")

        return camera

    def position_camera(self, camera, position, rotation, target):
        """
        Position camera at specific angle.

        Args:
            camera: Camera object
            position: (x, y, z) tuple in meters
            rotation: (pitch, yaw, roll) tuple in degrees
            target: (x, y, z) tuple for camera target point
        """
        # Set position
        camera.location = position

        # Set rotation (convert degrees to radians)
        camera.rotation_euler = (
            math.radians(rotation[0]),
            math.radians(rotation[1]),
            math.radians(rotation[2])
        )

        # Point camera at target (more precise than just rotation)
        direction = tuple(t - p for t, p in zip(target, position))
        rot_quat = direction_to_rotation(direction)
        camera.rotation_euler = rot_quat.to_euler()

    def render_angle(self, angle_id, angle_config, model_name):
        """
        Render single camera angle.

        Args:
            angle_id: Angle identifier (e.g., '45deg_left')
            angle_config: Configuration dict with position, rotation, target
            model_name: Model identifier for output filename

        Returns:
            Path: Output file path
        """
        camera = bpy.context.scene.camera

        # Position camera
        self.position_camera(
            camera,
            angle_config['position'],
            angle_config['rotation'],
            angle_config['target']
        )

        # Create output directory
        output_dir = self.output_dir / model_name
        output_dir.mkdir(parents=True, exist_ok=True)

        # Output path
        output_path = output_dir / f"angle_{angle_id}.png"

        # Render
        bpy.context.scene.render.filepath = str(output_path)
        bpy.ops.render.render(write_still=True)

        print(f"✓ Rendered {angle_config['name']}: {output_path.name}")

        return output_path

    def process_model(self, obj_path, model_name=None, angles=None):
        """
        Complete processing pipeline for single model.

        Args:
            obj_path: Path to .obj file
            model_name: Model identifier (e.g., '150x80'). If None, extracted from filename.
            angles: List of angle IDs to render (None = standard 4 angles)

        Returns:
            dict: {angle_id: output_path}
        """
        # Extract model name from filename if not provided
        if model_name is None:
            model_name = Path(obj_path).stem

        print(f"\n{'='*60}")
        print(f"Processing: {model_name}")
        print(f"{'='*60}\n")

        # Setup scene
        self.setup_scene()

        # Import model
        model_obj = self.import_model(obj_path)

        # Apply materials and lighting
        complete_scene_setup(model_obj, auto_assign_materials=False)

        # Setup camera
        camera = self.setup_camera()

        # Calculate optimal camera distance
        distance = calculate_optimal_camera_distance(model_name)
        print(f"✓ Camera distance: {distance:.2f} meters")

        # Get camera positions
        positions = self.camera_positions.get_positions(distance)

        # Use standard 4-angle set if angles not specified
        if angles is None:
            angles = self.camera_positions.get_standard_set()

        # Filter to requested angles
        positions = {k: v for k, v in positions.items() if k in angles}

        print(f"\nRendering {len(positions)} angles...")

        # Render each angle
        output_files = {}
        for angle_id, angle_config in positions.items():
            output_path = self.render_angle(angle_id, angle_config, model_name)
            output_files[angle_id] = output_path

        print(f"\n✓ Completed {model_name}: {len(positions)} angles rendered")
        print(f"  Output: {self.output_dir / model_name}\n")

        return output_files


def direction_to_rotation(direction):
    """
    Convert direction vector to rotation quaternion.

    Args:
        direction: (x, y, z) direction vector

    Returns:
        mathutils.Quaternion: Rotation quaternion
    """
    import mathutils

    # Normalize direction
    direction = mathutils.Vector(direction).normalized()

    # Default forward direction (-Y in Blender)
    forward = mathutils.Vector((0, -1, 0))

    # Calculate rotation between forward and direction
    rotation = forward.rotation_difference(direction)

    return rotation


def batch_process_directory(input_dir, output_dir, angles=None, resolution=(2048, 2048)):
    """
    Process all .obj files in directory tree.

    Args:
        input_dir: Directory containing .obj files (searched recursively)
        output_dir: Output directory for renders
        angles: List of angle IDs to render (None = standard 4 angles)
        resolution: Output resolution tuple (width, height)
    """
    automation = BlenderAutomation(output_dir=output_dir, resolution=resolution)
    input_path = Path(input_dir)

    # Find all .obj files recursively
    obj_files = list(input_path.glob('**/*.obj'))

    if not obj_files:
        print(f"❌ No .obj files found in {input_dir}")
        return

    print(f"\n{'='*60}")
    print(f"BATCH PROCESSING: {len(obj_files)} models found")
    print(f"{'='*60}\n")

    success_count = 0
    fail_count = 0
    results = {}

    for i, obj_file in enumerate(obj_files, 1):
        # Extract model name from filename
        model_name = obj_file.stem

        print(f"\n[{i}/{len(obj_files)}] Processing: {model_name}")

        try:
            output_files = automation.process_model(obj_file, model_name, angles)
            results[model_name] = {'status': 'success', 'files': output_files}
            success_count += 1

        except Exception as e:
            print(f"\n❌ Failed to process {model_name}: {str(e)}")
            results[model_name] = {'status': 'failed', 'error': str(e)}
            fail_count += 1

    # Summary
    print(f"\n{'='*60}")
    print(f"BATCH COMPLETE")
    print(f"{'='*60}")
    print(f"✓ Success: {success_count}/{len(obj_files)}")
    if fail_count > 0:
        print(f"❌ Failed:  {fail_count}/{len(obj_files)}")
    print(f"Output directory: {output_dir}")
    print(f"{'='*60}\n")

    return results


def parse_arguments():
    """Parse command-line arguments (after '--')"""
    import argparse

    # Find '--' separator
    try:
        separator_index = sys.argv.index('--')
        args = sys.argv[separator_index + 1:]
    except ValueError:
        args = []

    parser = argparse.ArgumentParser(
        description='Automated Blender rendering for furniture models',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Render all models in directory with standard 4 angles
  blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output

  # Render specific model with custom angles
  blender --background --python batch_render.py -- ../references/3D-Models/Rectangular/150x80.obj -o ../blender-output -a 0deg 45deg_left

  # High-resolution 4K output
  blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output -r 4096 4096

  # All 8 angles (including isometric)
  blender --background --python batch_render.py -- ../references/3D-Models -o ../blender-output -a 0deg 45deg_left 45deg_right 30deg_top 15deg_top 60deg_left 60deg_right isometric
        """
    )

    parser.add_argument(
        'input',
        help='Path to .obj file or directory containing .obj files'
    )

    parser.add_argument(
        '-o', '--output',
        default='../output',
        help='Output directory (default: ../output)'
    )

    parser.add_argument(
        '-a', '--angles',
        nargs='+',
        help='Specific angles to render (default: standard 4-angle set: 0deg 45deg_left 45deg_right 30deg_top)'
    )

    parser.add_argument(
        '-r', '--resolution',
        nargs=2,
        type=int,
        default=[2048, 2048],
        metavar=('WIDTH', 'HEIGHT'),
        help='Output resolution in pixels (default: 2048 2048)'
    )

    return parser.parse_args(args)


# Main execution
if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════════════════════╗
║    Blender Furniture Rendering Automation v1.0             ║
║    E-commerce Product Photography Pipeline                 ║
╚════════════════════════════════════════════════════════════╝
    """)

    args = parse_arguments()

    input_path = Path(args.input)
    output_path = Path(args.output)
    resolution = tuple(args.resolution)

    print(f"Input:      {input_path}")
    print(f"Output:     {output_path}")
    print(f"Resolution: {resolution[0]}×{resolution[1]}")
    if args.angles:
        print(f"Angles:     {', '.join(args.angles)}")
    else:
        print(f"Angles:     Standard set (0deg, 45deg_left, 45deg_right, 30deg_top)")
    print()

    # Check if input is file or directory
    if input_path.is_file():
        # Single file processing
        if input_path.suffix.lower() != '.obj':
            print(f"❌ Error: Input file must be .obj format, got {input_path.suffix}")
            sys.exit(1)

        automation = BlenderAutomation(output_dir=output_path, resolution=resolution)
        automation.process_model(input_path, angles=args.angles)

    elif input_path.is_dir():
        # Batch directory processing
        batch_process_directory(input_path, output_path, args.angles, resolution)

    else:
        print(f"❌ Error: Input path does not exist: {input_path}")
        sys.exit(1)

    print("\n✓ All processing complete!\n")
