const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;
const path = require('path');

/**
 * E-Commerce Product Photography Generator
 * Specialized for Shopify, Wix, WooCommerce, BigCommerce
 */
class EcommerceGenerator {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image-preview'
    });
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
  }

  /**
   * Professional product photography angles for e-commerce
   */
  static PROFESSIONAL_ANGLES = [
    {
      id: 'hero',
      name: 'Hero Shot (3/4 View)',
      description: 'Classic product photography angle showing front and side, slightly elevated',
      prompt: '3/4 front view at eye level, showing depth and dimension'
    },
    {
      id: 'flatlay',
      name: 'Flat Lay (Top Down)',
      description: 'Overhead view, perfect for Instagram and lifestyle shots',
      prompt: 'Directly overhead flat lay view, centered composition'
    },
    {
      id: 'front',
      name: 'Straight Front View',
      description: 'Direct front angle, perfect for product grids',
      prompt: 'Straight-on front view at eye level, perfectly centered'
    },
    {
      id: 'angle45',
      name: '45-Degree Angle',
      description: 'Professional angle showing product dimension',
      prompt: '45-degree elevated angle showing top and front'
    },
    {
      id: 'detail',
      name: 'Detail Close-Up',
      description: 'Close-up showing product details and texture',
      prompt: 'Close-up detail shot focusing on texture and craftsmanship'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle Context',
      description: 'Product in use or styled setting',
      prompt: 'Product styled in realistic lifestyle setting'
    },
    {
      id: 'side',
      name: 'Side Profile',
      description: 'Clean side view showing product profile',
      prompt: 'Clean side profile view showing product silhouette'
    }
  ];

  /**
   * E-commerce platform specifications
   */
  static PLATFORM_SPECS = {
    shopify: {
      name: 'Shopify',
      preferredRatios: ['1:1', '4:5'],
      minResolution: '2048x2048',
      recommendations: 'Square for product grids, 4:5 for featured products'
    },
    wix: {
      name: 'Wix',
      preferredRatios: ['16:9', '4:3', '1:1'],
      minResolution: '1920x1080',
      recommendations: 'Flexible, landscape for headers, square for products'
    },
    woocommerce: {
      name: 'WooCommerce',
      preferredRatios: ['1:1', '4:3'],
      minResolution: '1200x1200',
      recommendations: 'Square preferred for consistency'
    },
    bigcommerce: {
      name: 'BigCommerce',
      preferredRatios: ['1:1', '3:4'],
      minResolution: '2048x2048',
      recommendations: 'High-res square for product pages'
    }
  };

  /**
   * Generate e-commerce product image with reference images
   * @param {Object} options - Generation options
   * @param {string} options.productImageBase64 - Your product photo
   * @param {string} options.surfaceImageBase64 - Tabletop surface reference (optional)
   * @param {string} options.angleImageBase64 - Angle reference (optional)
   * @param {string} options.angle - Predefined angle ID or 'random'
   * @param {string} options.context - Style context
   * @param {string} options.platform - E-commerce platform (shopify, wix, etc.)
   * @param {string} options.aspectRatio - Aspect ratio
   * @param {string} options.additionalPrompt - Extra styling instructions
   */
  async generateProductImage(options, retries = 3) {
    const {
      productImageBase64,
      surfaceImageBase64,
      angleImageBase64,
      angle = 'random',
      context = 'modern',
      platform = 'shopify',
      aspectRatio = '1:1',
      additionalPrompt = ''
    } = options;

    if (!productImageBase64) {
      throw new Error('Product image is required');
    }

    // Select angle
    const selectedAngle = angle === 'random'
      ? this.getRandomAngle()
      : this.getAngleById(angle);

    // Build comprehensive e-commerce prompt
    const prompt = this.buildEcommercePrompt({
      angle: selectedAngle,
      context,
      platform,
      surfaceProvided: !!surfaceImageBase64,
      angleProvided: !!angleImageBase64,
      additionalPrompt
    });

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.checkRateLimit();

        // Build parts array with all provided images
        const parts = [{ text: prompt }];

        // Product image (main subject)
        parts.push({
          inlineData: {
            mimeType: 'image/jpeg',
            data: productImageBase64
          }
        });

        // Surface reference (if provided)
        if (surfaceImageBase64) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: surfaceImageBase64
            }
          });
        }

        // Angle reference (if provided)
        if (angleImageBase64) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: angleImageBase64
            }
          });
        }

        const result = await this.model.generateContent({
          contents: [{
            role: 'user',
            parts
          }],
          generationConfig: {
            temperature: 0.4,
            topP: 0.95,
            topK: 40,
            responseModalities: ['image'],
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        });

        this.trackUsage(result, 'ecommerce-product');

        const imageData = await this.extractImageData(result);

        return {
          success: true,
          imageData,
          metadata: {
            angle: selectedAngle.name,
            context,
            platform,
            aspectRatio,
            prompt,
            tokensUsed: result.response?.usageMetadata?.totalTokenCount || 0,
            attempt
          }
        };

      } catch (error) {
        console.error(`Attempt ${attempt}/${retries} failed:`, error.message);

        if (attempt === retries) {
          return {
            success: false,
            error: this.classifyError(error),
            attempts: retries
          };
        }

        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  /**
   * Build e-commerce optimized prompt
   */
  buildEcommercePrompt(options) {
    const { angle, context, platform, surfaceProvided, angleProvided, additionalPrompt } = options;

    const platformSpec = EcommerceGenerator.PLATFORM_SPECS[platform] || EcommerceGenerator.PLATFORM_SPECS.shopify;

    let prompt = `PROFESSIONAL E-COMMERCE PRODUCT PHOTOGRAPHY

PRIMARY OBJECTIVE: Create a photorealistic product image optimized for ${platformSpec.name}.

`;

    // Image references guide
    if (surfaceProvided || angleProvided) {
      prompt += `REFERENCE IMAGES PROVIDED:\n`;
      prompt += `- Image 1: THE PRODUCT (main subject to feature)\n`;
      if (surfaceProvided) {
        prompt += `- Image 2: SURFACE REFERENCE (match this tabletop surface texture and material)\n`;
      }
      if (angleProvided) {
        prompt += `- Image ${surfaceProvided ? '3' : '2'}: ANGLE REFERENCE (match this exact camera angle and perspective)\n`;
      }
      prompt += `\n`;
    }

    // Angle instructions
    prompt += `CAMERA ANGLE: ${angle.name}
${angle.description}
${angle.prompt}

`;

    // Surface instructions
    if (surfaceProvided) {
      prompt += `SURFACE REQUIREMENTS:
- Use the tabletop surface from the reference image
- Match the texture, color, and material exactly
- Ensure natural product placement on this surface
- Maintain surface characteristics throughout

`;
    } else {
      prompt += `SURFACE REQUIREMENTS:
- Clean, professional ${context} style surface
- Appropriate for product display
- Subtle texture, not distracting

`;
    }

    // Context styling
    const contextStyles = {
      modern: 'Modern, minimalist, clean lines, contemporary aesthetic',
      rustic: 'Rustic, natural materials, warm tones, authentic feel',
      london: 'British elegance, sophisticated, timeless style',
      urban: 'Urban chic, industrial elements, trendy atmosphere',
      nature: 'Natural, organic, eco-friendly presentation',
      luxury: 'Premium, high-end, sophisticated lighting and materials',
      minimal: 'Ultra-minimalist, white/neutral, maximum product focus'
    };

    prompt += `STYLE CONTEXT: ${contextStyles[context] || contextStyles.modern}

E-COMMERCE REQUIREMENTS:
✓ Professional product photography quality
✓ Sharp focus on product details
✓ Even, natural lighting (no harsh shadows)
✓ Clean, uncluttered composition
✓ Product is the hero - no competing elements
✓ Photorealistic rendering
✓ Print-ready quality
✓ Color accuracy crucial for online retail

LIGHTING SPECIFICATIONS:
- Soft, diffused lighting
- Highlights product features
- Minimal shadows (or natural soft shadows)
- Consistent color temperature
- Professional studio lighting quality

COMPOSITION GUIDELINES:
- Product centered or using rule of thirds
- Appropriate negative space
- Clean background (surface visible but not dominant)
- Professional depth of field
- Context supports product, doesn't distract

TECHNICAL SPECIFICATIONS:
- Platform: ${platformSpec.name}
- Recommended for: ${platformSpec.recommendations}
- High resolution output
- Sharp, crisp details
- Professional color grading

`;

    if (additionalPrompt) {
      prompt += `ADDITIONAL REQUIREMENTS:
${additionalPrompt}

`;
    }

    prompt += `CRITICAL: This image must be ready for immediate use in e-commerce product listings. Focus on photorealism, professional quality, and making the product look appealing and accurate to drive sales.`;

    return prompt;
  }

  /**
   * Get random professional angle
   */
  getRandomAngle() {
    const angles = EcommerceGenerator.PROFESSIONAL_ANGLES;
    return angles[Math.floor(Math.random() * angles.length)];
  }

  /**
   * Get specific angle by ID
   */
  getAngleById(id) {
    return EcommerceGenerator.PROFESSIONAL_ANGLES.find(a => a.id === id)
      || EcommerceGenerator.PROFESSIONAL_ANGLES[0];
  }

  /**
   * Load image file as base64
   */
  async loadImageAsBase64(filepath) {
    const buffer = await fs.readFile(filepath);
    return buffer.toString('base64');
  }

  /**
   * Rate limiting
   */
  async checkRateLimit() {
    const now = Date.now();
    const timeWindow = 60000;

    if (now - this.lastRequestTime < timeWindow) {
      this.requestCount++;
      if (this.requestCount >= 15) {
        const waitTime = timeWindow - (now - this.lastRequestTime);
        console.log(`⏳ Rate limit reached. Waiting ${Math.ceil(waitTime/1000)}s`);
        await this.sleep(waitTime);
        this.requestCount = 0;
        this.lastRequestTime = Date.now();
      }
    } else {
      this.requestCount = 1;
      this.lastRequestTime = now;
    }
  }

  /**
   * Classify errors
   */
  classifyError(error) {
    const message = error.message.toLowerCase();
    if (message.includes('rate limit')) {
      return { type: 'RATE_LIMIT', retryable: true, userMessage: 'Rate limit reached. Please wait.' };
    }
    if (message.includes('auth')) {
      return { type: 'AUTH_ERROR', retryable: false, userMessage: 'Authentication error.' };
    }
    return { type: 'UNKNOWN_ERROR', retryable: false, userMessage: 'Generation failed.' };
  }

  /**
   * Track usage
   */
  trackUsage(result, operationType) {
    const tokensUsed = result.response?.usageMetadata?.totalTokenCount || 1290;
    const costPerImage = 0.039;
    console.log(`🛍️ E-commerce Generation: ${tokensUsed} tokens, $${costPerImage.toFixed(3)} (${operationType})`);
    return { tokensUsed, cost: costPerImage };
  }

  /**
   * Extract image data
   */
  async extractImageData(result) {
    const candidates = result.response.candidates || [];
    if (candidates.length === 0) throw new Error('No image generated');

    const imageData = candidates[0].content?.parts?.[0]?.inlineData?.data;
    if (!imageData) throw new Error('No image data in response');

    return imageData;
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = EcommerceGenerator;
