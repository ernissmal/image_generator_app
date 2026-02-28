/**
 * PRODUCTION PROMPT TEMPLATES
 *
 * This file contains all prompts used for image generation via Gemini API.
 * Format: Plain text strings (what the API expects)
 *
 * IMPORTANT: These prompts are based on 2025 best practices for Gemini 2.5 Flash Image.
 * - Use narrative descriptions (NOT bullet lists)
 * - Include technical specifications
 * - Specify dimensional accuracy
 * - Define material physics
 *
 * Last Updated: 2025-11-17
 * Version: 2.0.0 (Corrected prompts)
 */

export const PROMPTS = {

  /**
   * TURN 1: Surface Reference
   * Establishes the tabletop surface context for the conversation
   */
  surfaceReference: `This is the tabletop surface I want to use in future image modifications. Please remember this surface for the next prompts.`,

  /**
   * TURN 2: Clean Product Photography
   * Transforms 3D model into photorealistic product shot
   *
   * Variables: {variationNumber}, {legStyle}, {backgroundStyle}, {modelDimensions}
   */
  cleanPhotography: {
    base: `Transform the 3D table model into a photorealistic product photograph (variation {variationNumber}).

CRITICAL - Surface Mapping:
Replace ONLY the red tabletop surface with the wood texture I provided earlier.
- Preserve the exact rectangular dimensions of the original 3D model
- Map the wood grain to flow naturally along the table's length (longitudinal direction)
- If the reference has a live edge, apply it to the long sides while maintaining the table width exactly
- Keep the surface thickness precisely as shown in the 3D model
- Wood grain should show visible depth and relief under the lighting (0.5-1mm depth perception)
- Include 2-3 subtle natural imperfections (small knots, slight color variation) for authenticity

Leg Treatment:
Replace the green legs with photorealistic {legStyle} steel legs.
- Maintain the exact X-cross geometry shown in the 3D model
- Apply black powder coat finish with subtle satin sheen (10-15% specular reflection, not completely matte)
- Fine orange-peel texture visible on close inspection (80-100 micron coating thickness)
- Preserve leg angles, positions, and mounting points exactly as in the 3D model
- TIG welded joints should be smooth and nearly invisible
- Steel frame edges should have slight highlights to show dimensionality

Background & Lighting:
- Background: {backgroundStyle}, creating professional depth without distraction
- Lighting: Three-point softbox lighting system with 5500K color temperature bulbs
- Key light positioned 45° from camera axis, 30° elevation
- Fill light opposite side at 40-50% key light power
- Soft shadows beneath table (20-30% opacity) with 25mm gradient falloff
- Even illumination revealing wood grain texture depth and powder coat surface characteristics

Camera Position:
- Viewing angle: Three-quarter view showing both table length and width clearly
- Camera distance: 2-3× the table's longest dimension for natural perspective
- Lens equivalent: 50-70mm (minimal perspective distortion)
- Frame composition: Table fills 60-70% of frame with 15% breathing room
- Sharp focus across entire table from front to back

Quality Requirements:
- Photorealistic material rendering showing wood subsurface scattering (2mm light penetration)
- Powder coat showing realistic metal texture with appropriate Fresnel reflection
- High resolution, artifact-free, commercial-grade quality
- E-commerce ready, suitable for Shopify, WooCommerce, Amazon product listings
- Color accuracy: Neutral white balance, true-to-life material colors

Variation {variationNumber} Specifications:
Slightly vary the camera angle by 5-10° and adjust lighting direction to provide distinct options while maintaining professional quality and consistency.{modelDimensions}`,

    // Variation-specific camera angles
    variations: {
      1: {
        camera: "Three-quarter view from front-left, 10° elevation",
        lighting: "Key light from camera-left 45°"
      },
      2: {
        camera: "Three-quarter view from front-right, 10° elevation",
        lighting: "Key light from camera-right 45°"
      },
      3: {
        camera: "Direct front view, 5° elevation, slightly wider framing",
        lighting: "Even front lighting, minimal directional shadows"
      },
      4: {
        camera: "Three-quarter view from front-left, 15° elevation (more elevated than variation 1)",
        lighting: "Slightly elevated key light from camera-left creating more depth"
      }
    }
  },

  /**
   * TURN 3+: Lifestyle Photography
   * Places clean product photo into authentic lifestyle scenes
   *
   * Variables: {category}, {variationNumber}
   */
  lifestylePhotography: {

    cafe: `Transform this product photograph into an authentic café lifestyle scene (variation {variationNumber}).

CRITICAL - Product Integrity:
The table remains the HERO of the image. It must:
- Maintain its exact photorealistic appearance from the clean product shot
- Stay in sharp focus while background softens to 60-70% blur
- Occupy 40-50% of the frame (prominent but not overwhelming)
- Be clearly visible and identifiable as the primary subject

Scene Context - Modern Independent Café:
Setting: Corner table positioned near large windows with natural light streaming in
Time of Day: Mid-morning (10-11am feel) with warm, inviting atmosphere
Architecture: Industrial-chic aesthetic with exposed brick walls, high ceilings
Interior Style: Mix of modern and vintage elements, curated but unpretentious

Styling Philosophy - "Organized Authenticity":
Create a LIVED-IN feeling, not staged perfection. This café is real, welcoming, and where creative professionals actually work.

Props on Table (3-5 items maximum, occupying only 25% of table surface):
- Ceramic coffee cup with latte art (half-full), approximately 80mm diameter
- Croissant or pastry on small white plate, slightly eaten (shows use)
- Folded newspaper or quality magazine (Monocle, Kinfolk style)
- Smartphone placed face-down, 300-350mm modern design
- Reading glasses casually placed, not perfectly aligned

Prop Placement Rules:
- Arrange following rule of thirds (asymmetric, natural clustering)
- Keep 8-12 inches clear from all table edges
- Never obscure table corners or distinctive wood grain features
- Props should be IN USE not brand new (coffee drunk, croissant bitten, paper read)
- Size accuracy critical: Coffee cup 80mm diameter, plate 180-200mm

Lighting & Atmosphere:
- Natural window light from camera left, 45° angle (simulated morning sun)
- Color temperature: 4800-5200K (warm morning glow)
- Soft shadows creating depth but not drama (30-40% opacity, soft edges)
- Fill light from opposite side ratio 1:2 to soften shadows
- Warm glow on table surface, slightly cooler tones in background
- Sunlight streaming creates gentle highlights on wood grain

Environmental Details:
- Background: Blurred café interior showing exposed brick wall, industrial pendant lights
- Depth of field: Table sharp (simulated f/5.6), background blurred (f/2.8 effect)
- Hint of other café elements: espresso machine in soft focus, shelves with cups
- Possible: Very blurred silhouette of 1 person in deep background (70-80% blur, unidentifiable)
- Color harmony: Warm browns, cream whites, soft grays, brass accents
- Space feels airy, well-lit, not crowded

Realism Factors:
- Table surface shows very subtle use marks (nothing dramatic, just authentic)
- Lighting naturally shows time of day (morning = warmer, softer)
- Objects within natural arm's reach (comfortable human-scale spacing)
- No perfect symmetry - slight natural disorder acceptable
- Scene tells story: "Creative professional taking morning coffee break"

E-Commerce Optimization:
- Table clearly showcases size, wood grain, leg design, and overall construction
- Customer can imagine this table in their own café or home workspace
- Professional quality suitable for product listings, Instagram, Pinterest, marketing materials
- Aspirational yet attainable - "I could have this in my life"
- Builds trust through authentic, realistic presentation

Variation {variationNumber}:
Vary prop arrangement by 5-10° rotation and adjust camera angle slightly while maintaining the same café scene category, quality standards, and product focus.`,

    office: `Transform this product photograph into an authentic home office lifestyle scene (variation {variationNumber}).

CRITICAL - Product Integrity:
The table remains the HERO of the image. It must:
- Maintain its exact photorealistic appearance from the clean product shot
- Stay in sharp focus while background softens to 60-70% blur
- Occupy 40-50% of the frame (prominent focal point)
- Be clearly visible and identifiable as the primary subject

Scene Context - Contemporary Home Office:
Setting: Desk positioned near window with natural daylight and city or nature view (blurred)
Time of Day: Afternoon (2-4pm productive hours) with bright, focused atmosphere
Architecture: Modern residential space, minimalist aesthetic
Interior Style: Professional yet comfortable, Scandinavian or modern minimalist influence

Styling Philosophy - "Organized Authenticity":
Create focused productivity space that's well-maintained but actively used. Professional without being sterile.

Props on Table (3-5 items maximum, occupying only 20-30% of table surface):
- Open leather-bound notebook or quality planner with handwritten notes (visible writing)
- Quality fountain pen or premium mechanical pencil resting on notebook
- Ceramic coffee mug in muted tone (white, gray, or cream), 85mm diameter
- Small succulent plant in modern ceramic pot (8-10cm pot)
- Optional: Wireless keyboard pushed to side (Apple/Logitech style, 350mm wide)

Prop Placement Rules:
- Asymmetric arrangement following rule of thirds
- Notebook positioned for comfortable writing (not perfectly centered)
- Keep 8-12 inches from table edges
- Props clustered in natural work zone (dominant hand side)
- Never obscure table's distinctive features (live edge, wood grain)

Lighting & Atmosphere:
- Natural window light from side, creating directional afternoon illumination
- Color temperature: 5500-6000K (neutral daylight, focused clarity)
- Soft shadows showing depth (25-35% opacity)
- Clean, bright atmosphere promoting productivity
- Highlight on wood surface showing grain depth and texture
- Background slightly cooler than foreground (depth separation)

Environmental Details:
- Background: Minimalist office environment, bookshelf or window in soft focus
- Depth of field: Table sharp, background blurred (simulated f/5.6 to f/2.8)
- Modern office chair partially visible (blurred, contemporary design)
- Window showing blurred cityscape or nature view (creates context)
- Possible: Small framed artwork or plant on shelf in background (very blurred)
- Color palette: Neutrals (grays, whites, blacks) with warm wood tones

Realism Factors:
- Notebook shows actual use (pages slightly wrinkled, writing visible but not readable)
- Coffee mug appears half-full or recently used
- Space organized but not showroom perfect
- Natural light creates time-of-day authenticity
- Everything within ergonomic reach for actual work session
- Scene tells story: "Focused professional during productive afternoon"

E-Commerce Optimization:
- Table clearly shows size appropriate for desk/office use
- Material quality visible (wood grain, finish, leg construction)
- Customer can imagine working at this table
- Professional quality for product pages, LinkedIn posts, office furniture sites
- Aspirational productivity aesthetic that's achievable
- Demonstrates versatility: dining table doubles as workspace

Variation {variationNumber}:
Vary prop positioning by 5-10° and adjust window light direction slightly while maintaining office scene category and professional quality.`,

    dining: `Transform this product photograph into an authentic dining room lifestyle scene (variation {variationNumber}).

CRITICAL - Product Integrity:
The table remains the HERO of the image. It must:
- Maintain its exact photorealistic appearance from the clean product shot
- Stay in sharp focus while background softens to 60-70% blur
- Occupy 40-50% of the frame (central dining focal point)
- Be clearly visible and identifiable as the primary subject

Scene Context - Elegant Residential Dining Room:
Setting: Dining area with natural light from windows or warm pendant lighting overhead
Time of Day: Early evening (6-7pm, pre-dinner preparation) with warm, inviting atmosphere
Architecture: Residential dining room, refined yet livable
Interior Style: Sophisticated entertaining, European-inspired, understated luxury

Styling Philosophy - "Organized Authenticity":
Create elegant but lived-in dining space. Sophisticated without being overly formal. Ready for dinner but not a special occasion.

Props on Table (4-6 items maximum, occupying only 25-30% of table surface):
- Simple place setting: 1-2 dinner plates (270mm diameter, white or cream ceramic)
- Linen or cotton napkin (natural beige, cream, or soft gray) casually placed
- Wine glass with white wine (partially full), standard 220mm height
- Small vase with fresh flowers (simple arrangement: 3-5 stems, white or soft colors)
- Artisan bread on wooden board or small ceramic butter dish
- Optional: Simple candlestick with unlit candle (elegant but understated)

Prop Placement Rules:
- Asymmetric arrangement (not formal place setting symmetry)
- Plates positioned as if setting table, not perfectly aligned
- Keep 10-12 inches from table edges (dining comfort zone)
- Flowers positioned off-center, natural height (20-30cm)
- Never obscure table's live edge or distinctive grain patterns
- Props suggest preparation, not complete formal dinner

Lighting & Atmosphere:
- Warm ambient lighting (pendant above or window light from side)
- Color temperature: 3800-4500K (warm evening glow, inviting)
- Soft shadows creating intimate depth (20-30% opacity)
- Gentle highlight on wine glass showing transparency and refraction
- Wood grain illuminated to show warmth and natural beauty
- Background slightly dimmer than table (focuses attention)

Environmental Details:
- Background: Dining room with elegant chairs partially visible (blurred, modern or classic design)
- Depth of field: Table sharp, background furniture and walls softly blurred
- Possible elements in soft focus: sideboard, window with curtains, framed artwork
- Pendant light above table visible but blurred (creates atmosphere)
- Color palette: Warm neutrals, cream linens, natural wood, soft metallics (gold or brass accents)
- Space feels elegant but not stuffy - lived-in luxury

Realism Factors:
- Napkin casually draped, not perfectly folded
- Wine glass shows realistic refraction and transparency
- Flowers natural and fresh, not overly arranged
- Bread appears artisan (crusty, rustic) not factory perfect
- Setting suggests anticipation of dinner, not mid-meal
- Scene tells story: "Preparing for elegant but relaxed dinner with friends"

E-Commerce Optimization:
- Table clearly shows dining functionality and appropriate scale
- Wood grain, finish quality, and craftsmanship visible
- Customer imagines hosting dinner parties at this table
- Professional quality for furniture showrooms, dining table catalogs, home magazines
- Aspirational entertaining lifestyle that's achievable
- Demonstrates elegance without intimidation

Variation {variationNumber}:
Vary place setting arrangement by 5-10° and adjust lighting warmth slightly while maintaining dining scene elegance and quality.`,

    living: `Transform this product photograph into an authentic living room lifestyle scene (variation {variationNumber}).

CRITICAL - Product Integrity:
The table remains the HERO of the image. It must:
- Maintain its exact photorealistic appearance from the clean product shot
- Stay in sharp focus while background softens to 60-70% blur
- Occupy 40-50% of the frame (central living space focal point)
- Be clearly visible and identifiable as the primary subject

Scene Context - Design-Conscious Living Room:
Setting: Living area used as multi-functional space (coffee, reading, relaxing)
Time of Day: Weekend morning (9-10am leisurely feel) with soft natural light
Architecture: Contemporary residential, open-plan living space
Interior Style: Scandinavian-inspired, cozy minimalism, hygge atmosphere

Styling Philosophy - "Organized Authenticity":
Create cozy, livable luxury. Well-curated but not showroom perfect. This is where people actually live and relax.

Props on Table (3-5 items maximum, occupying only 20-25% of table surface):
- Stack of 2-3 design or lifestyle magazines (Kinfolk, Cereal, Monocle style)
- Ceramic mug with tea or coffee (85mm diameter, Nordic-style simple ceramic)
- Small wooden or ceramic bowl with fruit or nuts (15-20cm diameter)
- Reading glasses casually placed on magazine
- Optional: Throw blanket edge draped over nearby chair (partially visible, textured knit or linen)

Prop Placement Rules:
- Casual, organic arrangement (not styled symmetry)
- Magazines stacked but slightly askew (lived-in feel)
- Keep 8-12 inches from table edges
- Props positioned as if someone just stepped away momentarily
- Never obscure table corners or live edge details
- Natural clustering following human behavior (items within reach)

Lighting & Atmosphere:
- Abundant natural window light creating airy, bright space
- Color temperature: 5000-5500K (morning daylight, fresh and energizing)
- Soft, wraparound lighting (minimal hard shadows, 15-25% opacity)
- Gentle highlights on wood grain showing natural warmth
- Light, airy feeling (Scandinavian brightness)
- Background slightly cooler than warm wood tones of table

Environmental Details:
- Background: Living room with sofa or seating in soft focus (light gray, cream, or natural textiles)
- Depth of field: Table sharp, background furniture heavily blurred
- Window visible in background (soft focus) with sheer curtains, natural light streaming
- Possible elements: Houseplants (monstera, fiddle leaf fig), minimal artwork on wall
- Modern or mid-century furniture pieces partially visible (blurred)
- Color palette: Soft whites, warm grays, natural textures, minimal bold colors
- Space feels calm, uncluttered, breathing room

Realism Factors:
- Magazines show slight wear (corners not pristine, pages fanned slightly)
- Mug appears recently used (trace of foam or tea stain visible)
- Bowl with fruit/nuts positioned casually, not arranged
- Throw blanket draped naturally, showing texture (chunky knit or linen weave)
- Lighting suggests quiet morning leisure time
- Scene tells story: "Cozy weekend morning with coffee and magazines"

E-Commerce Optimization:
- Table demonstrates multi-functional use (coffee table, side table, accent piece)
- Size and scale clear in residential living context
- Material warmth and quality visible
- Customer imagines this table in their own living space
- Professional quality for furniture catalogs, lifestyle magazines, Pinterest, Instagram
- Aspirational hygge lifestyle that's accessible
- Shows table integrates with modern, minimalist interiors

Variation {variationNumber}:
Vary prop arrangement by 5-10° rotation and adjust natural light angle slightly while maintaining living room ambiance and cozy aesthetic.`
  },

  /**
   * DEFAULT STYLING OPTIONS
   * Can be overridden in UI or API calls
   */
  defaults: {
    legStyle: "black powder-coated X-cross style",
    legStyleDetails: "X-cross style black powder-coated steel legs with subtle satin sheen (10-15% specular reflection)",
    backgroundStyle: "smooth linear gradient transitioning from dark gray (#2a2a2a) at top to light gray (#e0e0e0) at bottom"
  }
};

/**
 * Helper function: Build clean product photography prompt with variable substitution
 * @param {Object} options - Prompt options
 * @param {number} options.variationNumber - Variation number (1-4)
 * @param {string} options.legStyle - Leg style description
 * @param {string} options.backgroundStyle - Background description
 * @param {string} options.modelSize - Model size code (e.g., '150x80') for dimension validation
 * @returns {string} Complete prompt ready for API
 */
export function buildCleanPrompt({ variationNumber, legStyle, backgroundStyle, modelSize }) {
  let prompt = PROMPTS.cleanPhotography.base
    .replace('{variationNumber}', variationNumber)
    .replace('{legStyle}', legStyle || PROMPTS.defaults.legStyle)
    .replace('{backgroundStyle}', backgroundStyle || PROMPTS.defaults.backgroundStyle);

  // Add dimensional validation if model size provided
  if (modelSize) {
    const dimensionAddendum = getDimensionValidation(modelSize);
    prompt = prompt.replace('{modelDimensions}', dimensionAddendum);
  } else {
    prompt = prompt.replace('{modelDimensions}', '');
  }

  return prompt;
}

/**
 * Helper function: Build lifestyle photography prompt with variable substitution
 * @param {Object} options - Prompt options
 * @param {string} options.category - Category (cafe, office, dining, living)
 * @param {number} options.variationNumber - Variation number (1-4)
 * @returns {string} Complete prompt ready for API
 */
export function buildLifestylePrompt({ category, variationNumber }) {
  const categoryPrompt = PROMPTS.lifestylePhotography[category]
    || PROMPTS.lifestylePhotography.cafe;

  return categoryPrompt.replace(/{variationNumber}/g, variationNumber);
}

/**
 * Helper function: Get dimension validation text for model size
 * @param {string} modelSize - Model size code (e.g., '150x80', '200x80')
 * @returns {string} Dimension validation addendum
 */
function getDimensionValidation(modelSize) {
  const dimensionSpecs = {
    '150x80': {
      length: 1500,
      width: 800,
      thickness: 40,
      ratio: 1.875,
      thicknessPercent: 5.0
    },
    '200x80': {
      length: 2000,
      width: 800,
      thickness: 40,
      ratio: 2.5,
      thicknessPercent: 5.0
    },
    '240x110': {
      length: 2400,
      width: 1100,
      thickness: 50,
      ratio: 2.18,
      thicknessPercent: 4.5
    },
    '600': { // Pillow
      length: 600,
      width: 600,
      thickness: 40,
      ratio: 1.0,
      thicknessPercent: 6.7
    },
    '800': { // Pillow
      length: 800,
      width: 800,
      thickness: 40,
      ratio: 1.0,
      thicknessPercent: 5.0
    }
  };

  const specs = dimensionSpecs[modelSize];
  if (!specs) return '';

  return `

DIMENSIONAL ACCURACY REQUIREMENT (CRITICAL):
This table is ${specs.length}mm long × ${specs.width}mm wide × ${specs.thickness}mm thick.
- The generated image MUST show a length-to-width ratio of ${specs.ratio}:1
- Visual validation: Table should appear ${specs.ratio.toFixed(2)}× ${specs.ratio >= 1 ? 'longer than wide' : 'wider than long'}
- Thickness should appear as ${specs.thicknessPercent.toFixed(1)}% of the table width (${specs.thickness}mm ÷ ${specs.width}mm)
- Leg proportions must match the 3D model exactly
- Acceptable dimensional variance: ±3% maximum`;
}
