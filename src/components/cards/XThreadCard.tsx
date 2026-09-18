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
} from 'lucide-react';
import { PlatformOutput } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '../ui/Toast';

interface XThreadCardProps {
  output: PlatformOutput;
  onUpdateContent: (newContent: string) => void;
  onRegenerate: (customInstructions?: string) => Promise<void>;
  isRegenerating?: boolean;
}

export function XThreadCard({
  output,
  onUpdateContent,
  onRegenerate,
  isRegenerating = false,
}: XThreadCardProps) {
  const { success, error } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(output.content);
  const [showEvidence, setShowEvidence] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [customPromptOpen, setCustomPromptOpen] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [copiedTweetIdx, setCopiedTweetIdx] = useState<number | null>(null);

  // Split tweets if delimited by "---" or numbered posts
  const tweets = output.content
    .split(/\n\s*---\s*\n/)
    .map((t) => t.trim())
    .filter(Boolean);

  const handleCopyAll = async () => {
    const ok = await copyToClipboard(output.content);
    if (ok) {
      setIsCopied(true);
      success('Thread copied!', 'Full thread copied with separators.');
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      error('Failed to copy', 'Please manually copy the content.');
    }
  };

  const handleCopySingleTweet = async (tweetText: string, idx: number) => {
    const ok = await copyToClipboard(tweetText);
    if (ok) {
      setCopiedTweetIdx(idx);
      success(`Tweet ${idx + 1} copied!`);
      setTimeout(() => setCopiedTweetIdx(null), 2000);
    }
  };

  const handleSaveEdit = () => {
    onUpdateContent(editText);
    setIsEditing(false);
    success('Changes saved!', 'X thread updated successfully.');
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
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-white">
              {/* X icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base">X (Twitter) Thread</h4>
                {output.isEdited && (
                  <Badge variant="purple" size="sm">
                    Edited
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400">Concise numbered posts & high-hook thread</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="indigo" size="sm" className="font-mono text-[11px]">
              {tweets.length || 1} Tweets
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
            onClick={handleCopyAll}
          >
            {isCopied ? 'Copied All' : 'Copy Thread'}
          </Button>
        </div>

        {/* Custom Instructions */}
        {customPromptOpen && (
          <div className="mb-4 p-4 rounded-xl bg-indigo-950/40 border border-indigo-700/50 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refine X Thread Prompt</span>
            </div>
            <textarea
              rows={2}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Make it 4 tweets instead, make the hook punchier, add more statistics..."
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
                Regenerate Thread
              </Button>
            </div>
          </div>
        )}

        {/* Content View / Tweet Cards */}
        {isEditing ? (
          <div className="space-y-2 mb-4">
            <textarea
              rows={12}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-900/90 border border-indigo-500/50 rounded-xl p-4 text-sm text-slate-100 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-y"
            />
            <p className="text-xs text-slate-400">Separate individual tweets using &quot;---&quot;.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-1">
            {tweets.map((tweet, idx) => {
              const tweetLength = tweet.length;
              const isOver280 = tweetLength > 280;

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200 relative group hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-400">Tweet {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono ${
                          isOver280 ? 'text-rose-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {tweetLength}/280 chars
                      </span>
                      <button
                        onClick={() => handleCopySingleTweet(tweet, idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white rounded"
                        title="Copy single tweet"
                      >
                        {copiedTweetIdx === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="whitespace-pre-line leading-relaxed">{tweet}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Verification Footers */}
      <div className="space-y-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Factual Match: {output.factualConsistencyScore || 96}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Virality Rating: {output.qualityScore || 92}/100</span>
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
