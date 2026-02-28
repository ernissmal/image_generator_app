import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate 8 images using Gemini's conversational image generation
 * Mirrors the manual 3-turn conversation workflow
 */
export async function generateTableImages({
  tableSurfaceFile,
  model3DFile,
  category,
  legStyle = "black powder-coated matte",
  backgroundStyle = "linear gradient with two different tones of grey",
  onProgress
}) {

  // Use Gemini 2.5 Flash Image model (latest stable version)
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
      maxOutputTokens: 8192,
    }
  });

  try {
    // Convert files to base64
    const tableSurfaceB64 = await fileToBase64(tableSurfaceFile);
    const model3DB64 = await fileToBase64(model3DFile);

    // Start a new chat session
    const chat = model.startChat({
      history: [],
    });

    onProgress?.(0, 8, "Establishing table surface reference...");

    // ========================================
    // TURN 1: Establish table surface reference
    // ========================================
    await chat.sendMessage([
      {
        text: "This is the tabletop surface I want to use in future image modifications. Please remember this surface for the next prompts."
      },
      {
        inlineData: {
          mimeType: tableSurfaceFile.type,
          data: tableSurfaceB64
        }
      }
    ]);

    // ========================================
    // TURN 2: Generate 4 CLEAN product images
    // ========================================
    const cleanImages = [];

    for (let i = 0; i < 4; i++) {
      onProgress?.(i, 8, `Generating clean product image ${i + 1}/4...`);

      const cleanPrompt = buildCleanPrompt({
        variationNumber: i + 1,
        legStyle,
        backgroundStyle
      });

      const response = await chat.sendMessage([
        {
          text: cleanPrompt
        },
        {
          inlineData: {
            mimeType: model3DFile.type,
            data: model3DB64
          }
        }
      ]);

      const imageData = extractImageFromResponse(response);
      if (imageData) {
        cleanImages.push({
          id: `clean_${i + 1}`,
          type: 'clean',
          blob: base64ToBlob(imageData, 'image/jpeg'),
          url: null // Will be set later with createObjectURL
        });
      }
    }

    // ========================================
    // TURN 3+: Generate 4 LIFESTYLE images
    // ========================================
    const lifestyleImages = [];

    for (let i = 0; i < 4; i++) {
      onProgress?.(i + 4, 8, `Generating lifestyle image ${i + 1}/4...`);

      const lifestylePrompt = buildLifestylePrompt({
        category,
        variationNumber: i + 1
      });

      const response = await chat.sendMessage([
        {
          text: lifestylePrompt
        }
      ]);

      const imageData = extractImageFromResponse(response);
      if (imageData) {
        lifestyleImages.push({
          id: `lifestyle_${i + 1}`,
          type: 'lifestyle',
          blob: base64ToBlob(imageData, 'image/jpeg'),
          url: null // Will be set later
        });
      }
    }

    onProgress?.(8, 8, "Generation complete!");

    return {
      clean: cleanImages,
      lifestyle: lifestyleImages
    };

  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
}

/**
 * Build clean product photography prompt
 */
function buildCleanPrompt({ variationNumber, legStyle, backgroundStyle }) {
  return `Generate professional product photography (variation ${variationNumber}).

Replace this table category's tabletop with the referenced surface I provided earlier.
Use ${legStyle} legs.
Background should be ${backgroundStyle}.

Create high-quality, artifact-free, commercial-grade product photography.
Slightly vary the angle and lighting for this variation to provide options.`;
}

/**
 * Build lifestyle photography prompt
 */
function buildLifestylePrompt({ category, variationNumber }) {
  const categoryDescriptions = {
    cafe: "a cozy café with warm lighting, coffee cups nearby, inviting atmosphere",
    office: "a modern office setting with professional ambiance, clean desk, natural light",
    dining: "an elegant dining room with place settings, warm candlelight, refined atmosphere",
    living: "a comfortable living room with natural light, relaxed home environment"
  };

  const description = categoryDescriptions[category] || categoryDescriptions.cafe;

  return `Place this table in ${description}.

Variation ${variationNumber}: Create an authentic, relatable, and realistic lifestyle image.
The table should fit naturally into the scene with appropriate context and styling.
Use professional photography techniques with proper composition and lighting.`;
}

/**
 * Extract image data from Gemini response
 */
function extractImageFromResponse(response) {
  try {
    // Gemini returns images as parts in the response
    const imagePart = response.response.candidates[0]?.content?.parts?.find(
      part => part.inlineData?.mimeType?.startsWith('image/')
    );

    if (imagePart?.inlineData?.data) {
      return imagePart.inlineData.data; // Base64 string
    }

    return null;
  } catch (error) {
    console.error("Error extracting image:", error);
    return null;
  }
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 to Blob
 */
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
