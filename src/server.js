require('dotenv').config();
const express = require('express');
const path = require('path');
const healthRoutes = require('./routes/health');
const uploadRoutes = require('./routes/upload');
const referenceProductsRoutes = require('./routes/reference-products');
const tableEnvironmentRoutes = require('./routes/table-environment');
const generateAnglesRoutes = require('./routes/generate-angles');
const tableToppperRoutes = require('./routes/table-topper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from prototype directory
app.use(express.static(path.join(__dirname, '../prototype')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve generated files
app.use('/generated', express.static(path.join(__dirname, '../generated')));

// Serve reference images
app.use('/references', express.static(path.join(__dirname, '../references')));

// Routes
app.use(healthRoutes);
app.use(uploadRoutes);
app.use(referenceProductsRoutes);
app.use(tableEnvironmentRoutes);
app.use(generateAnglesRoutes);
app.use(tableToppperRoutes);

// Serve prototype index.html as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../prototype/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving prototype from /prototype`);
  console.log(`✅ API endpoints available at /api/*`);
});

module.exports = app;
