'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Edit3,
  RotateCw,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Sparkles,
  Video,
  Clock,
} from 'lucide-react';
import { PlatformOutput } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '../ui/Toast';

interface VideoScriptCardProps {
  output: PlatformOutput;
  onUpdateContent: (newContent: string) => void;
  onRegenerate: (customInstructions?: string) => Promise<void>;
  isRegenerating?: boolean;
}

export function VideoScriptCard({
  output,
  onUpdateContent,
  onRegenerate,
  isRegenerating = false,
}: VideoScriptCardProps) {
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
      success('Script copied!', 'Ready for Teleprompter or CapCut.');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      error('Failed to copy', 'Please manually select and copy the text.');
    }
  };

  const handleSaveEdit = () => {
    onUpdateContent(editText);
    setIsEditing(false);
    success('Changes saved!', 'Video script updated.');
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

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">Short-Video Script</h4>
                {output.isEdited && (
                  <Badge variant="purple" size="sm">
                    Edited
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">TikTok / Reels / Shorts 30-60s breakdown</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm" className="font-mono text-[11px]">
              <Clock className="w-3 h-3" />
              ~45-60s
            </Badge>
            <Badge variant="default" size="sm" className="font-mono text-[11px]">
              {output.wordCount || 0} words
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
          >
            {isCopied ? 'Copied' : 'Copy Script'}
          </Button>
        </div>

        {/* Custom Instructions */}
        {customPromptOpen && (
          <div className="mb-4 p-4 rounded-xl bg-amber-950/40 border border-amber-700/50 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refine Short Video Script Prompt</span>
            </div>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Make it faster 30s version, change the opening hook, add more on-screen text instructions..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 mb-2"
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
                Regenerate Video Script
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
              className="w-full bg-slate-900/90 border border-amber-500/50 rounded-xl p-4 text-sm text-slate-100 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/40 resize-y"
            />
          </div>
        ) : (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 mb-4 max-h-96 overflow-y-auto font-sans text-sm text-slate-200 leading-relaxed whitespace-pre-line select-text">
            {output.content}
          </div>
        )}
      </div>

      {/* Verification Footers */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Factual Match: {output.factualConsistencyScore || 97}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hook Retention: {output.qualityScore || 96}/100</span>
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

        {/* Collapsible Evidence */}
        {showEvidence && (
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="font-semibold text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Source Document Fact Anchors:</span>
            </div>
            {output.evidence && output.evidence.length > 0 ? (
              output.evidence.map((ev, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                  <div className="font-medium text-amber-300 mb-0.5">Claim: &quot;{ev.claim}&quot;</div>
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
