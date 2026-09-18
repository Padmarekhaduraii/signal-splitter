import { Project, BrandVoice, AppSettings } from './types';

const STORAGE_KEYS = {
  PROJECTS: 'contentbridge_projects_v1',
  BRAND_VOICES: 'contentbridge_brand_voices_v1',
  ACTIVE_DRAFT: 'contentbridge_active_draft_v1',
  SETTINGS: 'contentbridge_settings_v1',
};

export const DEFAULT_BRAND_VOICE: BrandVoice = {
  id: 'default-tech-leader',
  name: 'Authoritative Tech Thought Leader',
  description: 'Data-driven, forward-thinking, and insightful analysis designed to educate decision-makers with crisp clarity.',
  tone: 'Professional',
  targetAudience: 'Product Leaders, CTOs, Founders, and Tech Enthusiasts',
  avoidWords: ['synergy', 'game-changer', 'revolutionary', 'paradigm shift', 'delve'],
  preferredCTA: 'Share your thoughts in the comments and follow for weekly deep dives.',
  isDefault: true,
};

export const PRESET_BRAND_VOICES: BrandVoice[] = [
  DEFAULT_BRAND_VOICE,
  {
    id: 'founder-casual',
    name: 'Bold Founder & Builder',
    description: 'Direct, candid, transparent, and punchy storytelling focused on real metrics, failures, and hard-earned lessons.',
    tone: 'Bold',
    targetAudience: 'Early-Stage Founders, Solo Creators, and Builders',
    avoidWords: ['leverage', 'optimize', 'utilize', 'holistic'],
    preferredCTA: 'Drop a reply with your experience or bookmark this for later.',
    isDefault: false,
  },
  {
    id: 'friendly-educator',
    name: 'Friendly Educator & Coach',
    description: 'Warm, approachable, step-by-step breakdown that demystifies complex topics for beginners and practitioners.',
    tone: 'Friendly',
    targetAudience: 'Aspiring Professionals, Students, and Career Switchers',
    avoidWords: ['obviously', 'trivial', 'jargon'],
    preferredCTA: 'Save this post to review later and share with a friend who might benefit!',
    isDefault: false,
  },
  {
    id: 'data-analyst',
    name: 'Academic & Deep Researcher',
    description: 'Rigorous, evidence-centric, neutral, and precise with heavy emphasis on statistical methodology and primary sources.',
    tone: 'Educational',
    targetAudience: 'Researchers, Investors, and Data Practitioners',
    avoidWords: ['unbelievable', 'insane', 'shocking', 'miraculous'],
    preferredCTA: 'Read the full methodology and citations linked in the first reply.',
    isDefault: false,
  }
];

export const DEFAULT_SETTINGS: AppSettings = {
  aiProvider: 'demo',
  modelName: 'gpt-4o',
  temperature: 0.7,
  theme: 'dark',
};

// --- Projects Storage ---
export function getStoredProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse stored projects:', err);
    return [];
  }
}

export function saveStoredProject(project: Project): void {
  if (typeof window === 'undefined') return;
  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      projects[existingIndex] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      projects.unshift({ ...project, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save project:', err);
  }
}

export function deleteStoredProject(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const projects = getStoredProjects().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to delete project:', err);
  }
}

export function getStoredProjectById(id: string): Project | null {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === id) || null;
}

// --- Brand Voices Storage ---
export function getStoredBrandVoices(): BrandVoice[] {
  if (typeof window === 'undefined') return PRESET_BRAND_VOICES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BRAND_VOICES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BRAND_VOICES, JSON.stringify(PRESET_BRAND_VOICES));
      return PRESET_BRAND_VOICES;
    }
    const parsed = JSON.parse(raw);
    return parsed.length > 0 ? parsed : PRESET_BRAND_VOICES;
  } catch (err) {
    console.error('Failed to parse brand voices:', err);
    return PRESET_BRAND_VOICES;
  }
}

export function saveStoredBrandVoice(voice: BrandVoice): void {
  if (typeof window === 'undefined') return;
  try {
    const voices = getStoredBrandVoices();
    const id = voice.id || `voice-${Date.now()}`;
    const updatedVoice = { ...voice, id };
    const existingIndex = voices.findIndex((v) => v.id === id);
    if (existingIndex >= 0) {
      voices[existingIndex] = updatedVoice;
    } else {
      voices.push(updatedVoice);
    }
    localStorage.setItem(STORAGE_KEYS.BRAND_VOICES, JSON.stringify(voices));
  } catch (err) {
    console.error('Failed to save brand voice:', err);
  }
}

export function deleteStoredBrandVoice(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const voices = getStoredBrandVoices().filter((v) => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.BRAND_VOICES, JSON.stringify(voices));
  } catch (err) {
    console.error('Failed to delete brand voice:', err);
  }
}

// --- Settings Storage ---
export function getStoredSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}
