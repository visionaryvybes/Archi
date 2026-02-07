const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Load API key from environment variable - NEVER hardcode API keys!
const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY environment variable is not set.");
  console.error("Set it with: export GEMINI_API_KEY=your_key_here");
  process.exit(1);
}
const OUTPUT_DIR = path.join(__dirname, "public/images");

const genAI = new GoogleGenAI({ apiKey: API_KEY });

const imagePrompts = [
  {
    filename: "hero-before.jpg",
    prompt: "Empty modern living room with white walls, wooden floors, large windows, no furniture, natural daylight, architectural photography"
  },
  {
    filename: "hero-after.jpg",
    prompt: "Luxurious modern living room with emerald green velvet sofa, marble coffee table, indoor plants, art on walls, warm lighting, interior design magazine quality"
  },
  {
    filename: "demo-before.jpg",
    prompt: "Empty bedroom with beige walls, hardwood floor, window with white curtains, no furniture"
  },
  {
    filename: "demo-after.jpg",
    prompt: "Scandinavian bedroom with platform bed, white linens, minimalist furniture, pendant lights, cozy textiles"
  }
];

async function generateImage(prompt, filename) {
  console.log(`Generating: ${filename}...`);
  console.log(`Prompt: ${prompt}`);

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: `Generate a high-quality interior design photograph: ${prompt}` }]
        }
      ],
      config: {
        responseModalities: ["image", "text"]
      }
    });

    // Check if we have candidates and parts
    if (response.candidates && response.candidates[0] && response.candidates[0].content) {
      const parts = response.candidates[0].content.parts;

      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const imageData = part.inlineData.data;
          const outputPath = path.join(OUTPUT_DIR, filename);

          // Decode base64 and save
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync(outputPath, buffer);

          console.log(`Saved: ${outputPath}`);
          return true;
        }
      }
    }

    console.log(`No image data found in response for ${filename}`);
    console.log("Response:", JSON.stringify(response, null, 2));
    return false;
  } catch (error) {
    console.error(`Error generating ${filename}:`, error.message);
    if (error.response) {
      console.error("Response error:", error.response);
    }
    return false;
  }
}

async function main() {
  console.log("Starting image generation...\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const { prompt, filename } of imagePrompts) {
    await generateImage(prompt, filename);
    console.log("");
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("Image generation complete!");
}

main();
