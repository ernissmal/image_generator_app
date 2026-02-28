/**
 * Table Topper Generator
 * 3-Turn Workflow:
 * Turn 1: Establish surface reference
 * Turn 2: Generate 4 clean images with gradient background
 * Turn 3+: Generate 4 lifestyle images
 */

// State
const state = {
  selectedReference: null,
  selectedCategory: null,
  cleanImages: [],
  lifestyleImages: [],
  isGenerating: false,
  currentStep: 1
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadReferences();
  setupEventListeners();
});

/**
 * Load reference images from the server
 */
async function loadReferences() {
  try {
    // For MVP, we'll use the surfaces directory
    const references = [
      { id: 'straight240', path: 'references/surfaces/straight240.png', displayPath: '/references/surfaces/straight240.png', label: 'Straight 240' },
      { id: '200x80', path: 'references/surfaces/200x80.png', displayPath: '/references/surfaces/200x80.png', label: '200x80' },
      { id: 'straight150x80', path: 'references/surfaces/straight150x80.png', displayPath: '/references/surfaces/straight150x80.png', label: 'Straight 150x80' },
      { id: 'straight200x100', path: 'references/surfaces/straight200x100.png', displayPath: '/references/surfaces/straight200x100.png', label: 'Straight 200x100' }
    ];

    const grid = document.getElementById('referenceGrid');
    grid.innerHTML = '';

    references.forEach(ref => {
      const card = document.createElement('div');
      card.className = 'reference-card';
      card.dataset.refId = ref.id;
      card.dataset.refPath = ref.path; // Store the backend path (without leading /)
      card.innerHTML = `
        <img src="${ref.displayPath}" alt="${ref.label}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'200\\' height=\\'200\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'200\\' height=\\'200\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3ENo image%3C/text%3E%3C/svg%3E'">
        <div class="reference-label">${ref.label}</div>
      `;
      card.addEventListener('click', () => selectReference(ref.id, ref.path)); // Use backend path
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load references:', error);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Category selection
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      selectCategory(category);
    });
  });

  // Generate button
  document.getElementById('generateBtn').addEventListener('click', startGeneration);

  // Download button
  document.getElementById('downloadBtn').addEventListener('click', downloadAllImages);
}

/**
 * Select a reference surface
 */
function selectReference(id, path) {
  state.selectedReference = { id, path };

  // Update UI
  document.querySelectorAll('.reference-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.refId === id);
  });

  // Show category section
  document.getElementById('categorySection').style.display = 'block';

  // Update step indicator
  updateStepIndicator(2);

  // Check if ready to generate
  checkReadyToGenerate();
}

/**
 * Select a category
 */
function selectCategory(category) {
  state.selectedCategory = category;

  // Update UI
  document.querySelectorAll('.category-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.category === category);
  });

  // Update step indicator
  updateStepIndicator(2);

  // Check if ready to generate
  checkReadyToGenerate();
}

/**
 * Check if ready to generate
 */
function checkReadyToGenerate() {
  const ready = state.selectedReference && state.selectedCategory && !state.isGenerating;
  document.getElementById('generateBtn').disabled = !ready;
}

/**
 * Update step indicator
 */
function updateStepIndicator(step) {
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-indicator-${i}`);
    stepEl.classList.toggle('active', i === step);
    stepEl.classList.toggle('completed', i < step);
  }
  state.currentStep = step;
}

/**
 * Update progress
 */
function updateProgress(text, percent) {
  document.getElementById('progressText').textContent = text;
  document.getElementById('progressPercent').textContent = `${Math.round(percent)}%`;
  document.getElementById('progressFill').style.width = `${percent}%`;
}

/**
 * Start image generation
 */
async function startGeneration() {
  if (state.isGenerating) return;

  state.isGenerating = true;
  state.cleanImages = [];
  state.lifestyleImages = [];

  // Update UI
  document.getElementById('generateBtn').disabled = true;
  document.getElementById('progressContainer').classList.add('visible');
  document.getElementById('emptyState').style.display = 'none';
  updateStepIndicator(3);

  // Initialize result grids
  initializeResultGrids();

  try {
    // TURN 1: Establish surface reference
    updateProgress('Turn 1: Establishing surface reference...', 5);
    await new Promise(resolve => setTimeout(resolve, 500));

    // TURN 2: Generate 4 clean images
    updateProgress('Turn 2: Generating clean product images...', 10);
    for (let i = 0; i < 4; i++) {
      await generateCleanImage(i);
      updateProgress(`Turn 2: Generated clean image ${i + 1}/4`, 10 + ((i + 1) / 4) * 40);
    }

    // TURN 3+: Generate 4 lifestyle images
    updateProgress('Turn 3+: Generating lifestyle images...', 50);
    for (let i = 0; i < 4; i++) {
      await generateLifestyleImage(i);
      updateProgress(`Turn 3+: Generated lifestyle image ${i + 1}/4`, 50 + ((i + 1) / 4) * 50);
    }

    // Complete
    updateProgress('✅ Generation complete!', 100);
    document.getElementById('downloadSection').classList.add('visible');
    updateStepIndicator(4);

  } catch (error) {
    console.error('Generation failed:', error);
    alert('Generation failed: ' + error.message);
    updateProgress('❌ Generation failed', 0);
  } finally {
    state.isGenerating = false;
    checkReadyToGenerate();
  }
}

/**
 * Initialize result grids
 */
function initializeResultGrids() {
  document.getElementById('cleanSection').classList.add('visible');
  document.getElementById('lifestyleSection').classList.add('visible');

  const cleanGrid = document.getElementById('cleanGrid');
  const lifestyleGrid = document.getElementById('lifestyleGrid');

  cleanGrid.innerHTML = '';
  lifestyleGrid.innerHTML = '';

  // Create 4 placeholder items for each
  for (let i = 0; i < 4; i++) {
    cleanGrid.appendChild(createResultPlaceholder(`clean-${i}`, `Variation ${i + 1}`));
    lifestyleGrid.appendChild(createResultPlaceholder(`lifestyle-${i}`, `Variation ${i + 1}`));
  }
}

/**
 * Create result placeholder
 */
function createResultPlaceholder(id, label) {
  const item = document.createElement('div');
  item.className = 'result-item generating';
  item.id = id;
  item.innerHTML = `
    <div class="result-image"></div>
    <div class="result-info">${label} - Generating...</div>
    <div class="result-overlay">
      <div class="spinner"></div>
      <div>Generating...</div>
    </div>
  `;
  return item;
}

/**
 * Generate a clean image (Turn 2)
 */
async function generateCleanImage(index) {
  try {
    const response = await fetch('/api/table-topper/generate-clean', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceImage: state.selectedReference.path,
        modelReference: 'references/3D-Models/Rectangular/240x110.png', // Use 3D model for consistent leg design
        variationNumber: index + 1,
        legStyle: 'black powder-coated matte',
        backgroundStyle: 'linear gradient with two different tones of grey'
      })
    });

    const result = await response.json();

    if (result.success) {
      state.cleanImages.push(result.data);
      updateResultItem(`clean-${index}`, result.data);
    } else {
      throw new Error(result.error || 'Failed to generate clean image');
    }
  } catch (error) {
    console.error(`Failed to generate clean image ${index}:`, error);
    updateResultItem(`clean-${index}`, null, error.message);
  }
}

/**
 * Generate a lifestyle image (Turn 3+)
 */
async function generateLifestyleImage(index) {
  try {
    // Use the corresponding clean image as reference
    const cleanImage = state.cleanImages[index];
    if (!cleanImage) {
      throw new Error('No clean image available for this variation');
    }

    const response = await fetch('/api/table-topper/generate-lifestyle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cleanImagePath: cleanImage.path,
        category: state.selectedCategory,
        variationNumber: index + 1
      })
    });

    const result = await response.json();

    if (result.success) {
      state.lifestyleImages.push(result.data);
      updateResultItem(`lifestyle-${index}`, result.data);
    } else {
      throw new Error(result.error || 'Failed to generate lifestyle image');
    }
  } catch (error) {
    console.error(`Failed to generate lifestyle image ${index}:`, error);
    updateResultItem(`lifestyle-${index}`, null, error.message);
  }
}

/**
 * Update a result item
 */
function updateResultItem(id, data, errorMessage = null) {
  const item = document.getElementById(id);
  if (!item) return;

  item.classList.remove('generating');

  if (errorMessage) {
    item.innerHTML = `
      <div class="result-image" style="display: flex; align-items: center; justify-content: center; background: #fee;">
        <div style="text-align: center; padding: 20px; color: #e53e3e;">
          <div style="font-size: 2rem;">⚠️</div>
          <div style="font-size: 0.9rem; margin-top: 10px;">Generation failed</div>
        </div>
      </div>
      <div class="result-info" style="background: #fee; color: #e53e3e;">Error: ${errorMessage}</div>
    `;
  } else if (data) {
    item.classList.add('selected');
    item.innerHTML = `
      <img class="result-image" src="${data.path}" alt="Generated image">
      <div class="result-info">✅ Variation ${data.variationNumber || ''}</div>
    `;
  }
}

/**
 * Download all images as ZIP
 */
async function downloadAllImages() {
  try {
    const allImages = [...state.cleanImages, ...state.lifestyleImages];
    const validImages = allImages.filter(img => img && img.path);

    if (validImages.length === 0) {
      alert('No images to download');
      return;
    }

    // Create a simple download for now (later we can implement ZIP)
    // For MVP, we'll download images one by one
    alert(`Downloading ${validImages.length} images. Each will download separately.`);

    for (let i = 0; i < validImages.length; i++) {
      const img = validImages[i];
      const link = document.createElement('a');
      link.href = img.path;
      link.download = img.filename || `table-image-${i + 1}.png`;
      link.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }

  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download images: ' + error.message);
  }
}
