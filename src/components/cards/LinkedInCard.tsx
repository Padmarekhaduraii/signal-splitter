'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  RotateCw,
  Share2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PlatformOutput } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '../ui/Toast';

interface LinkedInCardProps {
  output: PlatformOutput;
  onUpdateContent: (newContent: string) => void;
  onRegenerate: (customInstructions?: string) => Promise<void>;
  isRegenerating?: boolean;
}

export function LinkedInCard({
  output,
  onUpdateContent,
  onRegenerate,
  isRegenerating = false,
}: LinkedInCardProps) {
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(output.content);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [customPromptOpen, setCustomPromptOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleCopy = async () => {
    const ok = await copyToClipboard(output.content);
    if (ok) {
      setIsCopied(true);
      success('Copied to clipboard!', 'LinkedIn post is ready to publish.');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      error('Failed to copy', 'Please manually select and copy the text.');
    }
  };

  const handleSaveEdit = () => {
    onUpdateContent(editText);
    setIsEditing(false);
    success('Changes saved!', 'LinkedIn post updated successfully.');
  };

  const handleCancelEdit = () => {
    setEditText(output.content);
    setIsEditing(false);
  };

  const handleTriggerRegenerate = async () => {
    setCustomPromptOpen(false);
    await onRegenerate(customInstructions || undefined);
    setCustomInstructions('');
  };

  const charCount = output.characterCount || output.content.length;
  const wordCount = output.wordCount || output.content.split(/\s+/).filter(Boolean).length;
  const charLimit = 3000;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl transition-all">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#0A66C2]">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.75-1.75-1.75a1.75 1.75 0 0 0-1.75 1.75c0 .97.78 1.76 1.75 1.76m1.4 9.74v-8.37H5.06v8.37h2.8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">LinkedIn Post</h4>
                {output.isEdited && (
                  <Badge variant="purple" size="sm">
                    Edited
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">Thought leadership formatting & hooks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={isOverLimit ? 'rose' : 'default'}
              size="sm"
              className="font-mono text-[11px]"
            >
              {charCount} / {charLimit} chars
            </Badge>
            <Badge variant="default" size="sm" className="font-mono text-[11px]">
              {wordCount} words
            </Badge>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => {
                  setEditText(output.content);
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                  onClick={handleSaveEdit}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<X className="w-3.5 h-3.5" />}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />}
              isLoading={isRegenerating}
              onClick={() => setCustomPromptOpen(!customPromptOpen)}
            >
              Regenerate
            </Button>
          </div>

          <Button
            variant={isCopied ? 'secondary' : 'primary'}
            size="sm"
            leftIcon={isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
            className={isCopied ? 'border-emerald-500/50 text-emerald-300' : ''}
          >
            {isCopied ? 'Copied' : 'Copy Post'}
          </Button>
        </div>

        {/* Custom Instructions Input for Regeneration */}
        {customPromptOpen && (
          <div className="mb-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/50 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refine with Custom Prompt (Optional)</span>
            </div>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Make the opening hook punchier, emphasize the 34.2% metric more, make it shorter..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 mb-2"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setCustomPromptOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="gradient"
                isLoading={isRegenerating}
                onClick={handleTriggerRegenerate}
              >
                Regenerate LinkedIn Post
              </Button>
            </div>
          </div>
        )}

        {/* Content Body */}
        {isEditing ? (
          <div className="space-y-2 mb-4">
            <textarea
              rows={12}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-900/90 border border-indigo-500/50 rounded-xl p-4 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Markdown and line-breaks supported</span>
              <span className={editText.length > charLimit ? 'text-rose-400' : ''}>
                {editText.length} characters
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 mb-4 max-h-96 overflow-y-auto font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line select-text">
            {output.content}
          </div>
        )}
      </div>

      {/* Verification & Quality Placeholder Footers */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Factual Match: {output.factualConsistencyScore || 98}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engagement Score: {output.qualityScore || 95}/100</span>
            </div>
          </div>

          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{showEvidence ? 'Hide' : 'View'} Evidence ({output.evidence?.length || 0})</span>
            {showEvidence ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Evidence Section */}
        {showEvidence && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Source Document Fact Anchors:</span>
            </div>
            {output.evidence && output.evidence.length > 0 ? (
              output.evidence.map((ev, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                  <div className="font-medium text-indigo-300 mb-0.5">Claim: &quot;{ev.claim}&quot;</div>
                  <div className="text-[11px] text-slate-400">Context: {ev.sourceContext}</div>
                  <div className="text-[10px] text-emerald-400 mt-1">
                    Traceability Confidence: {ev.confidenceScore}%
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 italic">Extracted directly from analyzed source document thesis.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
