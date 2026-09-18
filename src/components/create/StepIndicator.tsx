'use client';

import React from 'react';
import { Check, FileText, Search, Sliders, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StepItem {
  number: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { number: 1, label: 'Source Input', description: 'Paste text or upload file', icon: FileText },
  { number: 2, label: 'Source Analysis', description: 'Extract facts & claims', icon: Search },
  { number: 3, label: 'Brand & Platforms', description: 'Voice & channels', icon: Sliders },
  { number: 4, label: 'Content Studio', description: 'Generated social assets', icon: Sparkles },
];

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep?: (step: number) => void;
  maxAccessibleStep: number;
}

export function StepIndicator({
  currentStep,
  onSelectStep,
  maxAccessibleStep,
}: StepIndicatorProps) {
  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-4 md:p-6 mb-8 backdrop-blur-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
        {STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isAccessible = step.number <= maxAccessibleStep;
          const Icon = step.icon;

          return (
            <button
              key={step.number}
              disabled={!isAccessible}
              onClick={() => isAccessible && onSelectStep && onSelectStep(step.number)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 select-none relative group',
                isActive
                  ? 'bg-indigo-950/70 border border-indigo-500/50 shadow-lg shadow-indigo-950/40 text-white'
                  : isCompleted
                  ? 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850 cursor-pointer'
                  : isAccessible
                  ? 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:border-slate-700 cursor-pointer'
                  : 'bg-slate-950/30 border border-slate-850/40 text-slate-400 opacity-60 cursor-not-allowed'
              )}
            >
              {/* Step Icon / Circle */}
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors duration-200',
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              {/* Step Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'text-[10px] uppercase font-bold tracking-wider',
                      isActive ? 'text-indigo-400' : 'text-slate-400'
                    )}
                  >
                    Step {step.number}
                  </span>
                </div>
                <div className="text-xs md:text-sm font-semibold truncate text-white">
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 truncate hidden sm:block">
                  {step.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
