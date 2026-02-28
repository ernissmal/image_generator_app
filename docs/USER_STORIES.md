# User Stories: E-Commerce Table Image Generator MVP

**Epic:** EPIC-001 - AI-Powered E-Commerce Image Generation Workflow
**Project:** Image Generator App
**Created:** 2025-11-15
**Status:** Ready for Development

---

## Story Index

| ID | Story | Priority | Sprint | Status |
|----|-------|----------|--------|--------|
| US-001 | Upload Table Surface Image | P0 | 1 | Ready |
| US-002 | Select Scene Category | P0 | 1 | Ready |
| US-003 | Select 3D Model Snapshot | P0 | 1 | Ready |
| US-004 | Generate 8 AI Images | P0 | 2 | Ready |
| US-005 | Track Generation Progress | P0 | 2 | Ready |
| US-006 | Review Generated Images | P0 | 3 | Ready |
| US-007 | Select Favorite Images | P0 | 3 | Ready |
| US-008 | Download Selected Images as ZIP | P0 | 3 | Ready |
| US-009 | Handle Errors Gracefully | P1 | 2 | Ready |
| US-010 | Clear Cache After Download | P1 | 3 | Ready |
| US-011 | Zoom Images for Inspection | P2 | 4 | Nice to Have |
| US-012 | Filter Images by Type | P2 | 4 | Nice to Have |

---

## US-001: Upload Table Surface Image

### Story
```
As a marketing professional,
I want to upload a table surface image,
So that I can use it as the base for generating product images.
```

### Priority: P0 (Must Have)
### Sprint: 1
### Story Points: 3

### Acceptance Criteria

**AC1:** User sees a clear upload area with drag-and-drop zone
- GIVEN I am on Step 0
- WHEN the page loads
- THEN I see a prominent upload area with instructions

**AC2:** User can drag and drop an image file
- GIVEN I have an image file (JPG/PNG)
- WHEN I drag it over the upload zone
- THEN the zone highlights to show it's ready to receive
- AND when I drop it, the file is uploaded

**AC3:** User can click to browse and select a file
- GIVEN I am on Step 0
- WHEN I click "Browse Files" button
- THEN a file picker dialog opens
- AND I can select a JPG or PNG file

**AC4:** System validates file type
- GIVEN I upload a file
- WHEN the file is not JPG or PNG
- THEN I see error: "Invalid file type. Please upload JPG or PNG."
- AND the upload is rejected

**AC5:** System validates file size
- GIVEN I upload a file
- WHEN the file is >10MB
- THEN I see error: "File too large. Maximum size is 10MB."
- AND the upload is rejected

**AC6:** System validates image dimensions
- GIVEN I upload an image
- WHEN the dimensions are <512x512px
- THEN I see error: "Image too small. Minimum size is 512x512 pixels."
- AND the upload is rejected

**AC7:** User sees preview of uploaded image
- GIVEN I successfully upload an image
- WHEN validation passes
- THEN I see a preview of my image
- AND dimensions are displayed (e.g., "1920x1080")

**AC8:** User can proceed to next step
- GIVEN I have successfully uploaded an image
- WHEN I click "Continue"
- THEN I advance to Step 1 (Category Selection)

**AC9:** User can remove and re-upload
- GIVEN I have uploaded an image
- WHEN I click "Remove" or "Upload Different"
- THEN the current image is cleared
- AND I can upload a new one

### Technical Tasks
- [ ] Create `Step0_UploadSurface.jsx` component
- [ ] Implement drag-and-drop functionality
- [ ] Create file validation service
- [ ] Add image preview component
- [ ] Implement state management for uploaded file
- [ ] Create error messaging component
- [ ] Add file size/type/dimension validation
- [ ] Implement "Continue" button with validation check

### Definition of Done
- [ ] All acceptance criteria met
- [ ] File validation works for all specified criteria
- [ ] Error messages are clear and actionable
- [ ] Preview displays correctly
- [ ] State persists uploaded image
- [ ] Navigation to Step 1 works
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Code reviewed and approved

---

## US-002: Select Scene Category

### Story
```
As a marketing professional,
I want to select a scene category for my product,
So that the lifestyle images are generated in an appropriate context.
```

### Priority: P0 (Must Have)
### Sprint: 1
### Story Points: 2

### Acceptance Criteria

**AC1:** User sees 4 category options
- GIVEN I am on Step 1
- WHEN the page loads
- THEN I see 4 category cards: Café, Office, Dining Room, Living Room

**AC2:** Each category shows an example image
- GIVEN I am viewing categories
- WHEN I look at each card
- THEN each shows a representative example image of that category

**AC3:** User can select one category
- GIVEN I am viewing categories
- WHEN I click on "Café"
- THEN that card is highlighted/selected
- AND other cards are not selected (single selection only)

**AC4:** Category selection is required
- GIVEN I am on Step 1
- WHEN I try to click "Continue" without selecting a category
- THEN I see error: "Please select a category"
- AND navigation is blocked

**AC5:** User can change selection
- GIVEN I have selected "Café"
- WHEN I click "Office"
- THEN "Office" becomes selected
- AND "Café" is deselected

**AC6:** User can navigate back
- GIVEN I am on Step 1
- WHEN I click "Previous"
- THEN I return to Step 0
- AND my uploaded image is still there

**AC7:** User can proceed to next step
- GIVEN I have selected a category
- WHEN I click "Continue"
- THEN I advance to Step 2 (Model Selection)

### Technical Tasks
- [ ] Create `Step1_SelectCategory.jsx` component
- [ ] Create `CategoryCard` sub-component
- [ ] Add category example images to assets
- [ ] Implement single-selection logic
- [ ] Add state management for selected category
- [ ] Create navigation buttons (Previous/Continue)
- [ ] Add validation for category selection
- [ ] Style selected vs unselected states

### Definition of Done
- [ ] All acceptance criteria met
- [ ] 4 categories display with example images
- [ ] Selection state works correctly
- [ ] Validation prevents empty selection
- [ ] Navigation (back/forward) works
- [ ] Visual feedback for selection clear
- [ ] Tested on all browsers
- [ ] Code reviewed

---

## US-003: Select 3D Model Snapshot

### Story
```
As a marketing professional,
I want to select a 3D model that fits my category,
So that the generated images show the right product on my table surface.
```

### Priority: P0 (Must Have)
### Sprint: 1
### Story Points: 3

### Acceptance Criteria

**AC1:** User sees only models compatible with selected category
- GIVEN I selected "Café" category
- WHEN I arrive at Step 2
- THEN I see only café-related models (coffee cups, pastries, etc.)
- AND I do not see models from other categories

**AC2:** Each model shows a preview image
- GIVEN I am viewing models
- WHEN I look at each option
- THEN I see a clear preview of the 3D model snapshot

**AC3:** User can select one model
- GIVEN I am viewing models
- WHEN I click on "Coffee Cup - Top View"
- THEN that model is highlighted/selected
- AND I see a larger preview

**AC4:** Model selection is required
- GIVEN I am on Step 2
- WHEN I try to click "Generate Images" without selecting a model
- THEN I see error: "Please select a 3D model"
- AND generation is blocked

**AC5:** User sees model metadata
- GIVEN I select a model
- WHEN I view the selection
- THEN I see model name, description, and compatibility indicator

**AC6:** User can navigate back
- GIVEN I am on Step 2
- WHEN I click "Previous"
- THEN I return to Step 1
- AND my category selection is preserved

**AC7:** User can proceed to generation
- GIVEN I have selected a model
- WHEN I click "Generate Images"
- THEN I advance to Step 3 (Generation)

### Technical Tasks
- [ ] Create `Step2_SelectModel.jsx` component
- [ ] Create `ModelCard` sub-component
- [ ] Add 3D model snapshot images to assets (4-6 per category)
- [ ] Create model metadata configuration file
- [ ] Implement category-based filtering logic
- [ ] Add state management for selected model
- [ ] Create model preview enlargement
- [ ] Style selection states
- [ ] Implement "Generate Images" button

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Models filter by category correctly
- [ ] At least 4 models per category available
- [ ] Selection state works
- [ ] Preview displays correctly
- [ ] Navigation works (back/forward)
- [ ] Metadata displays clearly
- [ ] Code reviewed

---

## US-004: Generate 8 AI Images

### Story
```
As a marketing professional,
I want the system to automatically generate 8 professional images,
So that I have multiple options for my e-commerce listing.
```

### Priority: P0 (Must Have)
### Sprint: 2
### Story Points: 8

### Acceptance Criteria

**AC1:** Generation starts automatically
- GIVEN I clicked "Generate Images" on Step 2
- WHEN Step 3 loads
- THEN generation begins immediately without additional user action

**AC2:** System generates exactly 4 clean product images
- GIVEN generation is in progress
- WHEN clean image phase completes
- THEN exactly 4 clean product images are generated
- AND they have neutral backgrounds
- AND they show the table with selected surface and model

**AC3:** System generates exactly 4 lifestyle images
- GIVEN clean images are complete
- WHEN lifestyle image phase completes
- THEN exactly 4 lifestyle images are generated
- AND they show the table in the selected category context

**AC4:** Generation completes within 5 minutes
- GIVEN generation starts
- WHEN all 8 images are generated
- THEN total time is ≤5 minutes (95% of cases)

**AC5:** Images meet quality standards
- GIVEN all 8 images are generated
- WHEN marketing team reviews them
- THEN ≥80% are rated "professional quality"

**AC6:** System uses Gemini conversational approach
- GIVEN generation is in progress
- WHEN making API calls
- THEN Turn 1 establishes table surface reference
- AND Turn 2 generates 4 clean images
- AND Turns 3+ generate 4 lifestyle images

**AC7:** Generation handles individual image failures
- GIVEN an individual image fails to generate
- WHEN the failure is detected
- THEN system retries that image once automatically
- AND if retry fails, shows error for that specific image

**AC8:** User advances to review automatically
- GIVEN all 8 images complete successfully
- WHEN generation finishes
- THEN user auto-advances to Step 4 (Review)

### Technical Tasks
- [ ] Integrate Gemini API SDK (`@google/generative-ai`)
- [ ] Implement 3-turn conversation flow
- [ ] Create `generateTableImages()` function (already exists in geminiService.js)
- [ ] Implement progress callback system
- [ ] Add retry logic for individual image failures
- [ ] Convert images to blob format for display
- [ ] Implement 5-minute timeout protection
- [ ] Add error handling for API failures
- [ ] Store generated images in state
- [ ] Auto-advance to Step 4 on success

### Definition of Done
- [ ] All acceptance criteria met
- [ ] 8 images generate consistently
- [ ] Generation time <5 min (tested 10+ times)
- [ ] Image quality validated by marketing
- [ ] Retry logic works for failures
- [ ] Timeout protection prevents hangs
- [ ] State stores all generated images
- [ ] Auto-advance works
- [ ] Code reviewed

---

## US-005: Track Generation Progress

### Story
```
As a marketing professional,
I want to see real-time progress while images are generating,
So that I know the system is working and how long to wait.
```

### Priority: P0 (Must Have)
### Sprint: 2
### Story Points: 3

### Acceptance Criteria

**AC1:** User sees progress bar
- GIVEN generation is in progress
- WHEN I am on Step 3
- THEN I see a progress bar showing 0-100%

**AC2:** Progress updates in real-time
- GIVEN images are generating
- WHEN each image completes
- THEN progress bar updates immediately
- AND percentage increases proportionally (12.5% per image)

**AC3:** User sees current status message
- GIVEN generation is in progress
- WHEN I view Step 3
- THEN I see status like "Generating clean image 2 of 4..."
- AND it updates as generation progresses

**AC4:** User sees time estimate
- GIVEN generation is in progress
- WHEN I view Step 3
- THEN I see estimated time remaining
- AND it updates as images complete

**AC5:** User sees which phase is active
- GIVEN generation is in progress
- WHEN viewing status
- THEN I can tell if it's generating clean or lifestyle images

**AC6:** Progress is accurate
- GIVEN 4/8 images are complete
- WHEN I check progress bar
- THEN it shows 50%
- AND status says "Generating lifestyle image 1 of 4..."

**AC7:** User can cancel generation (optional nice-to-have)
- GIVEN generation is in progress
- WHEN I click "Cancel"
- THEN generation stops
- AND I return to Step 2

### Technical Tasks
- [ ] Create `Step3_GenerateImages.jsx` component
- [ ] Create `ProgressBar` sub-component
- [ ] Implement progress state management
- [ ] Add progress callback in geminiService
- [ ] Calculate and display time estimates
- [ ] Create status message display
- [ ] Style progress UI (modern, animated)
- [ ] (Optional) Implement cancel functionality

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Progress bar updates smoothly
- [ ] Status messages are clear
- [ ] Time estimates are reasonably accurate
- [ ] UI is responsive and doesn't freeze
- [ ] Works across all browsers
- [ ] Code reviewed

---

## US-006: Review Generated Images

### Story
```
As a marketing professional,
I want to review all generated images in a gallery,
So that I can inspect quality before downloading.
```

### Priority: P0 (Must Have)
### Sprint: 3
### Story Points: 3

### Acceptance Criteria

**AC1:** User sees all 8 images in gallery
- GIVEN generation is complete
- WHEN I arrive at Step 4
- THEN I see all 8 images displayed in a grid

**AC2:** Images are organized by type
- GIVEN I am viewing the gallery
- WHEN I look at the layout
- THEN clean images are grouped together
- AND lifestyle images are grouped together
- AND sections are clearly labeled

**AC3:** Each image is clearly visible
- GIVEN I am viewing the gallery
- WHEN I look at thumbnails
- THEN each image is large enough to evaluate
- AND quality is preserved in thumbnails

**AC4:** User can identify each image
- GIVEN I am viewing images
- WHEN I look at each one
- THEN I see a label (e.g., "Clean 1", "Lifestyle 2")

**AC5:** Gallery loads quickly
- GIVEN 8 images are ready
- WHEN Step 4 loads
- THEN all images appear within 2 seconds

**AC6:** Images display in high quality
- GIVEN I am reviewing images
- WHEN I view them
- THEN resolution is high enough to judge quality
- AND no compression artifacts visible

### Technical Tasks
- [ ] Create `Step4_ReviewGallery.jsx` component
- [ ] Create `ImageGallery` sub-component
- [ ] Create `ImageCard` sub-component
- [ ] Implement grid layout (responsive)
- [ ] Add image labeling system
- [ ] Optimize image loading (lazy load if needed)
- [ ] Style gallery UI (modern, clean)
- [ ] Add section headers ("Clean Images", "Lifestyle Images")

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Gallery displays 8 images correctly
- [ ] Images organized by type
- [ ] Labels clear and consistent
- [ ] Loading performance acceptable
- [ ] Responsive layout works
- [ ] Code reviewed

---

## US-007: Select Favorite Images

### Story
```
As a marketing professional,
I want to select which generated images to download,
So that I only get the images I want to use.
```

### Priority: P0 (Must Have)
### Sprint: 3
### Story Points: 2

### Acceptance Criteria

**AC1:** Each image has a checkbox
- GIVEN I am viewing the gallery
- WHEN I look at each image
- THEN I see a checkbox to select it

**AC2:** User can select/deselect images
- GIVEN I am viewing the gallery
- WHEN I click a checkbox
- THEN the image is selected
- AND clicking again deselects it

**AC3:** Selected images are visually distinct
- GIVEN I select an image
- WHEN I view the gallery
- THEN selected images have clear visual indicator (border, highlight, checkmark)

**AC4:** Selection counter is visible
- GIVEN I select images
- WHEN I view the page
- THEN I see "X of 8 images selected"
- AND it updates in real-time

**AC5:** User can select all at once
- GIVEN I am viewing the gallery
- WHEN I click "Select All"
- THEN all 8 images become selected

**AC6:** User can deselect all at once
- GIVEN some images are selected
- WHEN I click "Deselect All"
- THEN all selections are cleared

**AC7:** Download requires at least one selection
- GIVEN I have selected 0 images
- WHEN I click "Download"
- THEN I see error: "Please select at least one image"
- AND download is blocked

**AC8:** Selected images persist
- GIVEN I select 5 images
- WHEN I navigate back then forward
- THEN my 5 selections are still selected

### Technical Tasks
- [ ] Add checkbox UI to ImageCard
- [ ] Implement selection state management
- [ ] Create selection toggle logic
- [ ] Add visual indicators for selected state
- [ ] Create selection counter display
- [ ] Implement "Select All" functionality
- [ ] Implement "Deselect All" functionality
- [ ] Add validation for empty selection

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Checkboxes work reliably
- [ ] Visual feedback is clear
- [ ] Counter updates correctly
- [ ] Select All/Deselect All work
- [ ] Validation prevents empty download
- [ ] State persists correctly
- [ ] Code reviewed

---

## US-008: Download Selected Images as ZIP

### Story
```
As a marketing professional,
I want to download my selected images as a ZIP file,
So that I can easily save and organize them for my e-commerce listing.
```

### Priority: P0 (Must Have)
### Sprint: 3
### Story Points: 3

### Acceptance Criteria

**AC1:** User sees download button
- GIVEN I have selected at least 1 image
- WHEN I view Step 4
- THEN I see a prominent "Download Selected" button

**AC2:** System creates ZIP file
- GIVEN I click "Download Selected"
- WHEN processing begins
- THEN system creates a ZIP containing only selected images

**AC3:** Images are named descriptively
- GIVEN ZIP is created
- WHEN I open it
- THEN images are named clearly (e.g., "table_clean_1.jpg", "table_lifestyle_cafe_1.jpg")

**AC4:** ZIP downloads automatically
- GIVEN ZIP is created
- WHEN creation completes
- THEN browser downloads the file automatically

**AC5:** User sees download confirmation
- GIVEN download completes
- WHEN ZIP is downloaded
- THEN I see success message: "Download complete!"

**AC6:** ZIP file size is reasonable
- GIVEN ZIP contains selected images
- WHEN I check file size
- THEN it's <50MB for 8 images

**AC7:** User can start over
- GIVEN download is complete
- WHEN I click "Start Over"
- THEN I return to Step 0
- AND all state is cleared

**AC8:** User can generate more images
- GIVEN download is complete
- WHEN I click "Generate More"
- THEN I return to Step 0
- AND I can start a new generation

### Technical Tasks
- [ ] Integrate JSZip library
- [ ] Create `zipService.js` for ZIP creation
- [ ] Implement image naming logic
- [ ] Create download trigger mechanism
- [ ] Add download confirmation UI
- [ ] Create "Start Over" functionality
- [ ] Test ZIP creation with various selections
- [ ] Optimize for file size

### Definition of Done
- [ ] All acceptance criteria met
- [ ] ZIP creates successfully
- [ ] Images named correctly
- [ ] Auto-download works
- [ ] Confirmation message shows
- [ ] "Start Over" resets app
- [ ] File size is reasonable
- [ ] Tested on all browsers
- [ ] Code reviewed

---

## US-009: Handle Errors Gracefully

### Story
```
As a marketing professional,
I want clear error messages when something goes wrong,
So that I know what to do to fix the issue.
```

### Priority: P1 (Should Have)
### Sprint: 2
### Story Points: 3

### Acceptance Criteria

**AC1:** Upload errors are clear
- GIVEN I upload an invalid file
- WHEN validation fails
- THEN I see a clear error message
- AND I'm told what to do ("Please upload JPG or PNG")

**AC2:** Generation errors show retry option
- GIVEN image generation fails
- WHEN error occurs
- THEN I see error message
- AND I see "Retry" button

**AC3:** Timeout errors are handled
- GIVEN generation exceeds 5 minutes
- WHEN timeout is detected
- THEN I see message: "Generation took too long. Please retry."
- AND I can click "Retry"

**AC4:** Network errors are detected
- GIVEN my internet disconnects
- WHEN API call fails
- THEN I see: "Network error. Please check your connection."
- AND I can retry when reconnected

**AC5:** API rate limit errors are informative
- GIVEN API rate limit is hit
- WHEN error occurs
- THEN I see: "Too many requests. Please wait a moment and try again."

**AC6:** Errors don't crash the app
- GIVEN any error occurs
- WHEN it's caught
- THEN app continues to function
- AND I can navigate back or retry

**AC7:** Error recovery preserves state
- GIVEN I've completed Steps 0-2
- WHEN an error occurs in Step 3
- THEN I can retry
- AND my previous inputs are preserved

### Technical Tasks
- [ ] Create error handling service
- [ ] Implement error boundary component
- [ ] Add error categorization logic
- [ ] Create error message UI component
- [ ] Implement retry mechanisms
- [ ] Add timeout detection
- [ ] Add network error detection
- [ ] Test various error scenarios

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Common errors handled gracefully
- [ ] Error messages are user-friendly
- [ ] Retry logic works
- [ ] App doesn't crash on errors
- [ ] State preserved during recovery
- [ ] Tested multiple error scenarios
- [ ] Code reviewed

---

## US-010: Clear Cache After Download

### Story
```
As a marketing professional,
I want the app to clear cached data after I download,
So that my browser doesn't fill up with large image files.
```

### Priority: P1 (Should Have)
### Sprint: 3
### Story Points: 2

### Acceptance Criteria

**AC1:** Blob URLs are revoked after download
- GIVEN I download images
- WHEN download completes
- THEN all blob URLs are revoked
- AND memory is freed

**AC2:** Generated images are cleared
- GIVEN I download and click "Start Over"
- WHEN returning to Step 0
- THEN generated images are removed from state

**AC3:** Uploaded images are cleared
- GIVEN I complete a full workflow
- WHEN clicking "Start Over"
- THEN uploaded surface image is cleared

**AC4:** State is reset to initial
- GIVEN I complete a workflow
- WHEN clicking "Start Over"
- THEN all state returns to initial values

**AC5:** No memory leaks
- GIVEN I complete multiple workflows
- WHEN monitoring browser memory
- THEN memory doesn't continuously increase

**AC6:** Cache clearing is automatic
- GIVEN I download images
- WHEN download completes
- THEN cache clears without user action

### Technical Tasks
- [ ] Implement `resetApp()` in state management
- [ ] Add blob URL cleanup in state reset
- [ ] Test memory usage over multiple sessions
- [ ] Add cleanup on component unmount
- [ ] Verify localStorage is cleared (if used)
- [ ] Test for memory leaks

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Blob URLs properly revoked
- [ ] State resets completely
- [ ] No memory leaks detected
- [ ] Tested over 10+ sessions
- [ ] Code reviewed

---

## US-011: Zoom Images for Inspection (P2 - Nice to Have)

### Story
```
As a marketing professional,
I want to zoom in on images,
So that I can inspect quality and details before selecting.
```

### Priority: P2 (Nice to Have)
### Sprint: 4
### Story Points: 2

### Acceptance Criteria

**AC1:** User can click image to zoom
- GIVEN I am viewing gallery
- WHEN I click an image
- THEN it opens in fullscreen/modal view

**AC2:** Zoomed view shows full resolution
- GIVEN I zoom an image
- WHEN viewing it
- THEN I see full resolution with no quality loss

**AC3:** User can navigate between images
- GIVEN I am in zoom view
- WHEN I use arrow keys or buttons
- THEN I can view next/previous images

**AC4:** User can close zoom view
- GIVEN I am in zoom view
- WHEN I press ESC or click "Close"
- THEN I return to gallery view

### Technical Tasks
- [ ] Create `ImageModal` component
- [ ] Add click handler to ImageCard
- [ ] Implement keyboard navigation
- [ ] Style fullscreen view
- [ ] Add close functionality

---

## US-012: Filter Images by Type (P2 - Nice to Have)

### Story
```
As a marketing professional,
I want to filter images by type (clean vs lifestyle),
So that I can focus on one category at a time.
```

### Priority: P2 (Nice to Have)
### Sprint: 4
### Story Points: 1

### Acceptance Criteria

**AC1:** User sees filter buttons
- GIVEN I am viewing gallery
- WHEN I look at controls
- THEN I see: "All", "Clean Only", "Lifestyle Only"

**AC2:** Filters work correctly
- GIVEN I click "Clean Only"
- WHEN filter applies
- THEN only 4 clean images are shown

**AC3:** Selection persists across filters
- GIVEN I select 2 clean and 2 lifestyle images
- WHEN I filter to "Clean Only"
- THEN my 2 clean selections are still selected

### Technical Tasks
- [ ] Create filter buttons UI
- [ ] Implement filter logic
- [ ] Preserve selection state during filtering
- [ ] Style active filter state

---

## Summary

### Total Story Points: 36
- **Sprint 1:** 8 points (US-001, US-002, US-003)
- **Sprint 2:** 14 points (US-004, US-005, US-009)
- **Sprint 3:** 10 points (US-006, US-007, US-008, US-010)
- **Sprint 4:** 4 points (US-011, US-012) - Nice to Have

### Priority Breakdown
- **P0 (Must Have):** 10 stories
- **P1 (Should Have):** 2 stories
- **P2 (Nice to Have):** 2 stories

---

**Next Document:** [SPRINT_PLAN.md](./SPRINT_PLAN.md)
