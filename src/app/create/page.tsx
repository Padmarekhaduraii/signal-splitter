'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StepIndicator } from '@/components/create/StepIndicator';
import { SourceInputStep } from '@/components/create/SourceInputStep';
import { SourceAnalysisStep } from '@/components/create/SourceAnalysisStep';
import { BrandVoiceStep } from '@/components/create/BrandVoiceStep';
import { ContentStudioStep } from '@/components/create/ContentStudioStep';
import {
  BrandVoice,
  PlatformOutput,
  PlatformType,
  Project,
  SourceAnalysis,
  SourceType,
} from '@/lib/types';
import { DEFAULT_BRAND_VOICE, getStoredProjectById, saveStoredProject } from '@/lib/storage';
import { SAMPLE_DOCUMENTS } from '@/lib/samples';
import { useToast } from '@/components/ui/Toast';
import { countWords } from '@/lib/utils';

function CreateWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { success, error, info } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);

  // Project state
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('Article');
  const [sourceText, setSourceText] = useState('');
  const [sourceAnalysis, setSourceAnalysis] = useState<SourceAnalysis | null>(null);
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(DEFAULT_BRAND_VOICE);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([
    'linkedin',
    'x_thread',
    'instagram_carousel',
    'short_video_script',
  ]);
  const [outputs, setOutputs] = useState<Partial<Record<PlatformType, PlatformOutput>>>({});

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load project or sample document from query parameters
  useEffect(() => {
    const pId = searchParams.get('projectId');
    const sampleId = searchParams.get('sample');

    if (pId) {
      const existing = getStoredProjectById(pId);
      if (existing) {
        setProjectId(existing.id);
        setTitle(existing.title);
        setSourceType(existing.sourceType);
        setSourceText(existing.sourceText);
        if (existing.sourceAnalysis) {
          setSourceAnalysis(existing.sourceAnalysis);
          setMaxAccessibleStep(existing.outputs && Object.keys(existing.outputs).length > 0 ? 4 : 3);
        }
        if (existing.brandVoice) setBrandVoice(existing.brandVoice);
        if (existing.selectedPlatforms) setSelectedPlatforms(existing.selectedPlatforms);
        if (existing.outputs && Object.keys(existing.outputs).length > 0) {
          setOutputs(existing.outputs);
          setCurrentStep(4);
          setMaxAccessibleStep(4);
        } else if (existing.sourceAnalysis) {
          setCurrentStep(2);
        }
        info('Project loaded', `Loaded "${existing.title}".`);
      }
    } else if (sampleId) {
      const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
      if (sample) {
        setTitle(sample.title);
        setSourceType(sample.sourceType);
        setSourceText(sample.text);
        info('Sample loaded', `Loaded "${sample.title}".`);
      }
    }
  }, [searchParams, info]);

  // Handle Step 1 -> Step 2: Trigger Analysis
  const handleProceedToAnalysis = async () => {
    if (sourceAnalysis) {
      setCurrentStep(2);
      if (maxAccessibleStep < 2) setMaxAccessibleStep(2);
      return;
    }
    await handleTriggerAnalysis();
  };

  const handleTriggerAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sourceType,
          text: sourceText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze source text');
      }

      setSourceAnalysis(data.analysis);
      setCurrentStep(2);
      setMaxAccessibleStep((prev) => Math.max(prev, 2));
      success('Analysis complete!', 'Source facts and claims extracted successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis error';
      error('Analysis failed', msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Step 2 -> Step 3: Go to Brand Voice
  const handleProceedToBrandVoice = () => {
    setCurrentStep(3);
    setMaxAccessibleStep((prev) => Math.max(prev, 3));
  };

  // Handle Step 3 -> Step 4: Generate Content
  const handleGenerateContent = async () => {
    if (!sourceAnalysis) {
      error('Analysis missing', 'Please analyze the source document first.');
      return;
    }

    if (selectedPlatforms.length === 0) {
      error('Platform missing', 'Please select at least one target platform.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle: title || 'Untitled Research',
          sourceText,
          sourceAnalysis,
          brandVoice,
          platforms: selectedPlatforms,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setOutputs(data.outputs);
      setCurrentStep(4);
      setMaxAccessibleStep(4);
      success('Content generated!', `Successfully synthesized ${selectedPlatforms.length} platform outputs.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation error';
      error('Generation failed', msg);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Save Project
  const handleSaveProject = () => {
    setIsSaving(true);
    try {
      const id = projectId || `proj-${Date.now()}`;
      const projectTitle = title.trim() || sourceAnalysis?.mainTopic?.slice(0, 50) || 'Untitled Content Project';

      const projectToSave: Project = {
        id,
        title: projectTitle,
        sourceType,
        sourceText,
        sourceWordCount: countWords(sourceText),
        sourceAnalysis: sourceAnalysis || undefined,
        brandVoice,
        selectedPlatforms,
        outputs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: Object.keys(outputs).length > 0 ? 'generated' : sourceAnalysis ? 'analyzed' : 'draft',
      };

      saveStoredProject(projectToSave);
      setProjectId(id);
      success('Project saved!', `"${projectTitle}" stored in your project library.`);
    } catch (err) {
      error('Save failed', 'Could not save project to local storage.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Visual Stepper */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* Step Views */}
      {currentStep === 1 && (
        <SourceInputStep
          title={title}
          setTitle={setTitle}
          sourceType={sourceType}
          setSourceType={setSourceType}
          sourceText={sourceText}
          setSourceText={setSourceText}
          onProceed={handleProceedToAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {currentStep === 2 && (
        <SourceAnalysisStep
          analysis={sourceAnalysis}
          sourceType={sourceType}
          sourceTitle={title}
          onProceed={handleProceedToBrandVoice}
          onBack={() => setCurrentStep(1)}
          onReAnalyze={handleTriggerAnalysis}
          isAnalyzing={isAnalyzing}
        />
      )}

      {currentStep === 3 && (
        <BrandVoiceStep
          brandVoice={brandVoice}
          setBrandVoice={setBrandVoice}
          selectedPlatforms={selectedPlatforms}
          setSelectedPlatforms={setSelectedPlatforms}
          onGenerate={handleGenerateContent}
          onBack={() => setCurrentStep(2)}
          isGenerating={isGenerating}
        />
      )}

      {currentStep === 4 && sourceAnalysis && (
        <ContentStudioStep
          outputs={outputs}
          setOutputs={setOutputs}
          sourceTitle={title}
          sourceType={sourceType}
          sourceText={sourceText}
          sourceAnalysis={sourceAnalysis}
          brandVoice={brandVoice}
          selectedPlatforms={selectedPlatforms}
          onBackToBrandVoice={() => setCurrentStep(3)}
          onSaveProject={handleSaveProject}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

export default function CreateWorkspacePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading creation workspace...</div>}>
      <CreateWorkspaceContent />
    </Suspense>
  );
}
