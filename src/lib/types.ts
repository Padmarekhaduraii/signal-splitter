export type SourceType =
  | 'Article'
  | 'Blog'
  | 'Research Report'
  | 'Transcript'
  | 'Other';

export type ToneType =
  | 'Professional'
  | 'Friendly'
  | 'Educational'
  | 'Bold'
  | 'Conversational';

export type PlatformType =
  | 'linkedin'
  | 'x_thread'
  | 'instagram_carousel'
  | 'short_video_script';

export interface SourceAnalysis {
  mainTopic: string;
  summary: string;
  keyIdeas: string[];
  importantClaims: string[];
  statisticsAndNumbers: string[];
  namedEntities: string[];
  importantQuotations: string[];
  intendedAudience: string;
  originalTone: string;
  primaryPurpose: string;
}

export interface BrandVoice {
  id?: string;
  name?: string;
  description: string;
  tone: ToneType;
  targetAudience: string;
  avoidWords: string[];
  preferredCTA: string;
  isDefault?: boolean;
}

export interface VerificationEvidence {
  claim: string;
  sourceContext: string;
  confidenceScore: number; // e.g. 95 (percentage)
  quoteMatch?: string;
}

export interface CarouselSlide {
  slideNumber: number;
  header: string;
  body: string;
  visualCue?: string;
}

export interface VideoScriptScene {
  timestamp: string;
  hookOrSection: string;
  visualDirection: string;
  spokenNarration: string;
  onScreenText: string;
}

export interface PlatformOutput {
  platform: PlatformType;
  content: string;
  wordCount: number;
  characterCount: number;
  qualityScore: number; // 0-100 placeholder / calculated score
  factualConsistencyScore: number; // 0-100 placeholder / calculated score
  evidence: VerificationEvidence[];
  parsedStructure?: {
    slides?: CarouselSlide[];
    scenes?: VideoScriptScene[];
    tweets?: string[];
  };
  generatedAt: string;
  isEdited?: boolean;
}

export interface Project {
  id: string;
  title: string;
  sourceType: SourceType;
  sourceText: string;
  sourceWordCount: number;
  sourceAnalysis?: SourceAnalysis;
  brandVoice: BrandVoice;
  selectedPlatforms: PlatformType[];
  outputs: Partial<Record<PlatformType, PlatformOutput>>;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'analyzed' | 'generated';
}

export interface GenerationRequest {
  sourceText: string;
  sourceAnalysis: SourceAnalysis;
  brandVoice: BrandVoice;
  platforms: PlatformType[];
  sourceTitle?: string;
}

export interface RegenerationRequest {
  platform: PlatformType;
  sourceText: string;
  sourceAnalysis: SourceAnalysis;
  brandVoice: BrandVoice;
  currentContent?: string;
  customInstructions?: string;
}

export interface AppSettings {
  aiProvider: 'demo' | 'openai' | 'gemini';
  apiKey?: string;
  modelName?: string;
  temperature: number;
  theme: 'dark' | 'system';
}
