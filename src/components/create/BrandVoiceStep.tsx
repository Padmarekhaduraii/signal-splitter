'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Check,
  Plus,
  X,
  Video,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { BrandVoice, PlatformType, ToneType } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PRESET_BRAND_VOICES } from '@/lib/storage';
import { useToast } from '../ui/Toast';

interface BrandVoiceStepProps {
  brandVoice: BrandVoice;
  setBrandVoice: React.Dispatch<React.SetStateAction<BrandVoice>>;
  selectedPlatforms: PlatformType[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<PlatformType[]>>;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

const TONES: { id: ToneType; label: string; desc: string }[] = [
  { id: 'Professional', label: 'Professional', desc: 'Authoritative, polished, executive B2B tone' },
  { id: 'Friendly', label: 'Friendly', desc: 'Approachable, warm, and highly engaging' },
  { id: 'Educational', label: 'Educational', desc: 'Instructional, breakdown-oriented, clear' },
  { id: 'Bold', label: 'Bold', desc: 'Direct, candid, opinionated, high-contrast' },
  { id: 'Conversational', label: 'Conversational', desc: 'Casual peer-to-peer dialogue' },
];

const PLATFORMS: {
  id: PlatformType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn Post',
    desc: 'Thought leadership with strong hooks & line breaks',
    icon: () => (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
      </svg>
    ),
    color: 'text-[#0A66C2]',
  },
  {
    id: 'x_thread',
    label: 'X (Twitter) Thread',
    desc: 'Viral numbered posts with strict char limits',
    icon: () => (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'text-white',
  },
  {
    id: 'instagram_carousel',
    label: 'Instagram Carousel',
    desc: 'Slide-by-slide storyboard + visual cues + caption',
    icon: () => (
      <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
    color: 'text-purple-400',
  },
  {
    id: 'short_video_script',
    label: 'Short-Video Script',
    desc: '30-60s TikTok / Reel script with scene & audio cues',
    icon: Video,
    color: 'text-amber-400',
  },
];

export function BrandVoiceStep({
  brandVoice,
  setBrandVoice,
  selectedPlatforms,
  setSelectedPlatforms,
  onGenerate,
  onBack,
  isGenerating,
}: BrandVoiceStepProps) {
  const { warning } = useToast();
  const [avoidWordInput, setAvoidWordInput] = useState('');

  const togglePlatform = (platform: PlatformType) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length === 1) {
        warning('Platform required', 'You must keep at least one platform selected.');
        return;
      }
      setSelectedPlatforms((prev) => prev.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms((prev) => [...prev, platform]);
    }
  };

  const handleSelectAllPlatforms = () => {
    setSelectedPlatforms(['linkedin', 'x_thread', 'instagram_carousel', 'short_video_script']);
  };

  const handleAddAvoidWord = () => {
    if (!avoidWordInput.trim()) return;
    const word = avoidWordInput.trim().toLowerCase();
    if (!brandVoice.avoidWords.includes(word)) {
      setBrandVoice((prev) => ({
        ...prev,
        avoidWords: [...prev.avoidWords, word],
      }));
    }
    setAvoidWordInput('');
  };

  const handleRemoveAvoidWord = (word: string) => {
    setBrandVoice((prev) => ({
      ...prev,
      avoidWords: prev.avoidWords.filter((w) => w !== word),
    }));
  };

  const handleApplyPreset = (preset: BrandVoice) => {
    setBrandVoice(preset);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="pb-6 border-b border-slate-800">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Step 3: Brand Voice & Platform Selection
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Customize the persona, tone, target audience, and social channels for targeted distribution.
        </p>
      </div>

      {/* Preset Voice Selectors */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Load Quick Brand Voice Preset:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_BRAND_VOICES.map((preset) => {
            const isSelected = brandVoice.name === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-950/70 border-indigo-500/50 shadow-md text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-white truncate">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{preset.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Tone Selector */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Tone Selector
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TONES.map((tone) => {
            const isSelected = brandVoice.tone === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => setBrandVoice((prev) => ({ ...prev, tone: tone.id }))}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">{tone.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{tone.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Brand Voice Description & Target Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Brand Voice Description
          </label>
          <textarea
            rows={4}
            value={brandVoice.description}
            onChange={(e) => setBrandVoice((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="e.g. Insight-dense, authoritative, data-first tone that resonates with modern software executives..."
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl p-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Target Audience
            </label>
            <input
              type="text"
              value={brandVoice.targetAudience}
              onChange={(e) =>
                setBrandVoice((prev) => ({ ...prev, targetAudience: e.target.value }))
              }
              placeholder="e.g. CTOs, Product Leads, Tech Founders, Engineers"
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Preferred Call-to-Action (CTA)
            </label>
            <input
              type="text"
              value={brandVoice.preferredCTA}
              onChange={(e) => setBrandVoice((prev) => ({ ...prev, preferredCTA: e.target.value }))}
              placeholder="e.g. Share your thoughts in the comments and follow for weekly breakdowns."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Words to Avoid */}
      <div className="space-y-3">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
          Words or Phrases to Avoid (Banned Buzzwords)
        </label>
        <div className="flex items-center gap-2 max-w-lg">
          <input
            type="text"
            value={avoidWordInput}
            onChange={(e) => setAvoidWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddAvoidWord();
              }
            }}
            placeholder="Add word to avoid (e.g. synergy, delve, game-changer)..."
            className="flex-1 bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <Button variant="secondary" size="sm" onClick={handleAddAvoidWord} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Add
          </Button>
        </div>

        {brandVoice.avoidWords?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {brandVoice.avoidWords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-950/40 border border-rose-700/40 text-rose-300 text-xs font-medium"
              >
                <span>✕ {word}</span>
                <button
                  onClick={() => handleRemoveAvoidWord(word)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Section 4: Platform Selection */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Select Output Platforms
            </h3>
            <p className="text-xs text-slate-400">
              Select one or more channels to synthesize simultaneously.
            </p>
          </div>
          <button
            onClick={handleSelectAllPlatforms}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`glass-card rounded-2xl p-5 border cursor-pointer select-none transition-all duration-200 ${
                  isSelected
                    ? 'border-indigo-500/80 bg-indigo-950/30 shadow-lg shadow-indigo-950/40'
                    : 'border-slate-800 hover:border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900 border border-slate-700/80 ${platform.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white">{platform.label}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{platform.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" size="lg" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Analysis
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={onGenerate}
          isLoading={isGenerating}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="font-semibold shadow-xl"
        >
          {isGenerating ? 'Generating Across Channels...' : `Generate Content (${selectedPlatforms.length} Platforms)`}
        </Button>
      </div>
    </div>
  );
}
