'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Clock,
  Type,
  BookOpen,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { SourceType } from '@/lib/types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { countWords, countCharacters, estimateReadingTime } from '@/lib/utils';
import { SAMPLE_DOCUMENTS } from '@/lib/samples';
import { useToast } from '../ui/Toast';

interface SourceInputStepProps {
  title: string;
  setTitle: (t: string) => void;
  sourceType: SourceType;
  setSourceType: (st: SourceType) => void;
  sourceText: string;
  setSourceText: (txt: string) => void;
  onProceed: () => void;
  isAnalyzing?: boolean;
}

const SOURCE_TYPES: SourceType[] = [
  'Article',
  'Blog',
  'Research Report',
  'Transcript',
  'Other',
];

export function SourceInputStep({
  title,
  setTitle,
  sourceType,
  setSourceType,
  sourceText,
  setSourceText,
  onProceed,
  isAnalyzing = false,
}: SourceInputStepProps) {
  const { success, error, warning } = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = countWords(sourceText);
  const charCount = countCharacters(sourceText);
  const readingTime = estimateReadingTime(wordCount);

  const handleFileUpload = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md')) {
      error('Unsupported file format', 'Please upload a plain text (.txt) or Markdown (.md) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setSourceText(content);
        if (!title.trim()) {
          const autoTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setTitle(autoTitle.charAt(0).toUpperCase() + autoTitle.slice(1));
        }
        setErrorMessage(null);
        success('File uploaded!', `Loaded ${countWords(content)} words from ${file.name}.`);
      }
    };
    reader.onerror = () => {
      error('File read error', 'Could not read the uploaded file.');
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (sample) {
      setTitle(sample.title);
      setSourceType(sample.sourceType);
      setSourceText(sample.text);
      setErrorMessage(null);
      success('Sample document loaded!', `Loaded "${sample.title}" (${countWords(sample.text)} words).`);
    }
  };

  const handleValidateAndProceed = () => {
    if (!sourceText || !sourceText.trim()) {
      setErrorMessage('Please paste or upload source document text before proceeding.');
      error('Input required', 'Source document text cannot be empty.');
      return;
    }

    if (wordCount < 15) {
      setErrorMessage('Source text is too short. Please provide at least 15 words for a meaningful analysis.');
      warning('Text too short', 'Long-form content yields higher quality social outputs.');
      return;
    }

    setErrorMessage(null);
    onProceed();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Step Header & Sample Quick Loaders */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Step 1: Ingest Long-Form Source Document
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Provide the foundation text (report, article, transcript) to analyze and repurpose into platform-specific content.
          </p>
        </div>

        {/* Sample Loaders */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Demo:
          </span>
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/70 border border-slate-700/80 hover:border-indigo-500/50 text-xs text-slate-300 hover:text-white font-medium transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>{sample.badge}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meta Configuration: Title & Source Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Source Document Title
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 2026 Clinical Diagnostic AI Benchmark Report"
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {title && (
              <button
                onClick={() => setTitle('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Source Type
          </label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as SourceType)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
          >
            {SOURCE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-slate-900 text-white">
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Drag & Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01]'
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          }}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-700/50 flex items-center justify-center text-indigo-400 shadow-md">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-sm text-white">Click to upload</span> or drag and drop
          </div>
          <p className="text-xs text-slate-400">Plain text (.txt) or Markdown (.md) documents</p>
        </div>
      </div>

      {/* Main Text Editor / Textarea */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Source Text Editor
          </label>
          {sourceText && (
            <button
              onClick={() => setSourceText('')}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear text
            </button>
          )}
        </div>

        <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-inner overflow-hidden focus-within:border-indigo-500/60 transition-colors">
          <textarea
            rows={14}
            value={sourceText}
            onChange={(e) => {
              setSourceText(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="Paste your article, whitepaper, clinical study, blog post, or interview transcript here..."
            className="w-full bg-transparent p-5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none leading-relaxed font-mono resize-y"
          />

          {/* Text Metrics Bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <strong className="text-white">{wordCount}</strong> words
              </span>
              <span className="flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-400" />
                <strong className="text-white">{charCount}</strong> characters
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <strong className="text-white">{readingTime}</strong>
              </span>
            </div>

            {wordCount >= 15 && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Valid document
              </span>
            )}
          </div>
        </div>

        {/* Error message alert if validation fails */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <div className="text-xs text-slate-400">
          Next: Deep analysis will extract claims, statistics, quotes, and audience insights.
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleValidateAndProceed}
          isLoading={isAnalyzing}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-semibold shadow-xl"
        >
          {isAnalyzing ? 'Analyzing Source...' : 'Proceed to Source Analysis'}
        </Button>
      </div>
    </div>
  );
}
