'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Save,
  Download,
  Share2,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { BrandVoice, PlatformOutput, PlatformType, Project, SourceAnalysis, SourceType } from '@/lib/types';
import { LinkedInCard } from '../cards/LinkedInCard';
import { XThreadCard } from '../cards/XThreadCard';
import { InstagramCard } from '../cards/InstagramCard';
import { VideoScriptCard } from '../cards/VideoScriptCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/Toast';

interface ContentStudioStepProps {
  outputs: Partial<Record<PlatformType, PlatformOutput>>;
  setOutputs: React.Dispatch<React.SetStateAction<Partial<Record<PlatformType, PlatformOutput>>>>;
  sourceTitle: string;
  sourceType: SourceType;
  sourceText: string;
  sourceAnalysis: SourceAnalysis;
  brandVoice: BrandVoice;
  selectedPlatforms: PlatformType[];
  onBackToBrandVoice: () => void;
  onSaveProject: () => void;
  isSaving?: boolean;
}

export function ContentStudioStep({
  outputs,
  setOutputs,
  sourceTitle,
  sourceType,
  sourceText,
  sourceAnalysis,
  brandVoice,
  selectedPlatforms,
  onBackToBrandVoice,
  onSaveProject,
  isSaving = false,
}: ContentStudioStepProps) {
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState<'all' | PlatformType>('all');
  const [regeneratingPlatform, setRegeneratingPlatform] = useState<PlatformType | null>(null);

  const handleUpdateContent = (platform: PlatformType, newContent: string) => {
    setOutputs((prev) => {
      const existing = prev[platform];
      if (!existing) return prev;
      return {
        ...prev,
        [platform]: {
          ...existing,
          content: newContent,
          isEdited: true,
          wordCount: newContent.split(/\s+/).filter(Boolean).length,
          characterCount: newContent.length,
        },
      };
    });
  };

  const handleRegeneratePlatform = async (platform: PlatformType, customInstructions?: string) => {
    setRegeneratingPlatform(platform);
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          sourceTitle,
          sourceAnalysis,
          brandVoice,
          currentContent: outputs[platform]?.content,
          customInstructions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to regenerate platform content');
      }

      setOutputs((prev) => ({
        ...prev,
        [platform]: data.output,
      }));

      success('Content regenerated!', `Successfully updated ${platform.replace('_', ' ')}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Regeneration failed';
      error('Regeneration error', msg);
    } finally {
      setRegeneratingPlatform(null);
    }
  };

  const handleExportAll = () => {
    let bundle = `# ${sourceTitle || 'ContentBridge AI Generated Assets'}\n\n`;
    bundle += `Source Type: ${sourceType}\n`;
    bundle += `Generated: ${new Date().toLocaleString()}\n`;
    bundle += `Tone: ${brandVoice.tone} | Audience: ${brandVoice.targetAudience}\n\n`;
    bundle += `======================================================\n\n`;

    if (outputs.linkedin) {
      bundle += `## 💼 LINKEDIN POST\n\n${outputs.linkedin.content}\n\n`;
      bundle += `------------------------------------------------------\n\n`;
    }
    if (outputs.x_thread) {
      bundle += `## 🐦 X (TWITTER) THREAD\n\n${outputs.x_thread.content}\n\n`;
      bundle += `------------------------------------------------------\n\n`;
    }
    if (outputs.instagram_carousel) {
      bundle += `## 📸 INSTAGRAM CAROUSEL\n\n${outputs.instagram_carousel.content}\n\n`;
      bundle += `------------------------------------------------------\n\n`;
    }
    if (outputs.short_video_script) {
      bundle += `## 🎬 SHORT-VIDEO SCRIPT\n\n${outputs.short_video_script.content}\n\n`;
      bundle += `------------------------------------------------------\n\n`;
    }

    const blob = new Blob([bundle], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(sourceTitle || 'contentbridge-bundle').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    success('Export downloaded!', 'All generated platform assets exported to Markdown.');
  };

  const availablePlatforms = Object.keys(outputs) as PlatformType[];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Generation Active
            </Badge>
            <Badge variant="purple" size="sm">
              {availablePlatforms.length} Channels Synthesized
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Generated Content Studio
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review, edit, copy, or regenerate individual channels. Every output includes factual verification anchors.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportAll}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All (.md)
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={onSaveProject}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Project
          </Button>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800/60">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-indigo-600/30 text-white border border-indigo-500/60 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          All Outputs ({availablePlatforms.length})
        </button>
        {availablePlatforms.map((platform) => {
          const names: Record<PlatformType, string> = {
            linkedin: 'LinkedIn',
            x_thread: 'X Thread',
            instagram_carousel: 'Instagram Carousel',
            short_video_script: 'Video Script',
          };
          const isCurrent = activeTab === platform;

          return (
            <button
              key={platform}
              onClick={() => setActiveTab(platform)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                isCurrent
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/60 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
              }`}
            >
              {names[platform]}
            </button>
          );
        })}
      </div>

      {/* Content Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* LinkedIn Card */}
        {outputs.linkedin && (activeTab === 'all' || activeTab === 'linkedin') && (
          <LinkedInCard
            output={outputs.linkedin}
            onUpdateContent={(content) => handleUpdateContent('linkedin', content)}
            onRegenerate={(customInstructions) =>
              handleRegeneratePlatform('linkedin', customInstructions)
            }
            isRegenerating={regeneratingPlatform === 'linkedin'}
          />
        )}

        {/* X Thread Card */}
        {outputs.x_thread && (activeTab === 'all' || activeTab === 'x_thread') && (
          <XThreadCard
            output={outputs.x_thread}
            onUpdateContent={(content) => handleUpdateContent('x_thread', content)}
            onRegenerate={(customInstructions) =>
              handleRegeneratePlatform('x_thread', customInstructions)
            }
            isRegenerating={regeneratingPlatform === 'x_thread'}
          />
        )}

        {/* Instagram Carousel Card */}
        {outputs.instagram_carousel && (activeTab === 'all' || activeTab === 'instagram_carousel') && (
          <InstagramCard
            output={outputs.instagram_carousel}
            onUpdateContent={(content) => handleUpdateContent('instagram_carousel', content)}
            onRegenerate={(customInstructions) =>
              handleRegeneratePlatform('instagram_carousel', customInstructions)
            }
            isRegenerating={regeneratingPlatform === 'instagram_carousel'}
          />
        )}

        {/* Short-Video Script Card */}
        {outputs.short_video_script && (activeTab === 'all' || activeTab === 'short_video_script') && (
          <VideoScriptCard
            output={outputs.short_video_script}
            onUpdateContent={(content) => handleUpdateContent('short_video_script', content)}
            onRegenerate={(customInstructions) =>
              handleRegeneratePlatform('short_video_script', customInstructions)
            }
            isRegenerating={regeneratingPlatform === 'short_video_script'}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" size="lg" onClick={onBackToBrandVoice} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Adjust Brand Voice & Tone
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="gradient" size="lg" onClick={onSaveProject} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Project to Library
          </Button>
        </div>
      </div>
    </div>
  );
}
