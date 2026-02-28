const { model } = require('./gemini-config');

async function testConnection() {
  try {
    const result = await model.generateContent('Test connection');
    console.log('✅ API connection successful');
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
    return false;
  }
}

// Run test if executed directly
if (require.main === module) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testConnection;
