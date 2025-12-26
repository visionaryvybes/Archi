
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {
  GoogleGenAI,
  Video,
  VideoGenerationReferenceImage,
  VideoGenerationReferenceType,
} from '@google/genai';
import {
  GenerateVideoParams, 
  GenerationMode, 
  VeoModel, 
  Resolution, 
  AspectRatio, 
  ImageGenerationParams, 
  ImageModel,
  ImagePreset,
  DesignStyle,
  RoomType
} from '../types';

/**
 * Enhances an architectural prompt using Gemini 3 Flash.
 */
export const enhancePrompt = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Enhance this architectural visualization prompt for better AI image/video generation. Make it more descriptive, professional, and cinematic. Prompt: "${prompt}"`,
    config: {
      systemInstruction: "You are an AI prompt engineer specializing in high-end architecture and cinematic visualization. Return ONLY the enhanced prompt text without any preamble or quotes.",
    }
  });
  return response.text || prompt;
};

/**
 * Generates an image using Nano Banana Pro (Gemini 3 Pro Image)
 * Aggressively tuned for "Lived-in" high-fidelity Architecture.
 */
export const generateImage = async (params: ImageGenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  
  let modifier = "";
  const styleStr = params.style || "Modern Minimalist";
  const roomStr = params.roomType || "Living Space";

  // Specific detail injectors to prevent "empty room" syndrome
  const lifeProps = {
    [RoomType.KITCHEN]: "high-end marble countertops, steaming espresso machine, professional chef's knives on magnetic strip, copper cookware, organic textures like wooden cutting boards, integrated ambient LED strips under cabinets, fresh herbs in ceramic pots.",
    [RoomType.LIVING_ROOM]: "soft textured throw pillows, open designer coffee table books, a high-fidelity record player, warm morning sunlight through floor-to-ceiling windows, lush indoor plants like fiddle leaf figs, soft woven area rug.",
    [RoomType.BEDROOM]: "rumpled high-thread-count linen sheets, a stack of hardcover design magazines, ambient warm nightstand lighting, soft wool textures, high-end drapes with realistic folds.",
    [RoomType.BATHROOM]: "steam on glass partition, plush rolled cotton towels, luxury soap dispensers, natural stone textures, subtle water droplets in the sink, rain shower head.",
    [RoomType.OFFICE]: "modern desk lamp, high-resolution monitors, designer ergonomic chair, personal artifacts like a fountain pen and notebook, clean cable management, focused task lighting.",
    [RoomType.THEATER]: "plush deep-seated velvet chairs, subtle floor-level track lighting, high-end speaker mesh, dark walnut wall panels, professional acoustic treatments.",
    [RoomType.GYM]: "technogym-style equipment, textured rubber flooring, wall-sized mirrors with crisp reflections, hydration station with luxury water bottles."
  };

  const selectedProps = lifeProps[params.roomType as RoomType] || "lived-in details, designer furniture, high-end material finishes, realistic shadows.";

  switch (params.preset) {
    case ImagePreset.EXTERIOR:
      modifier = `PHOTOREALISTIC EXTERIOR ARCHITECTURE. Style: ${styleStr}. Sunset golden hour lighting. Detailed landscaping with specific plants, gravel paths, architectural lighting. Sharp focus on textures like wood, concrete, and glass.`;
      break;
    case ImagePreset.INTERIOR:
      modifier = `HIGH-END ${roomStr.toUpperCase()} INTERIOR DESIGN. Style: ${styleStr}. 
      CRITICAL INSTRUCTIONS: Architectural Digest quality. INCLUDE: ${selectedProps} 
      LIGHTING: Natural volumetric sunlight, soft global illumination. 
      TEXTURES: Ultra-detailed fabric weaves, polished stone, wood grain. No empty spaces; inhabited and expensive feel.`;
      break;
    case ImagePreset.FLOOR_PLAN:
      modifier = `3D ISOMETRIC FLOOR PLAN. Clean architectural layout of a ${roomStr} in ${styleStr} aesthetic. Realistic furniture models, material callouts, soft shadows.`;
      break;
    case ImagePreset.BLUEPRINT:
      modifier = `TECHNICAL ARCHITECTURAL BLUEPRINT. CAD-style technical drafting on charcoal background. White and cyan vector lines, structural measurements, professional engineering aesthetic.`;
      break;
    case ImagePreset.LANDSCAPE:
      modifier = `LANDSCAPE ARCHITECTURE. ${styleStr} garden design. Detailed flora, stone masonry, water features with reflections.`;
      break;
    default:
      modifier = `High-end architectural render of a ${roomStr} in ${styleStr} style. Photorealistic, 8k, detailed textures.`;
  }

  const contents: any = {
    parts: [{ text: `TASK: ${modifier}\nUSER BRIEF: ${params.prompt}` }]
  };

  if (params.sourceImage?.base64) {
    contents.parts.unshift({
      inlineData: {
        data: params.sourceImage.base64,
        mimeType: 'image/png'
      }
    });
  }

  const response = await ai.models.generateContent({
    model: ImageModel.PRO,
    contents,
    config: {
      imageConfig: {
        aspectRatio: params.aspectRatio,
        imageSize: params.size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Render engine timed out.");
};

export const generateVideo = async (params: GenerateVideoParams): Promise<{objectUrl: string; blob: Blob; uri: string; video: Video}> => {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const isExtension = params.mode === GenerationMode.EXTEND_VIDEO;
  
  const payload: any = {
    model: isExtension ? VeoModel.VEO : params.model,
    config: {
      numberOfVideos: 1,
      resolution: isExtension ? Resolution.P720 : params.resolution,
      aspectRatio: params.aspectRatio,
    },
  };

  if (params.prompt.trim()) payload.prompt = params.prompt.trim();

  if (isExtension && params.previousVideo) {
    payload.video = params.previousVideo;
  } else {
    if (params.startFrame?.base64) {
      payload.image = { imageBytes: params.startFrame.base64, mimeType: 'image/png' };
    }
    if (params.styleImage?.base64) {
      payload.config.referenceImages = [{
        image: { imageBytes: params.styleImage.base64, mimeType: 'image/png' },
        referenceType: VideoGenerationReferenceType.STYLE,
      }];
    }
  }

  let operation = await ai.models.generateVideos(payload);
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  if (operation?.response) {
    const video = operation.response.generatedVideos?.[0]?.video;
    if (!video?.uri) throw new Error('Video data unavailable.');
    const res = await fetch(`${video.uri}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return {objectUrl: URL.createObjectURL(blob), blob, uri: video.uri, video};
  } else {
    throw new Error('Video synthesis failed.');
  }
};
