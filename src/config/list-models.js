const { genAI } = require('./gemini-config');

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:');
    models.forEach(model => {
      console.log(`  - ${model.name}`);
      console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
