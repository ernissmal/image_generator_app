const express = require('express');
const path = require('path');
const fs = require('fs');
const GeminiClient = require('../services/gemini-client');

const router = express.Router();

// Initialize Gemini client
const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY);

// Prompts from config/prompts.js
const PROMPTS = {
  surfaceReference: `This is the tabletop surface I want to use in future image modifications. Please remember this surface for the next prompts.`,

  cleanPhotography: {
    base: `TASK: Take Image 2 (the complete table with legs) and replace ONLY its tabletop surface with the texture from Image 1.

STRICT RULES - DO NOT DEVIATE:
1. START WITH: Use Image 2 as your BASE - this shows the EXACT table design
2. REPLACE ONLY: The tabletop surface texture with the pattern from Image 1
3. KEEP 100% IDENTICAL:
   - Table dimensions (length, width, height) from Image 2
   - Leg design (shape, thickness, position, material) from Image 2
   - Table proportions and scale from Image 2
   - Overall structure from Image 2

4. DO NOT:
   - Change table size or scale
   - Add decorative elements to legs
   - Modify leg design in ANY way
   - Add weird lines, patterns, or embellishments
   - Change table proportions
   - Make the table larger or smaller

5. CAMERA ANGLE: Variation {variationNumber}
   - Use a slightly different viewing angle (15-35 degrees)
   - Same lighting and composition

6. BACKGROUND: {backgroundStyle}
   - Clean professional studio
   - Soft gradient
   - Minimal shadows

THINK OF IT AS: Photo editing - you're ONLY replacing the tabletop texture, keeping everything else from the 3D model reference exactly as-is.

Variation {variationNumber}: Only the camera angle changes. The table itself is IDENTICAL.`
  },

  lifestylePhotography: {
    base: `Create a realistic lifestyle photograph featuring the table from the reference image.

CRITICAL: The table MUST be IDENTICAL to the reference (same surface texture, same legs, same finish).

SCENE TYPE: {categoryDescription}

VARIATION {variationNumber} SPECIFIC SETTING:
{variationSettings}

REQUIREMENTS:
1. Table: Use the EXACT table from reference (surface + legs unchanged)
2. Setting: Create a DIFFERENT room/space for each variation
3. Props: Add realistic items that fit the category and variation
4. Authenticity: Middle-class, relatable spaces (not luxury/palace settings)

PHOTOGRAPHY STYLE:
- Professional lifestyle photography
- Natural, realistic lighting (window light, lamps, ambient)
- Lived-in, authentic feel (slightly messy is OK)
- Photorealistic rendering
- Table is main subject but naturally integrated
- Variation {variationNumber}: Unique room, different decor, distinct atmosphere

COMPOSITION:
- Vary camera angle and distance for each variation
- Different times of day (morning light, afternoon, evening)
- Natural shadows and reflections
- Warm, inviting, realistic atmosphere

CRITICAL: Each variation should look like a COMPLETELY DIFFERENT location, not the same room from different angles.`,

    categoryDescriptions: {
      cafe: "a cozy café setting",
      office: "a professional office environment",
      dining: "a home dining area",
      living: "a comfortable living space"
    },

    variationSettings: {
      cafe: [
        "Small independent coffee shop with exposed brick, vintage furniture, afternoon natural light from large windows",
        "Modern minimalist café with white walls, potted plants, morning sunlight, clean Scandinavian aesthetic",
        "Rustic café with wooden beams, warm pendant lights, cozy corner seating, evening ambiance",
        "Industrial-chic café with concrete floors, metal fixtures, large factory windows, midday bright light"
      ],
      office: [
        "Home office with bookshelves, desk lamp, laptop nearby, window with city view, morning light",
        "Modern co-working space with white walls, minimalist decor, natural light from skylights",
        "Traditional office with wood paneling, professional setting, warm desk lamp, afternoon light",
        "Creative studio workspace with colorful walls, art supplies, bright natural light, casual vibe"
      ],
      dining: [
        "Traditional dining room with warm walls, chandelier above, family photos on walls, evening lighting",
        "Modern open-plan dining area near kitchen, pendant lights, bright and airy, daytime",
        "Cozy breakfast nook with window seat, morning sunlight streaming in, casual homey feel",
        "Farmhouse-style dining room with rustic decor, wooden chairs, soft warm lighting, inviting atmosphere"
      ],
      living: [
        "Bright living room with large windows, sofa in background, plants, morning natural light",
        "Cozy living space with warm lamps, bookshelves, evening ambiance, comfortable and lived-in",
        "Modern minimalist living room with neutral tones, clean lines, afternoon soft light through curtains",
        "Eclectic living space with colorful accents, gallery wall, natural midday light, personal touches"
      ]
    }
  },

  defaults: {
    legStyle: "black powder-coated matte",
    backgroundStyle: "linear gradient with two different tones of grey"
  }
};

/**
 * POST /api/table-topper/generate-clean
 * Turn 2: Generate clean product image with gradient background
 *
 * Body:
 * {
 *   "referenceImage": "references/surfaces/straight240.png",
 *   "variationNumber": 1,
 *   "legStyle": "black powder-coated matte",
 *   "backgroundStyle": "linear gradient with two different tones of grey"
 * }
 */
router.post('/api/table-topper/generate-clean', async (req, res) => {
  try {
    const {
      referenceImage,
      modelReference = null,  // Optional 3D model reference for exact leg design
      variationNumber = 1,
      legStyle = PROMPTS.defaults.legStyle,
      backgroundStyle = PROMPTS.defaults.backgroundStyle
    } = req.body;

    // Validation
    if (!referenceImage) {
      return res.status(400).json({
        success: false,
        error: 'referenceImage is required'
      });
    }

    // Get reference image path
    let referencePath;
    if (referenceImage.startsWith('references/')) {
      referencePath = path.join(__dirname, '../..', referenceImage);
    } else {
      referencePath = path.join(__dirname, '../../uploads', referenceImage);
    }

    // Verify file exists
    if (!fs.existsSync(referencePath)) {
      return res.status(404).json({
        success: false,
        error: `Reference image not found: ${referenceImage}`
      });
    }

    // Read reference image (surface)
    const referenceImageBase64 = fs.readFileSync(referencePath).toString('base64');

    // Read model reference if provided (for exact leg design)
    let modelReferenceBase64 = null;
    if (modelReference) {
      const modelPath = modelReference.startsWith('references/')
        ? path.join(__dirname, '../..', modelReference)
        : path.join(__dirname, '../../references', modelReference);

      if (fs.existsSync(modelPath)) {
        modelReferenceBase64 = fs.readFileSync(modelPath).toString('base64');
        console.log(`📐 Using 3D model reference: ${modelReference}`);
      }
    }

    // Build the prompt with explicit image generation instruction
    const basePrompt = PROMPTS.cleanPhotography.base
      .replace('{variationNumber}', variationNumber)
      .replace('{legStyle}', legStyle)
      .replace('{backgroundStyle}', backgroundStyle);

    // Add explicit instruction for image generation
    const prompt = `${basePrompt}

IMPORTANT: Generate and output a new image (not text). The output must be a generated image file.`;

    console.log(`🎨 Generating clean image - Variation ${variationNumber}`);

    // Generate image using Gemini with model reference if available
    let result;
    if (modelReferenceBase64) {
      // Use two-image method for better leg design matching
      result = await geminiClient.generateAngleWithReference({
        prompt: prompt,
        productImageBase64: referenceImageBase64,  // Surface
        referenceImageBase64: modelReferenceBase64, // 3D model
        parameters: {
          temperature: 0.3,
          top_p: 0.85,
          top_k: 30
        }
      });
    } else {
      // Use single-image method
      result = await geminiClient.generateImageFromBase64({
        prompt: prompt,
        imageBase64: referenceImageBase64,
        parameters: {
          temperature: 0.3,
          top_p: 0.85,
          top_k: 30
        }
      });
    }

    if (result.success) {
      // Save generated image
      const generatedDir = path.join(__dirname, '../../generated');
      if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
      }

      const timestamp = Date.now();
      const filename = `table-clean-v${variationNumber}-${timestamp}.png`;
      const outputPath = path.join(generatedDir, filename);

      // Decode base64 and save
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);

      res.json({
        success: true,
        data: {
          filename: filename,
          path: `/generated/${filename}`,
          variationNumber: variationNumber,
          type: 'clean'
        }
      });

      console.log(`✅ Generated clean image: ${filename}`);
    } else {
      throw new Error(result.error?.userMessage || 'Generation failed');
    }

  } catch (error) {
    console.error('Clean image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate clean image'
    });
  }
});

/**
 * POST /api/table-topper/generate-lifestyle
 * Turn 3+: Generate lifestyle image using clean image as reference
 *
 * Body:
 * {
 *   "cleanImagePath": "/generated/table-clean-v1-123456.png",
 *   "category": "cafe",
 *   "variationNumber": 1
 * }
 */
router.post('/api/table-topper/generate-lifestyle', async (req, res) => {
  try {
    const {
      cleanImagePath,
      category,
      variationNumber = 1
    } = req.body;

    // Validation
    if (!cleanImagePath || !category) {
      return res.status(400).json({
        success: false,
        error: 'cleanImagePath and category are required'
      });
    }

    // Get clean image path
    let cleanPath;
    if (cleanImagePath.startsWith('/generated/')) {
      cleanPath = path.join(__dirname, '../..', cleanImagePath);
    } else {
      cleanPath = path.join(__dirname, '../../generated', cleanImagePath);
    }

    // Verify file exists
    if (!fs.existsSync(cleanPath)) {
      return res.status(404).json({
        success: false,
        error: `Clean image not found: ${cleanImagePath}`
      });
    }

    // Read clean image
    const cleanImageBase64 = fs.readFileSync(cleanPath).toString('base64');

    // Get category description and specific variation setting
    const categoryDescription = PROMPTS.lifestylePhotography.categoryDescriptions[category]
      || PROMPTS.lifestylePhotography.categoryDescriptions.cafe;

    // Get specific setting for this variation (0-indexed, so subtract 1)
    const variationSettings = PROMPTS.lifestylePhotography.variationSettings[category] || PROMPTS.lifestylePhotography.variationSettings.cafe;
    const specificSetting = variationSettings[(variationNumber - 1) % variationSettings.length];

    // Build the prompt with explicit image generation instruction
    const basePrompt = PROMPTS.lifestylePhotography.base
      .replace('{variationNumber}', variationNumber)
      .replace('{categoryDescription}', categoryDescription)
      .replace('{variationSettings}', specificSetting);

    // Add explicit instruction for image generation
    const prompt = `${basePrompt}

IMPORTANT: Generate and output a new image (not text). The output must be a generated image file.`;

    console.log(`🎨 Generating lifestyle image - ${category} - Variation ${variationNumber}`);

    // Generate image using Gemini with enhanced parameters for quality
    const result = await geminiClient.generateImageFromBase64({
      prompt: prompt,
      imageBase64: cleanImageBase64,
      parameters: {
        temperature: 0.4,  // Slightly higher for creative lifestyle scenes
        top_p: 0.9,
        top_k: 40
      }
    });

    if (result.success) {
      // Save generated image
      const generatedDir = path.join(__dirname, '../../generated');
      if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir, { recursive: true });
      }

      const timestamp = Date.now();
      const filename = `table-lifestyle-${category}-v${variationNumber}-${timestamp}.png`;
      const outputPath = path.join(generatedDir, filename);

      // Decode base64 and save
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);

      res.json({
        success: true,
        data: {
          filename: filename,
          path: `/generated/${filename}`,
          variationNumber: variationNumber,
          category: category,
          type: 'lifestyle'
        }
      });

      console.log(`✅ Generated lifestyle image: ${filename}`);
    } else {
      throw new Error(result.error?.userMessage || 'Generation failed');
    }

  } catch (error) {
    console.error('Lifestyle image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate lifestyle image'
    });
  }
});

module.exports = router;
