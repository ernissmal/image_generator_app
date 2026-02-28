const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/**
 * GET /api/reference-products
 * List all available reference product images
 */
router.get('/api/reference-products', (req, res) => {
  try {
    const referencesDir = path.join(__dirname, '../../references/products');

    // Check if directory exists
    if (!fs.existsSync(referencesDir)) {
      return res.json({
        success: true,
        data: {
          products: [],
          count: 0
        }
      });
    }

    // Read directory
    const files = fs.readdirSync(referencesDir);

    // Filter for image files only
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    // Get file stats and create product objects
    const products = imageFiles.map(filename => {
      const filePath = path.join(referencesDir, filename);
      const stats = fs.statSync(filePath);

      return {
        filename: filename,
        name: path.parse(filename).name,
        path: `/references/products/${filename}`,
        size: stats.size,
        sizeFormatted: formatFileSize(stats.size),
        modified: stats.mtime,
        extension: path.extname(filename).substring(1).toUpperCase()
      };
    });

    // Sort by modified date (newest first)
    products.sort((a, b) => b.modified - a.modified);

    res.json({
      success: true,
      data: {
        products,
        count: products.length
      }
    });

  } catch (error) {
    console.error('Error listing reference products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list reference products'
    });
  }
});

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

module.exports = router;
