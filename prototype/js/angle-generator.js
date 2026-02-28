// Application State
const state = {
    uploadedFile: null,
    uploadedFileUrl: null,
    fileId: null,
    productName: '',
    generatedAngles: [],
    selectedAngles: []
};

const API_BASE = '';  // Same origin

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('PhotoGen AI - Angle Generator Ready');
    initializeUploadZone();
});

// ========================================
// Upload Handling
// ========================================

function initializeUploadZone() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFileSelection(file);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileSelection(file);
    });
}

function handleFileSelection(file) {
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|png)')) {
        alert('Please upload JPG or PNG only');
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File must be under 10MB');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        state.uploadedFileUrl = e.target.result;
        document.getElementById('previewImage').src = e.target.result;
        document.getElementById('uploadZone').style.display = 'none';
        document.getElementById('uploadPreview').style.display = 'block';
    };
    reader.readAsDataURL(file);

    state.uploadedFile = file;
}

function resetUpload() {
    state.uploadedFile = null;
    state.uploadedFileUrl = null;
    document.getElementById('uploadZone').style.display = 'flex';
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('fileInput').value = '';
}

// ========================================
// Generation Flow
// ========================================

async function startGeneration() {
    if (!state.uploadedFile) {
        alert('Please upload an image first');
        return;
    }

    // Get product name from user
    state.productName = prompt('What product is this?', 'My Product');
    if (!state.productName) {
        state.productName = 'Product';
    }

    try {
        // Upload file
        const formData = new FormData();
        formData.append('image', state.uploadedFile);

        const uploadResponse = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
            throw new Error(uploadData.error || 'Upload failed');
        }

        state.fileId = uploadData.data.filename;

        // Show Stage 1 and start generation
        showScreen('stage1');
        beginAngleGeneration();

    } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
    }
}

async function beginAngleGeneration() {
    // Show loading state
    document.getElementById('generationLoading').style.display = 'block';
    document.getElementById('angleSelectionGrid').style.display = 'none';
    document.getElementById('angleActions').style.display = 'none';
    document.getElementById('generationError').style.display = 'none';

    // Simulate progress (actual generation happens in backend)
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 3;
        document.getElementById('angleProgress').style.width = `${Math.min(progress, 95)}%`;
    }, 5000); // Update every 5 seconds

    try {
        const response = await fetch(`${API_BASE}/api/generate-angles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fileId: state.fileId,
                productName: state.productName
            })
        });

        clearInterval(progressInterval);
        document.getElementById('angleProgress').style.width = '100%';

        if (!response.ok) {
            throw new Error('Generation failed');
        }

        const data = await response.json();

        if (data.success && data.angles) {
            state.generatedAngles = data.angles.filter(a => a.success);
            displayGeneratedAngles();
        } else {
            showGenerationError(data.error || 'Not enough angles generated successfully');
        }

    } catch (error) {
        clearInterval(progressInterval);
        console.error('Generation error:', error);
        showGenerationError(error.message);
    }
}

function displayGeneratedAngles() {
    document.getElementById('generationLoading').style.display = 'none';
    document.getElementById('angleSelectionGrid').style.display = 'grid';
    document.getElementById('angleActions').style.display = 'flex';
    document.getElementById('angleCounter').style.display = 'block';

    const grid = document.getElementById('angleSelectionGrid');
    grid.innerHTML = '';

    state.generatedAngles.forEach((angle, index) => {
        const card = document.createElement('div');
        card.className = 'selection-card';
        card.dataset.angleId = angle.id;

        // SECURITY: Create elements safely to prevent XSS
        const badge = document.createElement('div');
        badge.className = 'card-badge';
        badge.textContent = angle.type; // Safe from XSS

        const img = document.createElement('img');
        img.src = `data:image/jpeg;base64,${angle.imageData}`;
        img.alt = angle.type;
        img.className = 'angle-image';
        img.onclick = () => viewFullscreen(angle.id);

        const button = document.createElement('button');
        button.className = 'btn-select';
        button.textContent = 'Pick This One';
        button.onclick = () => selectAngle(angle.id);

        card.appendChild(badge);
        card.appendChild(img);
        card.appendChild(button);
        grid.appendChild(card);
    });
}

function selectAngle(angleId) {
    const angle = state.generatedAngles.find(a => a.id === angleId);
    if (!angle) return;

    // Check if already selected
    if (state.selectedAngles.some(a => a.id === angleId)) {
        // Deselect
        state.selectedAngles = state.selectedAngles.filter(a => a.id !== angleId);
        const card = document.querySelector(`[data-angle-id="${angleId}"]`);
        card.classList.remove('selected');
        card.querySelector('.btn-select').textContent = 'Pick This One';
        card.querySelector('.btn-select').style.background = '';
    } else {
        // Check if limit reached
        if (state.selectedAngles.length >= 3) {
            alert('You can only select 3 angles. Deselect one first.');
            return;
        }

        // Add to selected
        state.selectedAngles.push(angle);

        // Update UI
        const card = document.querySelector(`[data-angle-id="${angleId}"]`);
        card.classList.add('selected');
        card.querySelector('.btn-select').textContent = '✓ Selected';
        card.querySelector('.btn-select').style.background = '#4caf50';
    }

    // Update counter
    document.getElementById('angleCounterNum').textContent = state.selectedAngles.length;

    // Enable continue if 3 selected
    document.getElementById('continueStage1').disabled = state.selectedAngles.length !== 3;
}

function viewFullscreen(angleId) {
    const angle = state.generatedAngles.find(a => a.id === angleId);
    if (!angle) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fullscreen-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
            <img src="data:image/jpeg;base64,${angle.imageData}" alt="${angle.type}">
            <p>${angle.type}</p>
        </div>
    `;
    document.body.appendChild(modal);

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

function showGenerationError(message) {
    document.getElementById('generationLoading').style.display = 'none';
    document.getElementById('generationError').style.display = 'block';
    document.getElementById('errorMessage').textContent = message;
}

function retryGeneration() {
    document.getElementById('generationError').style.display = 'none';
    beginAngleGeneration();
}

function regenerateAngles() {
    if (confirm('This will generate 9 new angles. Continue?')) {
        state.selectedAngles = [];
        state.generatedAngles = [];
        document.getElementById('continueStage1').disabled = true;
        document.getElementById('angleCounterNum').textContent = '0';
        beginAngleGeneration();
    }
}

// ========================================
// Navigation
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function continueToNextStage() {
    if (state.selectedAngles.length < 3) {
        alert('Please select 3 angles');
        return;
    }
    showScreen('stage2');
}
