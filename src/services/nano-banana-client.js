const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Nano Banana Client - Gemini 2.5 Flash Image (Text-to-Image Generation)
 * Community nickname for Google's advanced image generation model
 */
class NanoBananaClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Nano Banana model (Gemini 2.5 Flash Image)
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-image-preview'
    });
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
  }

  /**
   * Generate image from text prompt with context and options
   * @param {Object} options - Generation options
   * @param {string} options.prompt - Text description of desired image
   * @param {string} options.context - Style context (modern, rustic, london, etc.)
   * @param {boolean} options.includePeople - Whether to include people in scene
   * @param {string} options.aspectRatio - Aspect ratio (1:1, 16:9, 9:16, etc.)
   * @param {Object} options.parameters - Additional model parameters
   * @param {number} retries - Maximum retry attempts (default: 3)
   * @returns {Promise<Object>} Generated image data with metadata
   */
  async generateFromText(options, retries = 3) {
    // Validate input
    if (!options || typeof options !== 'object') {
      throw new Error('Options parameter is required and must be an object');
    }

    const {
      prompt,
      context = 'modern',
      includePeople = false,
      aspectRatio = '1:1',
      parameters = {}
    } = options;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string');
    }

    if (retries < 1 || retries > 10) {
      throw new Error('Retries must be between 1 and 10');
    }

    // Build enhanced prompt with context
    const enhancedPrompt = this.buildContextualPrompt(prompt, context, includePeople);

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.checkRateLimit();

        // Configure generation with Nano Banana specific settings
        const result = await this.model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: enhancedPrompt }]
          }],
          generationConfig: {
            temperature: parameters.temperature || 0.4,
            topP: parameters.topP || 0.95,
            topK: parameters.topK || 40,
            responseModalities: ['image'],
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        });

        // Track usage and cost
        this.trackUsage(result, 'text-to-image');

        // Extract and validate image data
        const imageData = await this.extractImageData(result);

        return {
          success: true,
          imageData,
          metadata: {
            context,
            includePeople,
            aspectRatio,
            prompt: enhancedPrompt,
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

        // Exponential backoff
        await this.sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  /**
   * Build contextual prompt based on style and options
   * @param {string} basePrompt - User's base prompt
   * @param {string} context - Style context
   * @param {boolean} includePeople - Include people flag
   * @returns {string} Enhanced prompt with context
   */
  buildContextualPrompt(basePrompt, context, includePeople) {
    const contextStyles = {
      modern: {
        style: 'Modern, sleek, contemporary design with clean lines, minimalist aesthetic',
        lighting: 'Bright, well-lit with natural lighting or soft artificial light',
        mood: 'Professional, polished, sophisticated'
      },
      rustic: {
        style: 'Rustic, countryside, traditional design with natural materials, vintage elements',
        lighting: 'Warm, golden hour lighting with natural ambiance',
        mood: 'Cozy, authentic, charming, nostalgic'
      },
      london: {
        style: 'London, England setting with iconic British architecture, urban cityscape',
        lighting: 'Natural daylight or classic London overcast lighting',
        mood: 'Historic, elegant, sophisticated British atmosphere'
      },
      urban: {
        style: 'Urban, city environment with modern architecture, street scenes',
        lighting: 'Dynamic city lighting, mixed natural and artificial',
        mood: 'Energetic, contemporary, bustling'
      },
      nature: {
        style: 'Natural environment, outdoor setting with organic elements',
        lighting: 'Natural sunlight, outdoor ambient lighting',
        mood: 'Peaceful, serene, organic'
      }
    };

    const contextDef = contextStyles[context] || contextStyles.modern;

    const peopleInstruction = includePeople
      ? 'Include people in the scene - show 1-3 people naturally integrated into the environment, dressed appropriately for the setting.'
      : 'No people in the scene - focus on the environment, objects, and atmosphere without any human subjects.';

    return `${basePrompt}

STYLE CONTEXT: ${contextDef.style}
LIGHTING: ${contextDef.lighting}
MOOD: ${contextDef.mood}
PEOPLE: ${peopleInstruction}

Create a high-quality, photorealistic image that matches this aesthetic. Ensure professional photography quality with proper composition, depth, and attention to detail.`;
  }

  /**
   * Rate limiting - max 15 requests per minute (API limit)
   */
  async checkRateLimit() {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute

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
   * Classify errors for proper handling and user feedback
   */
  classifyError(error) {
    const message = error.message.toLowerCase();

    if (message.includes('rate limit') || message.includes('quota')) {
      return {
        type: 'RATE_LIMIT',
        retryable: true,
        userMessage: 'API rate limit reached. Please wait a moment and try again.'
      };
    }

    if (message.includes('invalid') || message.includes('authentication')) {
      return {
        type: 'AUTH_ERROR',
        retryable: false,
        userMessage: 'API authentication error. Please check configuration.'
      };
    }

    if (message.includes('timeout') || message.includes('network')) {
      return {
        type: 'NETWORK_ERROR',
        retryable: true,
        userMessage: 'Network connection issue. Please try again.'
      };
    }

    if (message.includes('safety') || message.includes('blocked')) {
      return {
        type: 'SAFETY_ERROR',
        retryable: false,
        userMessage: 'Content filtered by safety systems. Please modify your prompt.'
      };
    }

    return {
      type: 'UNKNOWN_ERROR',
      retryable: false,
      userMessage: 'Image generation failed. Please try again.'
    };
  }

  /**
   * Track API usage for cost monitoring
   */
  trackUsage(result, operationType) {
    const tokensUsed = result.response?.usageMetadata?.totalTokenCount || 1290; // Nano Banana default
    const costPerImage = 0.039; // $0.039 per image

    console.log(`🍌 Nano Banana Usage: ${tokensUsed} tokens, $${costPerImage.toFixed(3)} (${operationType})`);

    // TODO: Store in database for billing tracking
    return { tokensUsed, cost: costPerImage };
  }

  /**
   * Extract image data from API response
   */
  async extractImageData(result) {
    const response = result.response;
    const candidates = response.candidates || [];

    if (candidates.length === 0) {
      throw new Error('No image generated - API returned no candidates');
    }

    const candidate = candidates[0];
    if (!candidate.content?.parts?.length) {
      throw new Error('Invalid response structure - missing content parts');
    }

    const firstPart = candidate.content.parts[0];
    if (!firstPart.inlineData?.data) {
      throw new Error('Invalid response structure - missing inline data');
    }

    const imageData = firstPart.inlineData.data;

    if (!imageData || imageData.length === 0) {
      throw new Error('Generated image data is empty');
    }

    return imageData;
  }

  /**
   * Sleep utility for rate limiting and retries
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check - verify Nano Banana API is accessible
   */
  async healthCheck() {
    try {
      const startTime = Date.now();
      const result = await this.model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: 'A simple test image of a red apple' }]
        }],
        generationConfig: {
          responseModalities: ['image'],
          imageConfig: { aspectRatio: '1:1' }
        }
      });
      const latency = Date.now() - startTime;
      return { healthy: true, latency, model: 'gemini-2.5-flash-image-preview' };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = NanoBananaClient;
