require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Validate API key on startup
if (!process.env.GOOGLE_AI_STUDIO_API) {
  console.error('❌ GOOGLE_AI_STUDIO_API environment variable is not set');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API);

module.exports = {
  genAI,
  model: genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
};
