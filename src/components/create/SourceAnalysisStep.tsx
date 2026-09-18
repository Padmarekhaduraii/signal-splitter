'use client';

import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Quote,
  Target,
  BarChart3,
  ShieldCheck,
  Building,
  Lightbulb,
  Compass,
  FileCheck2,
  RefreshCw,
} from 'lucide-react';
import { SourceAnalysis, SourceType } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface SourceAnalysisStepProps {
  analysis: SourceAnalysis | null;
  sourceType: SourceType;
  sourceTitle: string;
  onProceed: () => void;
  onBack: () => void;
  onReAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
}

export function SourceAnalysisStep({
  analysis,
  sourceType,
  sourceTitle,
  onProceed,
  onBack,
  onReAnalyze,
  isAnalyzing,
}: SourceAnalysisStepProps) {
  if (!analysis) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center mx-auto text-indigo-400">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Source Ready for Deep Analysis</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
            Extract empirical claims, statistics, named entities, and core thesis points for fact-anchored generation.
          </p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={onReAnalyze}
          isLoading={isAnalyzing}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Analyze Source Document Now
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" size="sm">
              <FileCheck2 className="w-3.5 h-3.5" />
              Source Ingestion Complete
            </Badge>
            <Badge variant="indigo" size="sm">
              {sourceType}
            </Badge>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Step 2: Source Knowledge Extraction & Analysis
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Structured analysis extracted from &quot;{sourceTitle || 'Source Document'}&quot;. Every claim and stat is mapped for downstream fact-checking.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReAnalyze}
          isLoading={isAnalyzing}
          leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />}
        >
          Re-Analyze
        </Button>
      </div>

      {/* Main Topic & Executive Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-purple-950/40 border border-indigo-700/40 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Core Topic & Thesis</span>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
          {analysis.mainTopic}
        </h3>
        <p className="text-sm text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
          {analysis.summary}
        </p>
      </div>

      {/* 2-Column Knowledge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Key Ideas & Factual Claims */}
        <div className="space-y-6">
          {/* Key Ideas */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Key Ideas & Core Takeaways</span>
            </div>
            <ul className="space-y-2.5">
              {analysis.keyIdeas?.map((idea, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Factual Claims */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Important Factual Claims (Traceable)</span>
            </div>
            <div className="space-y-3">
              {analysis.importantClaims?.map((claim, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                >
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{claim}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stats, Entities, Quotes & Audience */}
        <div className="space-y-6">
          {/* Statistics & Numbers */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <BarChart3 className="w-4 h-4" />
              <span>Extracted Statistics & Numbers</span>
            </div>
            <div className="space-y-2.5">
              {analysis.statisticsAndNumbers?.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-700/30 text-xs text-cyan-100 font-medium flex items-center gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                  <span>{stat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Important Quotations */}
          {analysis.importantQuotations?.length > 0 && (
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Quote className="w-4 h-4" />
                <span>Key Quotations</span>
              </div>
              <div className="space-y-2.5">
                {analysis.importantQuotations.map((quote, idx) => (
                  <blockquote
                    key={idx}
                    className="p-3.5 rounded-xl bg-purple-950/20 border-l-4 border-purple-500 text-xs text-slate-200 italic leading-relaxed"
                  >
                    {quote}
                  </blockquote>
                ))}
              </div>
            </div>
          )}

          {/* Named Entities & Metadata Pills */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Building className="w-4 h-4" />
              <span>Named Entities & Organizations</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.namedEntities?.map((entity, idx) => (
                <Badge key={idx} variant="amber" size="sm">
                  {entity}
                </Badge>
              ))}
            </div>

            {/* Audience, Tone, Purpose */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Target Audience</div>
                <div className="text-slate-200 font-medium mt-0.5">{analysis.intendedAudience}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Original Tone</div>
                <div className="text-slate-200 font-medium mt-0.5">{analysis.originalTone}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Primary Purpose</div>
                <div className="text-slate-200 font-medium mt-0.5">{analysis.primaryPurpose}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button variant="outline" size="lg" onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Source Input
        </Button>
        <Button
          variant="gradient"
          size="lg"
          onClick={onProceed}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-semibold shadow-xl"
        >
          Configure Brand Voice & Platforms
        </Button>
      </div>
    </div>
  );
}
