const express = require('express');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const GeminiClient = require('../services/gemini-client');
const PromptTemplateLoader = require('../services/prompt-template-loader');

// Initialize services
const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY);
const templateLoader = new PromptTemplateLoader();

// Load all prompt templates on startup
try {
  templateLoader.loadAll();
  console.log('✅ Prompt templates loaded successfully');
} catch (error) {
  console.error('❌ Failed to load prompt templates:', error.message);
}

// SECURITY: Rate limiting - 3 generation requests per hour per IP
const generateRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    error: 'Too many generation requests. Please try again in 1 hour.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/generate-angles
 * Generate 9 angle variations for an uploaded product image
 *
 * Request body:
 * {
 *   fileId: string,        // Filename of uploaded image
 *   productName: string    // Product description
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   angles: Array<{
 *     id: string,
 *     type: string,
 *     imageData: string (base64),
 *     success: boolean,
 *     error?: string
 *   }>,
 *   stats: {
 *     total: number,
 *     successful: number,
 *     failed: number,
 *     successRate: string
 *   }
 * }
 */
router.post('/api/generate-angles', generateRateLimiter, async (req, res) => {
  const { fileId, productName } = req.body;

  // Validation - fileId and productName required
  if (!fileId || !productName) {
    return res.status(400).json({
      success: false,
      error: 'fileId and productName are required'
    });
  }

  // SECURITY: Validate fileId format to prevent path traversal
  if (!/^product-[0-9]+-[0-9]+\.(jpg|jpeg|png)$/i.test(fileId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file ID format'
    });
  }

  // VALIDATION: Validate productName length and characters
  if (productName.length < 1 || productName.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Product name must be between 1 and 100 characters'
    });
  }

  // Only allow alphanumeric, spaces, and basic punctuation
  if (!/^[a-zA-Z0-9\s\-_.,'()&]+$/.test(productName)) {
    return res.status(400).json({
      success: false,
      error: 'Product name contains invalid characters'
    });
  }

  try {
    // Build file path
    const uploadDir = path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, fileId);

    // SECURITY: Ensure normalized path stays within upload directory
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(uploadDir)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Verify file exists
    if (!fs.existsSync(normalizedPath)) {
      return res.status(404).json({
        success: false,
        error: 'Uploaded file not found'
      });
    }

    // PERFORMANCE: Use async file read instead of blocking sync
    const imageBuffer = await fs.promises.readFile(normalizedPath);
    const imageBase64 = imageBuffer.toString('base64');

    // Define angle types to generate
    const angleTypes = [
      '0deg', '45deg', '90deg', '135deg', '180deg', '270deg',
      'isometric', 'orthographic', 'profile'
    ];

    console.log(`🎨 Starting generation of ${angleTypes.length} angles for: ${productName}`);

    // PERFORMANCE: Add timeout wrapper for each generation
    const withTimeout = (promise, timeoutMs = 60000) => {
      return Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Generation timeout (60s)')), timeoutMs)
        )
      ]);
    };

    // Generate all angles in parallel
    const generationPromises = angleTypes.map(async (angleType) => {
      try {
        const template = templateLoader.getByAngleType(angleType);
        const prompt = templateLoader.substitute(template, {
          product_name: productName
        });

        // Combine system, user, and negative prompts
        const fullPrompt = `${prompt.system}\n\n${prompt.user}\n\nNegative prompt: ${prompt.negative}`;

        console.log(`  → Generating ${angleType}...`);

        // PERFORMANCE: Wrap generation with 60s timeout
        const result = await withTimeout(
          geminiClient.generateImageFromBase64({
            prompt: fullPrompt,
            imageBase64: imageBase64,
            parameters: prompt.parameters
          }),
          60000  // 60 second timeout
        );

        if (result.success) {
          console.log(`  ✓ ${angleType} generated successfully`);
        } else {
          console.log(`  ✗ ${angleType} failed: ${result.error?.userMessage}`);
        }

        return {
          angleType,
          ...result
        };

      } catch (error) {
        console.error(`  ✗ ${angleType} error:`, error.message);
        return {
          angleType,
          success: false,
          error: error.message
        };
      }
    });

    // Wait for all generations to complete
    const results = await Promise.allSettled(generationPromises);

    // Process results
    const angles = results.map((result, index) => {
      const angleType = angleTypes[index];

      if (result.status === 'fulfilled' && result.value.success) {
        return {
          id: angleType,
          type: angleType,
          imageData: result.value.imageData,
          success: true
        };
      } else {
        return {
          id: angleType,
          type: angleType,
          success: false,
          error: result.reason?.message || result.value?.error || 'Generation failed'
        };
      }
    });

    // Calculate success statistics
    const successCount = angles.filter(a => a.success).length;
    const failedCount = angles.length - successCount;
    const successRate = (successCount / angles.length) * 100;

    console.log(`📊 Generation complete: ${successCount}/${angles.length} successful (${successRate.toFixed(1)}%)`);

    // Respond with results
    // Success if at least 70% (7/9) of angles generated successfully
    res.json({
      success: successRate >= 70,
      angles,
      stats: {
        total: angles.length,
        successful: successCount,
        failed: failedCount,
        successRate: `${successRate.toFixed(1)}%`
      }
    });

  } catch (error) {
    console.error('❌ Angle generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Angle generation failed',
      message: error.message
    });
  }
});

module.exports = router;
