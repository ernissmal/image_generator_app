# E-commerce Furniture Photography App - Brainstorming Summary

## Project Overview

AI-powered application for generating professional e-commerce ready images of solid oak furniture using Google’s Gemini 2.5 Flash (Nano Banana) API.

## Core Problem Statement

- Client specializes in solid oak furniture manufacturing
- Need professional e-commerce photography for catalog and lifestyle scenarios
- Traditional furniture photography is expensive and logistically challenging
- Current manual approach is time-consuming and inconsistent

## Technical Foundation

### Input Materials

- 3D models from Shapr3D (precision CAD application)
- Real tabletop surface photographs (oak texture database)
- Existing furniture designs with accurate dimensions and proportions

### AI Model Selection

- **Nano Banana (Gemini 2.5 Flash Image)** identified as optimal choice
- Model ID: `gemini-2.5-flash-image-preview`
- Web interface: 92% success rate
- API interface: 60% success rate (reliability concerns addressed)
- Superior texture replacement and consistency capabilities

## Core Approach

### Hybrid Methodology

1. **3D Model Base**: Use Shapr3D exports for accurate shape and proportions
1. **Texture Replacement**: AI replaces generic tabletop with real oak photographs
1. **Enhancement**: AI improves lighting, presentation quality, and realism

### Two-Category Image Generation

#### 1. Clean Catalog Images

- Gradient backgrounds for product clarity
- Focus on material details and craftsmanship
- Professional lighting and presentation
- Multiple viewing angles per product

#### 2. Lifestyle Photography

- Realistic room environments
- Contextual furniture placement
- Various interior design styles
- Customer visualization scenarios

## Template System Architecture

### Category-Based Templates

- **Clean Images**: Gradient backgrounds, studio lighting, product focus
- **Lifestyle Images**: Room scenarios, environmental context, realistic placement

### Randomization Strategy

- Multiple template pools per category
- Random template selection to avoid repetitive imagery
- Controlled variety while maintaining quality
- Style-appropriate matching for furniture types

### Template Examples

**Clean Category:**

- Modern gradient backgrounds
- Professional studio lighting setups
- Multiple angle specifications

**Lifestyle Category:**

- Modern living rooms
- Rustic dining spaces
- Contemporary office environments
- Traditional home settings

## Multi-Angle Generation Solution

### Current Challenge

- AI struggles with spatial understanding (left/right, depth, camera positioning)
- Inconsistent results when requesting angle modifications
- Similar tables appear identical at same viewing angle

### Proposed Solution: Blender Automation

- **Tool**: Blender with Python scripting (open source)
- **Process**: Automated camera positioning around 3D models
- **Output**: Multiple pre-rendered angles for AI enhancement
- **Benefits**: Reliable angle consistency, batch processing capability

### Blender Workflow

1. Import Shapr3D models (.obj format)
1. Automated camera positioning script
1. Batch render multiple angles
1. Feed renders to AI for texture replacement and enhancement

## Application Architecture

### MVP Features

- Clean gradient image generation
- Oak texture replacement using reference photos
- Basic retry functionality
- Single template category implementation

### User Interface Components

- File upload for 3D models and texture references
- Template selection interface
- Retry button for failed generations
- Image preview and selection tools

### Advanced Features (Future)

- Template randomization system
- Lifestyle photography generation
- Batch processing capabilities
- Multi-angle automated rendering

## Technical Implementation

### API Integration

- Gemini 2.5 Flash Image Preview model
- Retry logic for improved reliability
- Specific prompt engineering for furniture photography
- Error handling and fallback mechanisms

### Prompt Engineering Strategy

- Furniture-specific terminology and context
- Material specification (solid oak emphasis)
- Lighting and presentation requirements
- Style consistency maintenance

## Competitive Advantages

1. **Niche Specialization**: Furniture-specific optimization
1. **Hybrid Approach**: Combines precision 3D modeling with AI enhancement
1. **Cost Efficiency**: Eliminates expensive traditional photography
1. **Scalability**: Batch processing capabilities
1. **Consistency**: Template-based approach ensures quality standards

## Development Roadmap

### Phase 1: MVP Development

- Basic AI integration with Nano Banana
- Clean image generation with texture replacement
- Simple user interface
- Core retry functionality

### Phase 2: Template System

- Multiple template categories
- Randomization implementation
- Enhanced prompt engineering
- Quality optimization

### Phase 3: Multi-Angle Integration

- Blender automation setup
- Batch rendering pipeline
- Advanced angle generation
- Workflow optimization

### Phase 4: Advanced Features

- Lifestyle photography generation
- Advanced template randomization
- Performance optimization
- User experience enhancements

## Key Technical Challenges

1. **AI Consistency**: Maintaining texture and proportion accuracy across generations
1. **Spatial Understanding**: AI limitations with angle and positioning modifications
1. **Template Variety**: Balancing consistency with visual diversity
1. **Workflow Integration**: Seamless 3D model to final image pipeline

## Success Metrics

- **Quality**: Professional-grade e-commerce imagery
- **Efficiency**: Reduced photography time and costs
- **Consistency**: Reliable results across product catalog
- **Scalability**: Ability to handle large product volumes

## Technology Stack

- **AI Model**: Google Gemini 2.5 Flash Image (Nano Banana)
- **3D Modeling**: Shapr3D
- **Rendering**: Blender with Python automation
- **Development**: API integration with retry logic
- **File Formats**: .obj for 3D models, standard image formats for output

## Next Steps

1. Test Nano Banana API reliability with furniture-specific prompts
1. Develop basic MVP with clean image generation
1. Experiment with Blender automation for multi-angle rendering
1. Implement template system architecture
1. Create comprehensive prompt engineering templates

-----

**Project Goal**: Transform furniture e-commerce photography through AI-powered automation while maintaining professional quality and reducing costs.