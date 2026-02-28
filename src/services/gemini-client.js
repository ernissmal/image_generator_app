const { GoogleGenerativeAI } = require('@google/generative-ai');
const https = require('https');

class GeminiClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use Nano Banana (Gemini 2.5 Flash Image) for image generation/editing
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
  }

  /**
   * Generate angle variation with reference images
   * @param {Object} options - Generation options
   * @param {string} options.prompt - Text prompt describing the transformation
   * @param {string} options.productImageBase64 - Base64 encoded product image
   * @param {string} options.referenceImageBase64 - Base64 encoded angle reference image
   * @param {Object} options.parameters - Model parameters
   * @param {number} retries - Maximum number of retry attempts (default: 3)
   * @returns {Promise<Object>} Generated image data with success status
   */
  async generateAngleWithReference(options, retries = 3) {
    if (!options || typeof options !== 'object') {
      throw new Error('Options parameter is required and must be an object');
    }

    const { prompt, productImageBase64, referenceImageBase64, parameters = {} } = options;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string');
    }

    if (!productImageBase64 || typeof productImageBase64 !== 'string') {
      throw new Error('Product image base64 data is required');
    }

    if (!referenceImageBase64 || typeof referenceImageBase64 !== 'string') {
      throw new Error('Reference image base64 data is required');
    }

    if (retries < 1 || retries > 10) {
      throw new Error('Retries must be between 1 and 10');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this.checkRateLimit();

        // Build prompt with both images
        const fullPrompt = `${prompt}

IMPORTANT INSTRUCTIONS:
1. Analyze the PRODUCT IMAGE (first image) - this is the object you need to transform
2. Analyze the REFERENCE IMAGE (second image) - this shows the desired angle/perspective
3. Generate a NEW image showing the SAME PRODUCT from the PRODUCT IMAGE, but viewed from the SAME ANGLE as shown in the REFERENCE IMAGE
4. Maintain the product's original colors, materials, and design
5. Match the perspective, rotation, and viewing angle from the reference image exactly
6. Keep the background simple and clean (white or subtle gradient)
7. Ensure professional product photography quality`;

        const result = await this.model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                { text: fullPrompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: productImageBase64
                  }
                },
                {
                  inlineData: {
                    mimeType: 'image/png',
                    data: referenceImageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: parameters.temperature || 0.4,
            topP: parameters.top_p || 0.8,
            topK: parameters.top_k || 40,
            maxOutputTokens: parameters.max_output_tokens || 2048
          }
        });

        this.trackUsage(result);
        const imageData = await this.extractImageData(result);

        return {
          success: true,
          imageData,
          tokensUsed: result.response.usageMetadata?.totalTokenCount || 0,
          attempt
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
   * Generate image from prompt with base64 image data
   * @param {Object} options - Generation options
   * @param {string} options.prompt - Text prompt
   * @param {string} options.imageBase64 - Base64 encoded image data
   * @param {Object} options.parameters - Model parameters
   * @param {number} retries - Maximum number of retry attempts (default: 3)
   * @returns {Promise<Object>} Generated image data with success status
   * @throws {Error} If options validation fails
   */
  async generateImageFromBase64(options, retries = 3) {
    // Input validation
    if (!options || typeof options !== 'object') {
      throw new Error('Options parameter is required and must be an object');
    }

    const { prompt, imageBase64, parameters = {} } = options;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string');
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      throw new Error('Image base64 data is required and must be a string');
    }

    if (retries < 1 || retries > 10) {
      throw new Error('Retries must be between 1 and 10');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Rate limiting check
        await this.checkRateLimit();

        // Make API call
        const result = await this.model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: parameters.temperature || 0.4,
            topP: parameters.top_p || 0.8,
            topK: parameters.top_k || 40,
            maxOutputTokens: parameters.max_output_tokens || 2048
          }
        });

        // Track cost
        this.trackUsage(result);

        // Extract image data
        const imageData = await this.extractImageData(result);

        return {
          success: true,
          imageData,
          tokensUsed: result.response.usageMetadata?.totalTokenCount || 0,
          attempt
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
   * Generate image from prompt with retry logic
   * @param {Object} options - Generation options
   * @param {string} options.prompt - Text prompt
   * @param {string} options.imageUrl - Reference image URL
   * @param {Object} options.parameters - Model parameters
   * @param {number} retries - Maximum number of retry attempts (default: 3)
   * @returns {Promise<Object>} Generated image data with success status
   * @throws {Error} If options validation fails
   */
  async generateImage(options, retries = 3) {
    // Input validation
    if (!options || typeof options !== 'object') {
      throw new Error('Options parameter is required and must be an object');
    }

    const { prompt, imageUrl, parameters = {} } = options;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string');
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error('Image URL is required and must be a string');
    }

    if (retries < 1 || retries > 10) {
      throw new Error('Retries must be between 1 and 10');
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Rate limiting check
        await this.checkRateLimit();

        // Make API call
        const result = await this.model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: await this.loadImageAsBase64(imageUrl)
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: parameters.temperature || 0.4,
            topP: parameters.top_p || 0.8,
            topK: parameters.top_k || 40,
            maxOutputTokens: parameters.max_output_tokens || 2048
          }
        });

        // Track cost
        this.trackUsage(result);

        // Extract image data
        const imageData = await this.extractImageData(result);

        return {
          success: true,
          imageData,
          tokensUsed: result.response.usageMetadata?.totalTokenCount || 0,
          attempt
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
   * Rate limiting - max 15 requests per minute (free tier limit)
   */
  async checkRateLimit() {
    const now = Date.now();
    const timeWindow = 60000; // 1 minute

    if (now - this.lastRequestTime < timeWindow) {
      this.requestCount++;

      if (this.requestCount >= 15) {
        const waitTime = timeWindow - (now - this.lastRequestTime);
        console.log(`Rate limit reached. Waiting ${waitTime}ms`);
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
   * Classify error for appropriate handling
   */
  classifyError(error) {
    const message = error.message.toLowerCase();

    if (message.includes('rate limit') || message.includes('quota')) {
      return { type: 'RATE_LIMIT', retryable: true, userMessage: 'Service is busy. Please try again in a moment.' };
    }

    if (message.includes('invalid') || message.includes('authentication')) {
      return { type: 'AUTH_ERROR', retryable: false, userMessage: 'Configuration error. Please contact support.' };
    }

    if (message.includes('timeout') || message.includes('network')) {
      return { type: 'NETWORK_ERROR', retryable: true, userMessage: 'Connection issue. Retrying...' };
    }

    return { type: 'UNKNOWN_ERROR', retryable: false, userMessage: 'Generation failed. Please try again.' };
  }

  /**
   * Track API usage for cost monitoring
   */
  trackUsage(result) {
    const tokensUsed = result.response.usageMetadata?.totalTokenCount || 0;
    const costPerToken = 0.00001; // Approximate cost
    const cost = tokensUsed * costPerToken;

    console.log(`API Usage: ${tokensUsed} tokens, ~$${cost.toFixed(4)}`);

    // TODO: Store in database for billing tracking
  }

  /**
   * Load image from URL and convert to base64
   * @param {string} imageUrl - URL of image to load
   * @returns {Promise<string>} Base64 encoded image data
   * @throws {Error} If image loading fails or times out
   */
  async loadImageAsBase64(imageUrl) {
    return new Promise((resolve, reject) => {
      // Set timeout to prevent hanging requests
      const timeout = setTimeout(() => {
        reject(new Error('Image load timeout after 30 seconds'));
      }, 30000);

      const request = https.get(imageUrl, (response) => {
        // Handle HTTP errors
        if (response.statusCode !== 200) {
          clearTimeout(timeout);
          reject(new Error(`Failed to load image: HTTP ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          clearTimeout(timeout);
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString('base64'));
        });
        response.on('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      request.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });

      // Prevent request from hanging indefinitely
      request.setTimeout(30000, () => {
        request.destroy();
        clearTimeout(timeout);
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Extract image data from API response
   * @param {Object} result - API generation result
   * @returns {Promise<string>} Base64 encoded image data
   * @throws {Error} If no valid image data found in response
   */
  async extractImageData(result) {
    // Parse response and extract generated image
    const response = result.response;
    const candidates = response.candidates || [];

    if (candidates.length === 0) {
      console.error('API Response structure:', JSON.stringify(response, null, 2));
      throw new Error('No image generated - API returned no candidates');
    }

    // Safely extract image data with validation
    const candidate = candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('Candidate structure:', JSON.stringify(candidate, null, 2));
      throw new Error('Invalid response structure - missing content parts');
    }

    // Try to find image data in any part
    for (const part of candidate.content.parts) {
      // Check for inlineData
      if (part.inlineData && part.inlineData.data) {
        const imageData = part.inlineData.data;
        if (imageData && imageData.length > 0) {
          return imageData;
        }
      }

      // Check for inline_data (alternative format)
      if (part.inline_data && part.inline_data.data) {
        const imageData = part.inline_data.data;
        if (imageData && imageData.length > 0) {
          return imageData;
        }
      }
    }

    // Log the actual structure to help debug
    console.error('Parts structure:', JSON.stringify(candidate.content.parts, null, 2));
    throw new Error('Invalid response structure - missing inline data');
  }

  /**
   * Utility: Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise<void>} Resolves after specified time
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Health check - verify API is accessible
   * @returns {Promise<Object>} Health status object with latency or error
   */
  async healthCheck() {
    try {
      const startTime = Date.now();
      const result = await this.model.generateContent('health check');
      const latency = Date.now() - startTime;
      return { healthy: true, latency };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
}

module.exports = GeminiClient;
