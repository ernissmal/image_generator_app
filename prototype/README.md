# PhotoGen AI - Prototype

A clean, interactive prototype for the AI Product Photography platform that demonstrates the complete 3-stage mastery workflow.

## Overview

This prototype showcases the MVP user experience based on the PRD requirements:
- **Landing Page** - Value proposition and call-to-action
- **Dashboard** - User account overview with stats, recent generations, and quick tips
- **Upload Screen** - Simple drag-and-drop or file picker
- **Stage 1: Angle Mastery** - Select 3 angles with plus/minus rotation controls
- **Stage 2: Environment & Props** - Choose environments and adjust prop density
- **Stage 3: Polish** - Fine-tune lighting, shadows, and theme with presets
- **Processing** - Progress indicator with time estimate
- **Download** - Preview and download all 6 generated images

## Features

✅ **Clean, Approachable Design** - "Stripe meets Canva" aesthetic
✅ **Progressive Disclosure** - One stage at a time workflow
✅ **Plus/Minus Controls** - Simple binary adjustments, no complex inputs
✅ **Real Sample Images** - Uses Unsplash images to demonstrate the flow
✅ **Fully Interactive** - Click through the entire workflow
✅ **Responsive Layout** - Works on desktop and tablet
✅ **Mock Data** - Simulated processing and state management

## How to View

1. **Open in Browser**
   ```bash
   # Navigate to the prototype directory
   cd prototype

   # Open index.html in your default browser
   open index.html

   # Or use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Navigate the Prototype**
   - **Landing Page**: Click "Start Free Trial" button
   - **Dashboard**: Click "PhotoGen AI" logo from landing page nav (or type `goToDashboard()` in console)
   - **Upload**: Drag/drop an image or click "Browse Files"
   - **Stage 1**: Select 3 angles using "Pick This One" buttons
   - **Stage 2**: Select 3 environments
   - **Stage 3**: Try preset buttons or adjust sliders
   - **Processing**: Watch the progress bar (sped up for demo)
   - **Download**: Preview all 6 images

## File Structure

```
prototype/
├── index.html          # All screens in one file
├── css/
│   └── style.css       # Complete styling
├── js/
│   └── app.js          # Interaction logic and state management
└── README.md           # This file
```

## Navigation Functions (Console Commands)

Open browser console (F12) and use these functions to jump to any screen:

```javascript
showScreen('landing')     // Landing page
showScreen('dashboard')   // Dashboard
showScreen('upload')      // Upload screen
showScreen('stage1')      // Stage 1: Angles
showScreen('stage2')      // Stage 2: Environment
showScreen('stage3')      // Stage 3: Polish
showScreen('processing')  // Processing screen
showScreen('download')    // Download screen
```

## Key Design Decisions

### Visual Design
- **Color Palette**: Primary blue (#0066ff) with neutral grays
- **Typography**: System font stack for fast loading and native feel
- **Spacing**: Generous whitespace, 8px base unit
- **Shadows**: Subtle elevation for depth
- **Border Radius**: Consistent 8-12px for friendly feel

### UX Patterns
- **Progressive Steps**: Visual progress indicator across all stages
- **Binary Controls**: All adjustments use +/- buttons, no number inputs
- **Selection Confirmation**: Cards highlight when selected
- **Disabled States**: Buttons disabled until requirements met
- **Loading States**: Spinners and progress bars for all async operations

### Interaction Model
- **One Decision at a Time**: Single stage visible, can't skip ahead
- **Visual Feedback**: Hover states, selected states, transitions
- **Error Prevention**: Validation before progression
- **Escape Hatches**: Back buttons, regenerate options

## Mock Data & Simulations

- **Images**: Using Unsplash API URLs for realistic product photos
- **Processing Time**: Actual 10-15 min reduced to ~10 seconds for demo
- **State Management**: JavaScript object tracks selections
- **Progress Bar**: Animated to complete in demo time

## What's NOT Included

This is a visual prototype, so it does NOT include:

- ❌ Real authentication/backend
- ❌ Actual AI image generation
- ❌ Payment processing
- ❌ Database persistence
- ❌ Email notifications
- ❌ Real file upload to server
- ❌ ZIP file generation
- ❌ User account management

## Next Steps for Development

To turn this prototype into a working MVP:

1. **Backend API** - Node.js/Express with endpoints for upload, generation, download
2. **Google Gemini Integration** - Connect to actual AI API with prompts
3. **Authentication** - JWT-based auth with PostgreSQL user storage
4. **Payment Integration** - Stripe Checkout for subscriptions
5. **Cloud Storage** - Google Cloud Storage for image handling
6. **Queue System** - Redis for background job processing
7. **Email Service** - SendGrid for notifications
8. **Deployment** - Vercel (frontend) + Cloud Run (backend)

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern layout with Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Unsplash** - Sample product images

## Browser Support

Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Minimum requirements:
- Modern browser with ES6 support
- Screen width: 768px+

## License

This prototype is part of the Image Generator App MVP project.

---

**Built with** the BMAD Method • **Based on** PRD v1.0 • **Status** Ready for Development
