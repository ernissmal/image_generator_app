"""
Camera position definitions for automated furniture rendering
Coordinates in Blender units (1 unit = 1 meter)

This module provides standardized camera angles for product photography,
ensuring consistent perspectives across all furniture models.
"""

import math

class CameraPositions:
    """Standard camera angles for furniture photography"""

    @staticmethod
    def calculate_distance(table_length_mm, table_width_mm):
        """
        Calculate optimal camera distance based on table dimensions.
        Formula: 2.5x longest dimension for natural 50mm lens perspective

        Args:
            table_length_mm: Table length in millimeters
            table_width_mm: Table width in millimeters

        Returns:
            float: Camera distance in meters
        """
        max_dimension_m = max(table_length_mm, table_width_mm) / 1000.0
        return max_dimension_m * 2.5

    @staticmethod
    def get_positions(distance, table_height_mm=750):
        """
        Generate camera positions for standard angles.

        Args:
            distance: Camera distance from table center (meters)
            table_height_mm: Table height in millimeters (default: 750mm standard table height)

        Returns:
            dict: Camera configurations {angle_id: {position, rotation, name, target}}
        """
        table_height_m = table_height_mm / 1000.0

        return {
            '0deg': {
                'name': 'Front Center',
                'description': 'Direct front view with slight elevation',
                'position': (0, -distance, table_height_m + 0.3),  # 10° elevation
                'rotation': (80, 0, 0),  # Pitch, yaw, roll (degrees)
                'target': (0, 0, table_height_m / 2)
            },

            '45deg_left': {
                'name': 'Three-Quarter Left',
                'description': 'Classic product photography angle from front-left',
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
                'description': 'Classic product photography angle from front-right',
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
                'description': 'Front view with 30° elevation for dimensional clarity',
                'position': (0, -distance * 0.9, table_height_m + 0.8),
                'rotation': (70, 0, 0),
                'target': (0, 0, table_height_m / 2)
            },

            '15deg_top': {
                'name': 'Medium Elevation',
                'description': 'Front view with 15° elevation',
                'position': (0, -distance, table_height_m + 0.5),
                'rotation': (75, 0, 0),
                'target': (0, 0, table_height_m / 2)
            },

            '60deg_left': {
                'name': 'Side Left',
                'description': 'Side perspective from 60° left',
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
                'description': 'Side perspective from 60° right',
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
                'description': 'Technical drawing style isometric view',
                'position': (
                    -distance * math.sin(math.radians(45)),
                    -distance * math.cos(math.radians(45)),
                    table_height_m + distance * math.tan(math.radians(35.264))
                ),
                'rotation': (90 - 35.264, 0, -45),
                'target': (0, 0, table_height_m / 2)
            }
        }

    @staticmethod
    def get_standard_set():
        """
        Get the standard 4-angle set used for clean product photography.

        Returns:
            list: Standard angle IDs ['0deg', '45deg_left', '45deg_right', '30deg_top']
        """
        return ['0deg', '45deg_left', '45deg_right', '30deg_top']


# Dimension presets for existing models
DIMENSION_PRESETS = {
    '150x80': {
        'length': 1500,  # mm
        'width': 800,    # mm
        'thickness': 40, # mm
        'ratio': 1.875,
        'category': 'rectangular'
    },
    '200x80': {
        'length': 2000,
        'width': 800,
        'thickness': 40,
        'ratio': 2.5,
        'category': 'rectangular'
    },
    '240x110': {
        'length': 2400,
        'width': 1100,
        'thickness': 50,
        'ratio': 2.18,
        'category': 'rectangular'
    },
    '600': {
        'length': 600,
        'width': 600,
        'thickness': 40,
        'ratio': 1.0,
        'category': 'pillow'
    },
    '800': {
        'length': 800,
        'width': 800,
        'thickness': 40,
        'ratio': 1.0,
        'category': 'pillow'
    }
}


def get_model_dimensions(model_name):
    """
    Get dimensions for a model by name.

    Args:
        model_name: Model identifier (e.g., '150x80', '600')

    Returns:
        dict: Dimension specifications or None if not found
    """
    return DIMENSION_PRESETS.get(model_name)


def calculate_optimal_camera_distance(model_name):
    """
    Calculate optimal camera distance for a specific model.

    Args:
        model_name: Model identifier (e.g., '150x80')

    Returns:
        float: Camera distance in meters, or 3.0 as default
    """
    dims = get_model_dimensions(model_name)
    if dims:
        return CameraPositions.calculate_distance(dims['length'], dims['width'])
    return 3.0  # Default fallback


if __name__ == "__main__":
    # Demo: Show camera positions for 150x80 table
    print("="*60)
    print("Camera Position Calculator - Demo")
    print("="*60)

    model = '150x80'
    dims = get_model_dimensions(model)

    if dims:
        print(f"\nModel: {model}")
        print(f"Dimensions: {dims['length']}mm × {dims['width']}mm × {dims['thickness']}mm")
        print(f"Ratio: {dims['ratio']}:1")

        distance = calculate_optimal_camera_distance(model)
        print(f"\nOptimal camera distance: {distance:.2f} meters")

        positions = CameraPositions.get_positions(distance)

        print(f"\nStandard camera angles:\n")
        for angle_id in CameraPositions.get_standard_set():
            config = positions[angle_id]
            print(f"  {angle_id:15} - {config['name']:20} - {config['description']}")
            print(f"                  Position: {config['position']}")
            print(f"                  Rotation: {config['rotation']}")
            print()

    print("="*60)
