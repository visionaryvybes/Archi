
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export enum WorkspaceMode {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE'
}

export enum ImagePreset {
  EXTERIOR = 'Exterior/Architectural',
  INTERIOR = 'Interior Design',
  FLOOR_PLAN = '2D/3D Floor Plan',
  BLUEPRINT = 'Technical Blueprint',
  LANDSCAPE = 'Landscape/Garden',
  MATERIAL = 'Material Study',
  VARIATION = 'Re-render Source'
}

export enum RoomType {
  LIVING_ROOM = 'Living Room',
  KITCHEN = 'Kitchen / Culinary',
  BEDROOM = 'Master Suite',
  BATHROOM = 'Spa / Bathroom',
  OFFICE = 'Home Office / Studio',
  THEATER = 'Home Cinema',
  GYM = 'Wellness / Gym'
}

export enum DesignStyle {
  MODERN = 'Modern Minimalist',
  SCANDINAVIAN = 'Scandinavian',
  INDUSTRIAL = 'Industrial',
  BAUHAUS = 'Bauhaus',
  BRUTALIST = 'Brutalist',
  CLASSIC = 'Classic European',
  BIOPHILIC = 'Biophilic/Organic'
}

export enum VeoModel {
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO = 'veo-3.1-generate-preview',
}

export enum ImageModel {
  PRO = 'gemini-3-pro-image-preview'
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  SQUARE = '1:1'
}

export enum Resolution {
  P720 = '720p',
  P1080 = '1080p',
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export enum GenerationMode {
  TEXT_TO_VIDEO = 'Text to Video',
  IMAGE_TO_VIDEO = 'Image to Video',
  EXTEND_VIDEO = 'Extend Video',
}

export interface ImageFile {
  file?: File;
  base64: string;
  name: string;
}

export interface CreativeContext {
  baseStyle: string; 
  pinnedStyleImage: ImageFile | null;
  aspectRatio: AspectRatio;
}

export interface TimelineSegment {
  id: string;
  url: string;
  videoObject: Video;
  prompt: string;
}

export interface ImageGenerationParams {
  prompt: string;
  preset: ImagePreset;
  roomType?: RoomType;
  style: DesignStyle;
  aspectRatio: AspectRatio;
  size: ImageSize;
  sourceImage?: ImageFile | null;
}

export interface GenerateVideoParams {
  prompt: string;
  model: VeoModel;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  mode: GenerationMode;
  startFrame?: ImageFile | null;
  styleImage?: ImageFile | null;
  previousVideo?: Video | null;
}

export interface HistoryItem {
  id: string;
  url: string;
  timestamp: number;
  params: GenerateVideoParams | ImageGenerationParams;
  videoObject?: Video;
  isImage?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
