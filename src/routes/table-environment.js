const express = require('express');
const path = require('path');
const fs = require('fs');
const GeminiClient = require('../services/gemini-client');
const PromptTemplateLoader = require('../services/prompt-template-loader');

const router = express.Router();

// Initialize services
const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY);
const templateLoader = new PromptTemplateLoader();

// Load templates on startup
try {
  templateLoader.loadAll();
  console.log('✅ Table environment templates loaded');
} catch (error) {
  console.error('❌ Failed to load templates:', error.message);
}

// Available angles for random selection
const AVAILABLE_ANGLES = [
  'angle-0deg-top',
  'angle-45deg-top',
  'angle-90deg-top',
  'angle-135deg-top',
  'angle-180deg-top',
  'angle-270deg-top',
  'isometric-3d',
  'side-profile'
];

/**
 * POST /api/table-environment/generate
 * Generate 6 images of a table in a specific environment with random angles
 *
 * Body:
 * {
 *   "tableFilename": "product-123456789.jpg",
 *   "environment": "modern",
 *   "count": 6
 * }
 */
router.post('/api/table-environment/generate', async (req, res) => {
  try {
    const { tableFilename, environment = 'modern', count = 6 } = req.body;

    // Validation
    if (!tableFilename) {
      return res.status(400).json({
        success: false,
        error: 'tableFilename is required'
      });
    }

    // Determine file path
    let tablePath;
    if (tableFilename.startsWith('references/')) {
      tablePath = path.join(__dirname, '../..', tableFilename);
    } else {
      tablePath = path.join(__dirname, '../../uploads', tableFilename);
    }

    // Verify file exists
    if (!fs.existsSync(tablePath)) {
      return res.status(404).json({
        success: false,
        error: `Table image not found: ${tableFilename}`
      });
    }

    // Convert table image to base64
    const tableImageBase64 = fs.readFileSync(tablePath).toString('base64');

    // Generate directory
    const generatedDir = path.join(__dirname, '../../generated');
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }

    // Generate N images with random angles
    const results = [];
    const usedAngles = new Set(); // Track to avoid duplicates

    for (let i = 0; i < count; i++) {
      try {
        // Select random angle (avoid duplicates if possible)
        let angleId;
        let attempts = 0;
        do {
          angleId = AVAILABLE_ANGLES[Math.floor(Math.random() * AVAILABLE_ANGLES.length)];
          attempts++;
        } while (usedAngles.has(angleId) && attempts < 20 && usedAngles.size < AVAILABLE_ANGLES.length);

        usedAngles.add(angleId);

        console.log(`🎨 Generating image ${i + 1}/${count}: ${environment} environment, ${angleId}`);

        // Get reference image for this angle
        const referenceImageMap = {
          'angle-0deg-top': 'l-shape-angle-0deg-top.png',
          'angle-45deg-top': 'l-shape-angle-0deg-top.png',
          'angle-90deg-top': 'l-shape-angle-90deg-top.png',
          'angle-135deg-top': 'l-shape-angle-90deg-top.png',
          'angle-180deg-top': 'l-shape-angle-180deg-top.png',
          'angle-270deg-top': 'l-shape-angle-180deg-top.png',
          'isometric-3d': 'l-shape-isometric-3d.png',
          'side-profile': 'l-shape-side-profile.png'
        };

        const referenceImageFile = referenceImageMap[angleId];
        const referenceImagePath = path.join(__dirname, '../../prototype/images', referenceImageFile);

        if (!fs.existsSync(referenceImagePath)) {
          throw new Error(`Reference image not found: ${referenceImagePath}`);
        }

        const referenceImageBase64 = fs.readFileSync(referenceImagePath).toString('base64');

        // Load template
        const template = templateLoader.getById(angleId);
        const substituted = templateLoader.substitute(template, {
          product_name: 'Table'
        });

        // Build environment-specific prompt
        const environmentPrompts = {
          modern: 'Place this table in a modern, contemporary interior with sleek furniture, clean lines, large windows with natural light, neutral colors (whites, grays, blacks), and minimalist decor.',
          rustic: 'Place this table in a rustic countryside setting with natural wood elements, warm earthy tones, stone or brick walls, vintage furniture, cozy lighting, and charming decorative details.',
          london: 'Place this table in a British-style interior with elegant architecture, classic furniture, sophisticated color palette, traditional moldings, perhaps near large windows showing London architecture, refined and timeless atmosphere.',
          urban: 'Place this table in an urban loft or industrial space with exposed brick, metal fixtures, concrete floors, large factory-style windows, modern art, and dynamic city energy.',
          nature: 'Place this table in a natural outdoor or garden setting with greenery, natural lighting, wooden deck or patio, surrounded by plants, open air feeling, serene and peaceful atmosphere.'
        };

        const environmentPrompt = environmentPrompts[environment] || environmentPrompts.modern;

        const fullPrompt = `${environmentPrompt}\n\n${substituted.user}\n\nEnsure the table looks natural and well-integrated into the scene, not like a separate overlay. The lighting and shadows should match the environment.`;

        // Generate image using Gemini
        const result = await geminiClient.generateAngleWithReference({
          prompt: fullPrompt,
          productImageBase64: tableImageBase64,
          referenceImageBase64: referenceImageBase64,
          parameters: {
            ...substituted.parameters,
            temperature: 0.5 // Slightly higher for environment variation
          }
        });

        if (result.success) {
          // Save generated image
          const timestamp = Date.now();
          const outputFilename = `table-${environment}-${i + 1}-${timestamp}.png`;
          const outputPath = path.join(generatedDir, outputFilename);

          // Decode base64 and save
          const imageBuffer = Buffer.from(result.imageData, 'base64');
          fs.writeFileSync(outputPath, imageBuffer);

          results.push({
            index: i,
            success: true,
            filename: outputFilename,
            path: `/generated/${outputFilename}`,
            environment: environment,
            angle: angleId,
            angleType: template.angle_type
          });

          console.log(`✅ Generated image ${i + 1}: ${outputFilename}`);
        } else {
          results.push({
            index: i,
            success: false,
            error: result.error?.userMessage || 'Generation failed',
            environment: environment,
            angle: angleId
          });
          console.error(`❌ Failed to generate image ${i + 1}:`, result.error);
        }

      } catch (error) {
        console.error(`❌ Error generating image ${i + 1}:`, error.message);
        results.push({
          index: i,
          success: false,
          error: error.message,
          environment: environment
        });
      }

      // Small delay between generations
      if (i < count - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Calculate success rate
    const successCount = results.filter(r => r.success).length;

    res.json({
      success: successCount > 0,
      data: {
        environment,
        totalRequested: count,
        successCount,
        failureCount: count - successCount,
        results
      }
    });

  } catch (error) {
    console.error('Table environment generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate table environment images'
    });
  }
});

/**
 * POST /api/table-environment/regenerate
 * Regenerate specific missing images
 *
 * Body:
 * {
 *   "tableFilename": "product-123456789.jpg",
 *   "environment": "modern",
 *   "indices": [0, 2, 4]  // Which slots to regenerate
 * }
 */
router.post('/api/table-environment/regenerate', async (req, res) => {
  try {
    const { tableFilename, environment, indices = [] } = req.body;

    if (!tableFilename || !environment || indices.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'tableFilename, environment, and indices are required'
      });
    }

    // Use same logic as generate but only for specified indices
    // ... (similar implementation to generate endpoint)

    res.json({
      success: true,
      message: 'Regeneration endpoint (to be fully implemented)',
      data: {
        regeneratedCount: indices.length
      }
    });

  } catch (error) {
    console.error('Table environment regeneration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate images'
    });
  }
});

module.exports = router;
