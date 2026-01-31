

export type AspectRatio = '1:1' | '9:16' | '16:9';

export interface UploadedAsset {
  id: string;
  file: File;
  previewUrl: string;
  base64: string;
  type: 'product' | 'model' | 'reference';
  tag: '@img1' | '@img2' | '@img3';
}

export interface BrandProfile {
  id: string;
  name: string;
  primaryColor: string; // Hex
  tone: 'Warm' | 'Cool' | 'Neutral';
  contrast: 'Soft/Airy' | 'Bold/High-Contrast';
  style: 'Minimalist' | 'Luxury' | 'Vintage' | 'Cyberpunk' | 'Clean Corporate';
}

export interface GeneratedContent {
  id: string;
  url: string; // Blob URL or base64 data URI
  type: 'image' | 'video';
  promptUsed: string;
  createdAt: Date;
}

export enum StudioStyle {
  LuxuryDark = 'Luxury Dark',
  CleanBright = 'Clean Bright',
  NaturalMinimalist = 'Natural Minimalist',
  IndustrialModern = 'Industrial/Modern',
  PopPastel = 'Pop Pastel',
  ProfessionalMedical = 'Professional Medical',
  AtmosphericKitchen = 'Atmospheric Kitchen',
  HighEndPodium = 'High-End Podium',
}

export interface GenerationConfig {
  ratio: AspectRatio;
  quantity: number;
  useBrandLock: boolean;
  stylePreset?: StudioStyle;
  customPrompt?: string;
  pose?: string;
  mood?: string;
}

export interface VideoScene {
  sceneNumber: number;
  shotType: string;
  cameraAngle: string;
  actionDescription: string;
  visualPrompt: string;
  voiceOver: string;
  duration: number;
}

export interface VideoGenerationScene {
  id: string;
  image: UploadedAsset | null;
  motionPrompt: string;
}

export interface GeneratedVideoResult {
  sceneId: string;
  videoUrl: string;
  status: 'generating' | 'completed' | 'failed';
}
