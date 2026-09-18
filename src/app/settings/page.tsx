'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  Zap,
  Key,
  Database,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Bot,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { AppSettings } from '@/lib/types';
import {
  DEFAULT_SETTINGS,
  getStoredProjects,
  getStoredSettings,
  saveStoredSettings,
} from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { success, error, warning } = useToast();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [serverAIStatus, setServerAIStatus] = useState<{
    provider: string;
    isConfigured: boolean;
    modelName: string;
    hasOpenAI: boolean;
    hasGemini: boolean;
  } | null>(null);

  useEffect(() => {
    setSettings(getStoredSettings());

    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.aiStatus) {
          setServerAIStatus(data.aiStatus);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveSettings = () => {
    saveStoredSettings(settings);
    success('Settings saved', 'Application preferences updated.');
  };

  const handleExportBackup = () => {
    const projects = getStoredProjects();
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contentbridge-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('Backup exported', 'JSON backup file downloaded.');
  };

  const handleClearData = () => {
    if (typeof window !== 'undefined') {
      const confirmClear = window.confirm(
        'Are you sure you want to clear all local projects and reset to default? This action cannot be undone.'
      );
      if (confirmClear) {
        localStorage.clear();
        success('Storage reset', 'Workspace data cleared.');
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          Application & AI Engine Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure runtime environment variables, AI provider connections, and local storage backups.
        </p>
      </div>

      {/* LLM Engine Status Banner */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/70 border border-indigo-700/50 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Engine Connection Status</h3>
              <p className="text-xs text-slate-400">
                Server-side environment variable detection
              </p>
            </div>
          </div>

          {serverAIStatus?.isConfigured ? (
            <Badge variant="emerald" size="md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Connected: {serverAIStatus.provider.toUpperCase()}
            </Badge>
          ) : (
            <Badge variant="amber" size="md">
              <Zap className="w-4 h-4 text-amber-400" />
              Demo Simulation Active (No API Key Required)
            </Badge>
          )}
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Active Provider:</span>
            <span className="font-mono text-indigo-300 font-semibold">
              {serverAIStatus?.provider || 'demo'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Model Engine:</span>
            <span className="font-mono text-slate-200">
              {serverAIStatus?.modelName || 'ContentBridge Heuristic Engine'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Security:</span>
            <span className="text-emerald-400 font-medium">
              ✓ Server-side only (API keys never exposed to browser)
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-700/30 text-xs text-indigo-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            To connect live OpenAI or Gemini models, set <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">OPENAI_API_KEY</code> or <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">GEMINI_API_KEY</code> in your <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300">.env.local</code> file and restart the development server.
          </p>
        </div>
      </div>

      {/* Generation Parameters */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
        <h3 className="text-base font-bold text-white">Generation Parameters</h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold uppercase tracking-wider text-slate-300">
                Temperature (Creativity vs Factual Precision)
              </label>
              <span className="font-mono text-indigo-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={settings.temperature}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))
              }
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0.1 (Strict Factual Grounding)</span>
              <span>0.7 (Recommended Balanced)</span>
              <span>1.0 (High Creative Flair)</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="primary" size="sm" onClick={handleSaveSettings}>
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Workspace Data Management */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6">
        <h3 className="text-base font-bold text-white">Local Workspace & Backups</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Download className="w-4 h-4 text-indigo-400" />
              <span>Export Full Workspace Backup</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download all saved projects, brand voice profiles, and settings as a portable JSON file.
            </p>
            <Button variant="outline" size="sm" onClick={handleExportBackup} className="w-full">
              Export Backup JSON
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-rose-300">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Reset Local Storage</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clear all saved projects and revert settings to factory defaults.
            </p>
            <Button variant="danger" size="sm" onClick={handleClearData} className="w-full">
              Clear Local Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
