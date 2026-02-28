# Technical Architecture Document
# E-Commerce Table Image Generator - MVP

**Document Version:** 1.0
**Date:** 2025-11-15
**Project:** Image Generator App
**Status:** Draft
**Related:** [PRD_Image_Generator_MVP.md](./PRD_Image_Generator_MVP.md)

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [System Architecture](#system-architecture)
4. [Component Design](#component-design)
5. [Data Flow](#data-flow)
6. [API Integration](#api-integration)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Security Considerations](#security-considerations)
10. [Performance Optimization](#performance-optimization)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Side Only)               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   React UI   │───→│ State Manager│───→│Image Service │ │
│  │  Components  │    │   (Zustand)  │    │   (Canvas)   │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │         │
│         └────────────────────┼────────────────────┘         │
│                              │                              │
│                    ┌─────────▼─────────┐                    │
│                    │  Gemini Service   │                    │
│                    │  (API Client)     │                    │
│                    └─────────┬─────────┘                    │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │ HTTPS
                               │
                    ┌──────────▼──────────┐
                    │   Google Gemini     │
                    │  2.5 Flash Image    │
                    │       API           │
                    └─────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | React 18+ | UI component library |
| **State Management** | Zustand | Lightweight state management |
| **Build Tool** | Vite | Fast development & bundling |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Image Processing** | Canvas API | Client-side image manipulation |
| **File Handling** | HTML5 File API | Upload/download handling |
| **ZIP Creation** | JSZip | Client-side ZIP generation |
| **AI Integration** | @google/generative-ai | Gemini API SDK |
| **HTTP Client** | Fetch API | Native browser HTTP |

### Deployment Model
- **Environment:** Local development server
- **Hosting:** `localhost:5173` (Vite dev server)
- **No Backend:** Fully client-side application
- **No Database:** No persistent storage
- **API Keys:** Stored in `.env` file (not committed to git)

---

## Architecture Principles

### 1. Client-Side First
- All processing happens in browser
- No backend server required for MVP
- Reduces infrastructure complexity
- Fast iteration and development

### 2. Stateless Design
- No session persistence
- Cache cleared after each workflow completion
- Fresh state on browser refresh
- Simplifies error recovery

### 3. Progressive Enhancement
- Core functionality works without advanced features
- Graceful degradation for older browsers
- Feature detection before use

### 4. Security by Design
- API keys never exposed to client (environment variables)
- No sensitive data storage
- Input validation at every step
- XSS prevention through React's built-in escaping

### 5. Performance Optimization
- Lazy loading of components
- Image optimization before display
- Parallel API calls where possible
- Memory cleanup after operations

---

## System Architecture

### Component Hierarchy

```
App
├── Router (Step Navigation)
│   ├── Step0_UploadSurface
│   │   ├── FileUploader
│   │   ├── ImagePreview
│   │   └── ValidationFeedback
│   │
│   ├── Step1_SelectCategory
│   │   ├── CategoryCard
│   │   └── CategoryExampleImage
│   │
│   ├── Step2_SelectModel
│   │   ├── ModelGrid
│   │   ├── ModelCard
│   │   └── ModelPreview
│   │
│   ├── Step3_GenerateImages
│   │   ├── ProgressBar
│   │   ├── StatusMessage
│   │   └── TimeEstimate
│   │
│   ├── Step4_ReviewGallery
│   │   ├── ImageGallery
│   │   ├── ImageCard
│   │   ├── ImageModal (Zoom)
│   │   └── SelectionControls
│   │
│   └── Step5_DownloadZip
│       ├── ZipPreview
│       └── DownloadButton
│
└── GlobalComponents
    ├── ErrorBoundary
    ├── LoadingSpinner
    └── NavigationButtons
```

### File Structure

```
/image_generator_app
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── Step0_UploadSurface.jsx
│   │   ├── Step1_SelectCategory.jsx
│   │   ├── Step2_SelectModel.jsx
│   │   ├── Step3_GenerateImages.jsx
│   │   ├── Step4_ReviewGallery.jsx
│   │   ├── Step5_DownloadZip.jsx
│   │   └── shared/
│   │       ├── Button.jsx
│   │       ├── ErrorMessage.jsx
│   │       └── ProgressBar.jsx
│   │
│   ├── services/
│   │   ├── geminiService.js        # ✅ Already created
│   │   ├── imageService.js          # Image validation, processing
│   │   ├── zipService.js            # ZIP creation
│   │   └── validationService.js     # Input validation
│   │
│   ├── store/
│   │   ├── appStore.js              # Zustand store
│   │   └── types.js                 # TypeScript types (if using TS)
│   │
│   ├── config/
│   │   ├── prompts.js               # ✅ Already created
│   │   ├── models.js                # 3D model metadata
│   │   └── categories.js            # Category definitions
│   │
│   ├── assets/
│   │   ├── 3d-models/
│   │   │   ├── cafe/
│   │   │   ├── office/
│   │   │   ├── dining/
│   │   │   └── living/
│   │   └── examples/                # Category example images
│   │
│   ├── hooks/
│   │   ├── useFileUpload.js
│   │   ├── useImageGeneration.js
│   │   └── useZipDownload.js
│   │
│   ├── utils/
│   │   ├── imageUtils.js            # Image conversion, compression
│   │   ├── errorUtils.js            # Error formatting
│   │   └── constants.js             # App constants
│   │
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # React entry point
│   └── index.css                    # Global styles
│
├── docs/
│   ├── PRD_Image_Generator_MVP.md   # ✅ Already created
│   ├── ARCHITECTURE.md              # This document
│   ├── EPIC_Story.md                # To be created
│   └── USER_STORIES.md              # To be created
│
├── .env                              # API keys (not in git)
├── .env.example                      # Template for .env
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Component Design

### Core Components Specification

#### 1. App.jsx (Root Component)
```javascript
/**
 * Main application component
 * Responsibilities:
 * - Route management between steps
 * - Global error boundary
 * - State initialization
 */
import { useAppStore } from './store/appStore';

export function App() {
  const currentStep = useAppStore(state => state.currentStep);

  return (
    <ErrorBoundary>
      <div className="app-container">
        {currentStep === 0 && <Step0_UploadSurface />}
        {currentStep === 1 && <Step1_SelectCategory />}
        {currentStep === 2 && <Step2_SelectModel />}
        {currentStep === 3 && <Step3_GenerateImages />}
        {currentStep === 4 && <Step4_ReviewGallery />}
        {currentStep === 5 && <Step5_DownloadZip />}
      </div>
    </ErrorBoundary>
  );
}
```

#### 2. Step0_UploadSurface.jsx
```javascript
/**
 * Upload table surface image
 * Validation: JPG/PNG, <10MB, min 512x512px
 */
export function Step0_UploadSurface() {
  const { setTableSurface, goToNextStep } = useAppStore();
  const { uploadFile, error } = useFileUpload();

  const handleUpload = async (file) => {
    const validatedFile = await uploadFile(file);
    if (validatedFile) {
      setTableSurface(validatedFile);
      goToNextStep();
    }
  };

  // ... UI implementation
}
```

#### 3. Step3_GenerateImages.jsx (Most Complex)
```javascript
/**
 * Generate 8 images using Gemini API
 * Shows progress, handles errors, manages timeout
 */
import { generateTableImages } from '../services/geminiService';

export function Step3_GenerateImages() {
  const {
    tableSurface,
    category,
    model3D,
    setGeneratedImages
  } = useAppStore();

  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    generateImages();
  }, []);

  const generateImages = async () => {
    try {
      setStatus('generating');

      const images = await generateTableImages({
        tableSurfaceFile: tableSurface,
        model3DFile: model3D,
        category: category,
        onProgress: (current, total, message) => {
          setProgress((current / total) * 100);
          setStatus(message);
        }
      });

      setGeneratedImages(images);
      setStatus('complete');
      goToNextStep();

    } catch (error) {
      setStatus('error');
      // Show error UI with retry option
    }
  };

  // ... UI with progress bar
}
```

---

## Data Flow

### State Transitions

```
┌──────────────┐
│ STEP 0       │  User uploads oak_table.jpg
│ Upload       │  State: { tableSurface: File, currentStep: 0 }
└──────┬───────┘
       │ goToNextStep()
       ▼
┌──────────────┐
│ STEP 1       │  User selects "café"
│ Category     │  State: { ..., category: "cafe", currentStep: 1 }
└──────┬───────┘
       │ goToNextStep()
       ▼
┌──────────────┐
│ STEP 2       │  User selects coffee_cup.jpg
│ Model        │  State: { ..., model3D: File, currentStep: 2 }
└──────┬───────┘
       │ goToNextStep()
       ▼
┌──────────────┐
│ STEP 3       │  Auto-triggers generation
│ Generate     │  State: { ..., generationStatus: 'generating' }
│              │  → Gemini API calls (3 turns)
│              │  State: { ..., generatedImages: {...}, currentStep: 3 }
└──────┬───────┘
       │ Auto-advance when complete
       ▼
┌──────────────┐
│ STEP 4       │  User selects 5/8 images
│ Review       │  State: { ..., selectedImageIds: [...] }
└──────┬───────┘
       │ Download button
       ▼
┌──────────────┐
│ STEP 5       │  Create ZIP, download, clear cache
│ Download     │  State: { ..., currentStep: 5 }
└──────┬───────┘
       │ Complete
       ▼
    [RESET] → Back to Step 0
```

### Image Generation Flow (Detailed)

```
Step 3: Generate Images
├─ Initialize Gemini chat session
├─ TURN 1: Send table surface reference
│   ├─ Convert File to base64
│   ├─ Send message: "This is my table surface..."
│   └─ Await acknowledgment
├─ TURN 2: Generate 4 clean images
│   ├─ Loop 1: Send clean prompt + 3D model
│   │   ├─ Update progress: 12.5% (1/8)
│   │   ├─ Receive image blob
│   │   └─ Store in cleanImages[0]
│   ├─ Loop 2: Send clean prompt variation
│   │   ├─ Update progress: 25% (2/8)
│   │   └─ Store in cleanImages[1]
│   ├─ Loop 3: 37.5% (3/8) → cleanImages[2]
│   └─ Loop 4: 50% (4/8) → cleanImages[3]
└─ TURN 3+: Generate 4 lifestyle images
    ├─ Loop 1: Send lifestyle prompt for café
    │   ├─ Update progress: 62.5% (5/8)
    │   └─ Store in lifestyleImages[0]
    ├─ Loop 2: 75% (6/8) → lifestyleImages[1]
    ├─ Loop 3: 87.5% (7/8) → lifestyleImages[2]
    └─ Loop 4: 100% (8/8) → lifestyleImages[3]
        └─ Generation complete → Advance to Step 4
```

---

## API Integration

### Gemini API Configuration

```javascript
// .env
VITE_GEMINI_API_KEY=your_api_key_here

// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-image", // or "gemini-2.0-flash-exp"
  generationConfig: {
    responseModalities: ["TEXT", "IMAGE"],
    maxOutputTokens: 8192,
  }
});
```

### API Call Pattern

```javascript
// Conversation-based approach (maintains context)
const chat = model.startChat({ history: [] });

// Turn 1: Reference
await chat.sendMessage([
  { text: "This is my table surface..." },
  { inlineData: { mimeType: "image/jpeg", data: base64Surface }}
]);

// Turn 2: Generate
const response = await chat.sendMessage([
  { text: "Create clean product photography..." },
  { inlineData: { mimeType: "image/jpeg", data: base64Model }}
]);

// Extract image from response
const imageData = response.response.candidates[0]
  .content.parts.find(p => p.inlineData?.mimeType.startsWith('image/'))
  .inlineData.data;
```

### Error Handling

```javascript
try {
  const response = await chat.sendMessage(...);
} catch (error) {
  if (error.message.includes('timeout')) {
    // Retry with backoff
  } else if (error.message.includes('rate limit')) {
    // Wait and retry
  } else {
    // Show user-friendly error
  }
}
```

---

## State Management

### Zustand Store Structure

```javascript
// src/store/appStore.js
import create from 'zustand';

export const useAppStore = create((set, get) => ({

  // Navigation
  currentStep: 0,

  // Step 0: Upload
  tableSurface: null,
  tableSurfacePreviewUrl: null,

  // Step 1: Category
  selectedCategory: null, // 'cafe' | 'office' | 'dining' | 'living'

  // Step 2: Model
  selectedModel: null, // { id, name, file, category }

  // Step 3: Generation
  generationStatus: 'idle', // 'idle' | 'generating' | 'complete' | 'error'
  generationProgress: 0, // 0-100
  currentGeneratingImage: '', // Status message
  generatedImages: {
    clean: [], // Array<{ id, type, blob, url }>
    lifestyle: []
  },

  // Step 4: Review
  selectedImageIds: [], // Array<string>

  // Errors
  error: null, // { message, step }

  // Actions
  setTableSurface: (file) => set({
    tableSurface: file,
    tableSurfacePreviewUrl: URL.createObjectURL(file)
  }),

  setCategory: (category) => set({ selectedCategory: category }),

  setModel: (model) => set({ selectedModel: model }),

  setGeneratedImages: (images) => {
    // Create blob URLs for display
    const cleanWithUrls = images.clean.map(img => ({
      ...img,
      url: URL.createObjectURL(img.blob)
    }));
    const lifestyleWithUrls = images.lifestyle.map(img => ({
      ...img,
      url: URL.createObjectURL(img.blob)
    }));

    set({
      generatedImages: {
        clean: cleanWithUrls,
        lifestyle: lifestyleWithUrls
      }
    });
  },

  toggleImageSelection: (imageId) => set((state) => {
    const isSelected = state.selectedImageIds.includes(imageId);
    return {
      selectedImageIds: isSelected
        ? state.selectedImageIds.filter(id => id !== imageId)
        : [...state.selectedImageIds, imageId]
    };
  }),

  goToNextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  goToPreviousStep: () => set((state) => ({ currentStep: state.currentStep - 1 })),

  resetApp: () => {
    // Clean up blob URLs
    const { generatedImages, tableSurfacePreviewUrl } = get();
    generatedImages.clean.forEach(img => URL.revokeObjectURL(img.url));
    generatedImages.lifestyle.forEach(img => URL.revokeObjectURL(img.url));
    if (tableSurfacePreviewUrl) URL.revokeObjectURL(tableSurfacePreviewUrl);

    // Reset state
    set({
      currentStep: 0,
      tableSurface: null,
      tableSurfacePreviewUrl: null,
      selectedCategory: null,
      selectedModel: null,
      generationStatus: 'idle',
      generationProgress: 0,
      generatedImages: { clean: [], lifestyle: [] },
      selectedImageIds: [],
      error: null
    });
  }
}));
```

---

## Error Handling

### Error Categories

```javascript
// src/utils/errorUtils.js

export const ERROR_TYPES = {
  VALIDATION: 'validation',
  GENERATION: 'generation',
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  API_LIMIT: 'api_limit'
};

export function handleError(error, context) {
  const errorType = categorizeError(error);

  switch (errorType) {
    case ERROR_TYPES.VALIDATION:
      return {
        message: "Invalid file. Please upload a JPG or PNG image.",
        recoverable: true,
        action: "retry"
      };

    case ERROR_TYPES.GENERATION:
      return {
        message: "Image generation failed. Would you like to retry?",
        recoverable: true,
        action: "retry"
      };

    case ERROR_TYPES.TIMEOUT:
      return {
        message: "Generation took too long. Please try again.",
        recoverable: true,
        action: "restart"
      };

    case ERROR_TYPES.API_LIMIT:
      return {
        message: "API rate limit reached. Please wait a moment.",
        recoverable: true,
        action: "wait"
      };

    default:
      return {
        message: "An unexpected error occurred. Please start over.",
        recoverable: false,
        action: "reset"
      };
  }
}
```

### Retry Logic

```javascript
async function generateWithRetry(generateFn, maxRetries = 1) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await generateFn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await wait(2000 * (attempt + 1)); // Exponential backoff
      }
    }
  }

  throw lastError;
}
```

---

## Security Considerations

### 1. API Key Protection
```javascript
// ✅ CORRECT: Store in .env, never commit
VITE_GEMINI_API_KEY=sk-xxxxx

// ❌ WRONG: Hardcode in source
const API_KEY = "sk-xxxxx"; // Never do this!
```

### 2. Input Validation
```javascript
// Validate file type
function validateImageFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File too large');
  }

  return true;
}
```

### 3. XSS Prevention
- React automatically escapes JSX content
- Use `dangerouslySetInnerHTML` sparingly
- Sanitize any user-generated content

### 4. CORS & CSP
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               img-src 'self' blob: data:;
               connect-src 'self' https://generativelanguage.googleapis.com">
```

---

## Performance Optimization

### 1. Code Splitting
```javascript
// Lazy load steps
const Step3_GenerateImages = lazy(() => import('./components/Step3_GenerateImages'));
```

### 2. Image Optimization
```javascript
// Compress images before display
async function optimizeImage(blob, maxWidth = 1200) {
  const img = await createImageBitmap(blob);
  const canvas = document.createElement('canvas');

  const scale = Math.min(1, maxWidth / img.width);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas.toBlob({ type: 'image/jpeg', quality: 0.9 });
}
```

### 3. Memory Management
```javascript
// Clean up blob URLs when component unmounts
useEffect(() => {
  return () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };
}, [imageUrl]);
```

### 4. Progress Streaming
```javascript
// Update UI immediately during generation
onProgress: (current, total, message) => {
  // Batched state updates for performance
  flushSync(() => {
    setProgress((current / total) * 100);
    setStatus(message);
  });
}
```

---

## Testing Strategy

### Unit Tests
- Validation functions
- State management actions
- Utility functions
- Error handling logic

### Integration Tests
- Complete workflow (Steps 0-5)
- API integration (mocked)
- File upload/download
- State transitions

### End-to-End Tests
- Full user journey
- Error scenarios
- Browser compatibility

### Performance Tests
- Generation time (<5 min)
- Memory usage
- Large file handling

---

## Deployment

### Local Development
```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

### Environment Setup
```bash
# .env.example
VITE_GEMINI_API_KEY=your_api_key_here
```

### Build for Production (Future)
```bash
npm run build
npm run preview
```

---

## Monitoring & Logging

### Client-Side Logging
```javascript
// src/utils/logger.js
export function logEvent(event, data) {
  console.log(`[${new Date().toISOString()}] ${event}`, data);

  // Future: Send to analytics service
  // analytics.track(event, data);
}

// Usage
logEvent('generation_started', { category, modelId });
logEvent('generation_complete', { duration, imageCount });
logEvent('generation_error', { error: error.message });
```

---

## Appendix

### Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google/generative-ai": "^0.1.0",
    "zustand": "^4.4.0",
    "jszip": "^3.10.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| File API | ✅ 90+ | ✅ 90+ | ✅ 14+ | ✅ 90+ |
| Canvas API | ✅ 90+ | ✅ 90+ | ✅ 14+ | ✅ 90+ |
| Blob URLs | ✅ 90+ | ✅ 90+ | ✅ 14+ | ✅ 90+ |
| Fetch API | ✅ 90+ | ✅ 90+ | ✅ 14+ | ✅ 90+ |

---

**Document Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Tech Lead | ___________ | ___________ | ___________ |
| Frontend Dev | ___________ | ___________ | ___________ |
| DevOps | ___________ | ___________ | ___________ |

---

**Change Log:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-15 | BMad Master | Initial architecture document |
