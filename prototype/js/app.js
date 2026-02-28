// Application State
const state = {
    selectedAngles: [],
    selectedEnvironments: [],
    uploadedImage: null,
    polishSettings: {
        lighting: 0,
        shadows: 0,
        theme: 0
    },
    availableAngles: [
        { index: 0, name: 'Angle 1', file: 'Ingenious Rottis-Migelo.png' },
        { index: 1, name: 'Angle 2', file: 'Ingenious Rottis-Migelo (1).png' },
        { index: 2, name: 'Angle 3', file: 'Ingenious Rottis-Migelo (3).png' },
        { index: 3, name: 'Isometric', file: 'Ingenious Rottis-Migelo (5).png' },
        { index: 4, name: 'Top View', file: 'Ingenious Rottis-Migelo (4).png' },
        { index: 5, name: 'Side View', file: 'Ingenious Rottis-Migelo (6).png' }
    ],
    viewAngles: {
        view1: 0,
        view2: 1,
        view3: 3
    }
};

// Screen Navigation
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function goToDashboard() {
    showScreen('dashboard');
}

function goToUpload() {
    showScreen('upload');
    resetState();
}

function goToStage1() {
    if (!state.uploadedImage) {
        alert('Please upload an image first');
        return;
    }
    showScreen('stage1');
}

function goToStage2() {
    if (state.selectedAngles.length < 3) {
        alert('Please select all 3 angles');
        return;
    }
    showScreen('stage2');
}

function goToStage3() {
    if (state.selectedEnvironments.length < 3) {
        alert('Please select all 3 environments');
        return;
    }
    showScreen('stage3');
}

function startProcessing() {
    showScreen('processing');
    simulateProcessing();
}

function goToDownload() {
    showScreen('download');
}

// Reset State
function resetState() {
    state.selectedAngles = [];
    state.selectedEnvironments = [];
    state.uploadedImage = null;
    state.polishSettings = { lighting: 0, shadows: 0, theme: 0 };

    // Reset UI
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('angleCounter').textContent = '0';
    document.getElementById('envCounter').textContent = '0';
    document.getElementById('continueStage1').disabled = true;
    document.getElementById('continueStage2').disabled = true;

    // Remove selected states
    document.querySelectorAll('.selection-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// File Upload Handling
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/(jpeg|png)')) {
        alert('Please upload a JPG or PNG image');
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    // Show loading state
    const uploadZone = document.getElementById('uploadZone');
    uploadZone.innerHTML = '<div class="spinner"></div><p>Uploading...</p>';

    try {
        // Upload to server
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            // Store uploaded file info
            state.uploadedImage = result.data;

            // Read and preview image locally
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImage').src = e.target.result;
                document.getElementById('uploadPreview').style.display = 'block';
                document.getElementById('uploadZone').style.display = 'none';
            };
            reader.readAsDataURL(file);

            console.log('✅ Upload successful:', result.data);
        } else {
            throw new Error(result.error || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload image: ' + error.message);

        // Reset upload zone
        uploadZone.innerHTML = `
            <div class="upload-icon">📁</div>
            <p class="upload-text">Drag and drop your image here</p>
            <p class="upload-subtext">or</p>
            <button class="btn-secondary" onclick="document.getElementById('fileInput').click()">Browse Files</button>
        `;
    }
}

function removeUpload() {
    state.uploadedImage = null;
    document.getElementById('uploadPreview').style.display = 'none';
    document.getElementById('uploadZone').style.display = 'block';
    document.getElementById('fileInput').value = '';
}

// Drag and Drop
const uploadZone = document.getElementById('uploadZone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--primary)';
    uploadZone.style.background = 'var(--surface)';
});

uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = '';
    uploadZone.style.background = '';

    const file = e.dataTransfer.files[0];
    if (file) {
        const input = document.getElementById('fileInput');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
    }
});

// Stage 1: Angle Selection
function selectAngle(viewType) {
    // Check if already selected
    const alreadySelected = state.selectedAngles.find(item => item.view === viewType);
    if (alreadySelected) {
        return;
    }

    // Add to selected with the current angle
    state.selectedAngles.push({
        view: viewType,
        angle: state.viewAngles[viewType]
    });

    // Update UI
    const card = document.querySelector(`[data-angle="${viewType}"]`);
    card.classList.add('selected');

    const button = card.querySelector('.btn-select');
    button.textContent = '✓ Selected';
    button.style.background = 'var(--success)';

    // Update counter
    document.getElementById('angleCounter').textContent = state.selectedAngles.length;

    // Enable continue button if all 3 selected
    if (state.selectedAngles.length === 3) {
        document.getElementById('continueStage1').disabled = false;
    }

    console.log(`Selected ${viewType} with angle ${state.viewAngles[viewType]}°`);
}

function cycleAngle(viewType, direction) {
    // Get current angle index for this view
    const currentIndex = state.viewAngles[viewType];

    // Calculate next index (with wrapping)
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) {
        nextIndex = state.availableAngles.length - 1;
    } else if (nextIndex >= state.availableAngles.length) {
        nextIndex = 0;
    }

    // Update state
    state.viewAngles[viewType] = nextIndex;
    const angleData = state.availableAngles[nextIndex];

    // Update UI
    const card = document.querySelector(`[data-angle="${viewType}"]`);
    const img = card.querySelector('.angle-image');
    const angleDisplay = card.querySelector('.angle-display');

    // Update image source
    img.src = `images/${angleData.file}`;

    // Update angle display
    angleDisplay.textContent = angleData.name;

    // Update data attribute
    card.setAttribute('data-current-angle', nextIndex);

    // Visual feedback
    card.style.transform = 'scale(1.02)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);

    console.log(`${viewType} changed to ${angleData.name}`);
}

function adjustAngle(angleType, direction) {
    // Legacy function - redirect to cycleAngle
    cycleAngle(angleType, direction);
}

async function regenerateAngles() {
    console.log('🔄 regenerateAngles() called');
    console.log('📊 Current state.uploadedImage:', state.uploadedImage);

    if (!state.uploadedImage || !state.uploadedImage.filename) {
        console.error('❌ No uploaded image found!');
        alert('Please upload an image first.\n\nSteps:\n1. Go to Upload screen\n2. Upload a product image\n3. Click Continue to Stage 1\n4. Then click "Generate AI Angles"');
        return;
    }

    console.log('✅ Image found, starting generation for:', state.uploadedImage.filename);

    // Show loading overlay with progress
    const workflowContent = document.querySelector('.workflow-content');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="spinner"></div>
        <h3>Generating Angles with AI...</h3>
        <p id="generation-status">Starting generation...</p>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" id="generation-progress"></div>
        </div>
        <p class="progress-text"><span id="progress-count">0</span> / 9 angles generated</p>
        <p style="color: var(--text-light); font-size: 14px; margin-top: 16px;">This takes 1-2 minutes per angle</p>
    `;
    workflowContent.appendChild(loadingOverlay);

    try {
        // Request all 9 angle generations
        const angleIds = [
            'angle-0deg-top',
            'angle-45deg-top',
            'angle-90deg-top',
            'angle-135deg-top',
            'angle-180deg-top',
            'angle-270deg-top',
            'isometric-3d',
            'top-orthographic',
            'side-profile'
        ];

        // Update status
        document.getElementById('generation-status').textContent = `Sending request to AI service...`;

        const response = await fetch('/api/generate-angles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageFilename: state.uploadedImage.filename,
                productName: 'Product',
                angles: angleIds
            })
        });

        document.getElementById('generation-status').textContent = `Processing response...`;

        const result = await response.json();

        console.log('Generation result:', result);

        if (result.success && result.data.successCount > 0) {
            // Update progress
            const progressBar = document.getElementById('generation-progress');
            const progressCount = document.getElementById('progress-count');
            const successCount = result.data.successCount;

            progressBar.style.width = '100%';
            progressCount.textContent = successCount;
            document.getElementById('generation-status').textContent = `✅ Successfully generated ${successCount} angles!`;

            // Update UI with generated images
            const successResults = result.data.results.filter(r => r.success);

            // Update available angles in state
            state.availableAngles = successResults.map((r, idx) => ({
                index: idx,
                name: r.angleType,
                file: r.filename,
                path: r.path
            }));

            console.log('Updated state.availableAngles:', state.availableAngles);

            // Wait a moment to show completion
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update displayed images
            updateAngleDisplays();

            // Show success message
            alert(`✅ Generated ${successCount} of ${angleIds.length} angles successfully!\n\nGenerated images are now visible in the angle selector.`);
        } else {
            throw new Error(result.error || `Generation completed but only ${result.data.successCount} angles succeeded`);
        }
    } catch (error) {
        console.error('Regeneration error:', error);
        document.getElementById('generation-status').textContent = `❌ Error: ${error.message}`;
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Failed to generate angles: ' + error.message);
    } finally {
        // Remove loading overlay
        const overlay = workflowContent.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

function updateAngleDisplays() {
    console.log('Updating angle displays with:', state.availableAngles);

    // Update each view card with new generated images
    ['view1', 'view2', 'view3'].forEach((viewType, idx) => {
        if (state.availableAngles[idx]) {
            const card = document.querySelector(`[data-angle="${viewType}"]`);
            if (!card) {
                console.error(`Card not found for ${viewType}`);
                return;
            }

            // Remove placeholder class if present
            card.classList.remove('placeholder-card');

            const angleDisplay = card.querySelector('.angle-display');
            const badge = card.querySelector('.card-badge');

            // Replace placeholder content with actual image
            const placeholderContent = card.querySelector('.placeholder-content');
            if (placeholderContent) {
                // Remove placeholder and add real image structure
                const newImageHTML = `
                    <img src="${state.availableAngles[idx].path}?t=${Date.now()}" alt="${viewType}" class="angle-image" style="opacity: 0.5;">
                    <div class="card-controls">
                        <button class="btn-control" onclick="cycleAngle('${viewType}', -1)">←</button>
                        <span class="control-label">Change Angle</span>
                        <button class="btn-control" onclick="cycleAngle('${viewType}', 1)">→</button>
                    </div>
                `;

                // Replace placeholder with image
                placeholderContent.outerHTML = newImageHTML;

                // Get the newly created image
                const img = card.querySelector('.angle-image');

                // Update on load
                img.onload = function() {
                    img.style.opacity = '1';
                    console.log(`✅ Image loaded: ${viewType}`);
                };

                img.onerror = function() {
                    console.error(`❌ Failed to load image: ${state.availableAngles[idx].path}`);
                    img.style.opacity = '1';
                    img.alt = 'Failed to load';
                };
            } else {
                // Card already has image, just update it
                const img = card.querySelector('.angle-image');
                if (img) {
                    const newPath = state.availableAngles[idx].path + '?t=' + Date.now();
                    console.log(`Updating existing image ${viewType}: ${newPath}`);

                    img.style.opacity = '0.5';
                    img.onload = function() {
                        img.style.opacity = '1';
                        console.log(`✅ Image loaded: ${viewType}`);
                    };
                    img.onerror = function() {
                        console.error(`❌ Failed to load image: ${newPath}`);
                        img.style.opacity = '1';
                    };
                    img.src = newPath;
                }
            }

            // Update angle display text
            if (angleDisplay) {
                angleDisplay.textContent = state.availableAngles[idx].name || `Angle ${idx + 1}`;
            }

            // Enable the select button
            const selectBtn = card.querySelector('.btn-select');
            if (selectBtn) {
                selectBtn.disabled = false;
                selectBtn.textContent = 'Pick This One';
            }

            // Update current angle index
            state.viewAngles[viewType] = idx;
            card.setAttribute('data-current-angle', idx);

            console.log(`✅ Updated ${viewType} card with angle: ${state.availableAngles[idx].name}`);
        }
    });
}

// Stage 2: Environment Selection
function selectEnvironment(envType) {
    // Check if already selected
    if (state.selectedEnvironments.includes(envType)) {
        return;
    }

    // Add to selected
    state.selectedEnvironments.push(envType);

    // Update UI
    const card = document.querySelector(`[data-env="${envType}"]`);
    card.classList.add('selected');

    const button = card.querySelector('.btn-select');
    button.textContent = '✓ Selected';
    button.style.background = 'var(--success)';

    // Update counter
    document.getElementById('envCounter').textContent = state.selectedEnvironments.length;

    // Enable continue button if all 3 selected
    if (state.selectedEnvironments.length === 3) {
        document.getElementById('continueStage2').disabled = false;
    }
}

function adjustSlider(sliderType, direction) {
    // Simulate slider adjustment
    console.log(`Adjusting ${sliderType} by ${direction > 0 ? '+' : '-'}1`);

    // Visual feedback
    const controls = document.querySelectorAll('.slider-control');
    controls.forEach(control => {
        const label = control.querySelector('label');
        if (label && label.textContent.toLowerCase().includes(sliderType.toLowerCase())) {
            control.style.background = 'rgba(0, 102, 255, 0.05)';
            setTimeout(() => {
                control.style.background = '';
            }, 200);
        }
    });

    // Update state for polish stage
    if (state.polishSettings.hasOwnProperty(sliderType)) {
        state.polishSettings[sliderType] = Math.max(-2, Math.min(2, state.polishSettings[sliderType] + direction));
        console.log('Polish settings:', state.polishSettings);
    }
}

// Stage 3: Polish Presets
function applyPreset(presetName) {
    console.log(`Applying ${presetName} preset`);

    // Visual feedback
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Apply preset values
    switch(presetName) {
        case 'modern':
            state.polishSettings = { lighting: 1, shadows: -1, theme: 0 };
            break;
        case 'classic':
            state.polishSettings = { lighting: 0, shadows: 1, theme: 1 };
            break;
        case 'minimal':
            state.polishSettings = { lighting: 1, shadows: -1, theme: -1 };
            break;
    }

    // Flash preview grid to show changes
    const previewGrid = document.querySelector('.preview-grid');
    previewGrid.style.opacity = '0.7';
    setTimeout(() => {
        previewGrid.style.opacity = '1';
    }, 200);
}

// Processing Simulation
function simulateProcessing() {
    const progressFill = document.getElementById('progressFill');
    const timeRemaining = document.getElementById('timeRemaining');

    let progress = 0;
    let timeLeft = 720; // 12 minutes in seconds

    const progressInterval = setInterval(() => {
        progress += 1;
        progressFill.style.width = progress + '%';

        // Update time
        timeLeft -= 7.2;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = Math.floor(timeLeft % 60);
        timeRemaining.textContent = `Estimated time: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (progress >= 100) {
            clearInterval(progressInterval);
            setTimeout(() => {
                goToDownload();
            }, 500);
        }
    }, 100); // Complete in ~10 seconds for demo
}

// Download Handlers
document.querySelectorAll('.btn-download-single').forEach(btn => {
    btn.addEventListener('click', () => {
        alert('Individual image download (In real app, this would download the high-res image)');
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('PhotoGen AI Prototype Loaded');
    console.log('Navigate through the workflow to see the 3-stage mastery process');
});
