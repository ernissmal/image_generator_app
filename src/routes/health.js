require('dotenv').config();
const express = require('express');
const router = express.Router();
const GeminiClient = require('../services/gemini-client');

// Validate API key exists before initializing client
if (!process.env.GOOGLE_AI_STUDIO_API) {
  console.error('❌ GOOGLE_AI_STUDIO_API environment variable is not set');
  process.exit(1);
}

const geminiClient = new GeminiClient(process.env.GOOGLE_AI_STUDIO_API);

router.get('/health/gemini', async (req, res) => {
  try {
    const health = await geminiClient.healthCheck();

    res.status(health.healthy ? 200 : 503).json({
      service: 'gemini-api',
      status: health.healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      latency: health.latency,
      error: health.error
    });
  } catch (error) {
    res.status(500).json({
      service: 'gemini-api',
      status: 'error',
      error: error.message
    });
  }
});

module.exports = router;
