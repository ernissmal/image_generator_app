# Nano Banana Image Generator - Complete Guide

## Overview

The Nano Banana Image Generator is a web application that leverages Google's Gemini 2.5 Flash Image model (nicknamed "Nano Banana") to generate high-quality, context-aware images from text descriptions.

## What is Nano Banana?

**Nano Banana** is the community nickname for **Gemini 2.5 Flash Image**, Google's state-of-the-art image generation model. Key features include:

- **Model ID**: `gemini-2.5-flash-image-preview`
- **Pricing**: $0.039 per image
- **Capabilities**: Text-to-image generation, multiple aspect ratios, photorealistic output
- **Token Usage**: ~1290-1400 tokens per image

## Features Implemented

### 1. Context-Based Image Generation

The app supports 5 distinct style contexts:

- **Modern** 🏙️ - Sleek, contemporary design with clean lines
- **Rustic** 🏡 - Countryside charm with natural materials
- **London** 🇬🇧 - Iconic British architecture and atmosphere
- **Urban** 🌆 - Dynamic city environment
- **Nature** 🌲 - Natural outdoor settings

### 2. People Toggle

Control whether people appear in generated images:
- **With People**: Shows 1-3 people naturally integrated into the scene
- **Without People**: Focuses on environment and atmosphere only

### 3. Aspect Ratio Support

9 different aspect ratios available:
- Square (1:1) - 1024×1024
- Landscape Wide (16:9) - 1344×768
- Portrait Tall (9:16) - 768×1344
- Landscape (4:3) - 1184×864
- Portrait (3:4) - 864×1184
- Photo Landscape (3:2) - 1248×832
- Photo Portrait (2:3) - 832×1248
- Wide Print (5:4) - 1152×896
- Tall Print (4:5) - 896×1152

## Architecture

### Backend Components

#### NanoBananaClient (`src/services/nano-banana-client.js`)
- Handles all Gemini 2.5 Flash Image API interactions
- Implements rate limiting (15 requests/minute)
- Automatic retry logic with exponential backoff
- Context-aware prompt enhancement
- Error classification and handling

#### API Routes (`src/routes/nano-banana.js`)
- `POST /api/nano-banana/generate` - Generate images
- `GET /api/nano-banana/contexts` - Get available contexts
- `GET /api/nano-banana/aspect-ratios` - Get aspect ratio options
- `GET /api/nano-banana/health` - Health check endpoint

### Frontend

#### User Interface (`prototype/nano-banana.html`)
- Modern, responsive design
- Real-time image generation
- Context selection with visual cards
- Interactive toggle for people inclusion
- Metadata display (tokens used, context, etc.)

## Usage

### Starting the Application

```bash
npm start
```

Server runs on: `http://localhost:3000`

### Access Points

- **Main UI**: `http://localhost:3000/nano-banana.html`
- **API Base**: `http://localhost:3000/api/nano-banana/`

### API Example

```bash
curl -X POST http://localhost:3000/api/nano-banana/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A cozy coffee shop interior with wooden furniture",
    "context": "rustic",
    "includePeople": false,
    "aspectRatio": "16:9"
  }'
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "/generated/nano-banana-1762205332791.png",
  "metadata": {
    "context": "rustic",
    "includePeople": false,
    "aspectRatio": "16:9",
    "tokensUsed": 1393,
    "attempt": 1
  }
}
```

## How Context Enhancement Works

When you provide a prompt, the system enhances it with context-specific instructions:

**Your prompt:**
```
A cozy coffee shop interior with wooden furniture
```

**Enhanced prompt sent to Nano Banana:**
```
A cozy coffee shop interior with wooden furniture

STYLE CONTEXT: Rustic, countryside, traditional design with natural materials, vintage elements
LIGHTING: Warm, golden hour lighting with natural ambiance
MOOD: Cozy, authentic, charming, nostalgic
PEOPLE: No people in the scene - focus on the environment, objects, and atmosphere without any human subjects.

Create a high-quality, photorealistic image that matches this aesthetic. Ensure professional photography quality with proper composition, depth, and attention to detail.
```

## Testing Results

Successfully tested with multiple context combinations:

1. **Rustic Coffee Shop** (No people, 16:9) ✅
   - Tokens: 1393
   - File size: 1.6MB
   - Generation time: ~10s

2. **Modern Office** (With people, 4:3) ✅
   - Tokens: 1398
   - File size: 1.4MB
   - Generation time: ~11s

3. **London Tower Bridge** (No people, 16:9) ✅
   - Tokens: 1391
   - File size: 1.6MB
   - Generation time: ~9s

## Configuration

### Environment Variables

Required in `.env`:
```
GOOGLE_AI_STUDIO_API=your_api_key_here
```

### Rate Limits

- Maximum 15 requests per minute (API limitation)
- Automatic rate limiting implemented in client
- Retry logic: Up to 3 attempts with exponential backoff

## Cost Estimation

- **Per Image**: $0.039
- **100 Images**: $3.90
- **1,000 Images**: $39.00

Token usage typically ranges from 1290-1400 tokens per image.

## Error Handling

The system classifies and handles various error types:

- **RATE_LIMIT**: Automatic wait and retry
- **AUTH_ERROR**: Configuration issue, needs manual fix
- **NETWORK_ERROR**: Retry with backoff
- **SAFETY_ERROR**: Content filtered, modify prompt
- **UNKNOWN_ERROR**: General failure, retry recommended

## Future Enhancements

Potential improvements:
- Batch image generation
- Image editing capabilities (Nano Banana supports this)
- Style transfer with reference images
- Gallery view for generated images
- User accounts and image history
- Advanced prompt templates
- Multi-language support

## API Reference

### Generate Image

**Endpoint:** `POST /api/nano-banana/generate`

**Request Body:**
```typescript
{
  prompt: string;        // Required: Image description
  context: string;       // Optional: "modern" | "rustic" | "london" | "urban" | "nature"
  includePeople: boolean; // Optional: Include people in scene
  aspectRatio: string;   // Optional: "1:1" | "16:9" | "9:16" | etc.
}
```

**Response:**
```typescript
{
  success: boolean;
  imageUrl: string;      // Path to generated image
  metadata: {
    context: string;
    includePeople: boolean;
    aspectRatio: string;
    prompt: string;      // Enhanced prompt used
    tokensUsed: number;
    attempt: number;
  }
}
```

## Resources

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [API Key Management](https://aistudio.google.com/apikey)

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify API key is correctly configured
3. Ensure rate limits aren't exceeded
4. Review generated image quality and adjust prompts

---

**Built with Google Gemini 2.5 Flash Image (Nano Banana) 🍌**
