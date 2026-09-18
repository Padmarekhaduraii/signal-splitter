'use client';

import React, { useEffect, useState } from 'react';
import {
  Sliders,
  Plus,
  Trash2,
  Check,
  Edit3,
  Sparkles,
  Save,
  X,
  Target,
  Megaphone,
  Ban,
  ShieldCheck,
} from 'lucide-react';
import { BrandVoice, ToneType } from '@/lib/types';
import {
  DEFAULT_BRAND_VOICE,
  deleteStoredBrandVoice,
  getStoredBrandVoices,
  saveStoredBrandVoice,
} from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

const TONE_OPTIONS: ToneType[] = [
  'Professional',
  'Friendly',
  'Educational',
  'Bold',
  'Conversational',
];

export default function BrandVoicePage() {
  const { success, error } = useToast();
  const [voices, setVoices] = useState<BrandVoice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<BrandVoice | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tone, setTone] = useState<ToneType>('Professional');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [avoidWordsInput, setAvoidWordsInput] = useState('');
  const [avoidWords, setAvoidWords] = useState<string[]>([]);
  const [preferredCTA, setPreferredCTA] = useState('');

  useEffect(() => {
    setVoices(getStoredBrandVoices());
  }, []);

  const handleOpenCreate = () => {
    setEditingVoice(null);
    setName('');
    setTone('Professional');
    setDescription('');
    setTargetAudience('');
    setAvoidWords([]);
    setPreferredCTA('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: BrandVoice) => {
    setEditingVoice(v);
    setName(v.name || 'Brand Voice');
    setTone(v.tone);
    setDescription(v.description);
    setTargetAudience(v.targetAudience);
    setAvoidWords(v.avoidWords || []);
    setPreferredCTA(v.preferredCTA || '');
    setIsModalOpen(true);
  };

  const handleAddAvoidWord = () => {
    if (!avoidWordsInput.trim()) return;
    const w = avoidWordsInput.trim().toLowerCase();
    if (!avoidWords.includes(w)) {
      setAvoidWords([...avoidWords, w]);
    }
    setAvoidWordsInput('');
  };

  const handleRemoveAvoidWord = (w: string) => {
    setAvoidWords(avoidWords.filter((item) => item !== w));
  };

  const handleSave = () => {
    if (!name.trim()) {
      error('Name required', 'Please provide a name for this brand voice profile.');
      return;
    }

    const voiceToSave: BrandVoice = {
      id: editingVoice?.id || `voice-${Date.now()}`,
      name: name.trim(),
      tone,
      description: description.trim() || 'Custom tailored brand voice persona.',
      targetAudience: targetAudience.trim() || 'General Audience',
      avoidWords,
      preferredCTA: preferredCTA.trim(),
      isDefault: editingVoice?.isDefault || false,
    };

    saveStoredBrandVoice(voiceToSave);
    setVoices(getStoredBrandVoices());
    setIsModalOpen(false);
    success('Brand voice saved!', `"${name}" profile is ready to use.`);
  };

  const handleDelete = (id: string, voiceName: string) => {
    deleteStoredBrandVoice(id);
    setVoices(getStoredBrandVoices());
    success('Profile deleted', `"${voiceName}" removed.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Brand Voice & Persona Profiles
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure reusable tone profiles, target audiences, buzzword filters, and preferred call-to-actions.
          </p>
        </div>
        <Button variant="gradient" size="md" onClick={handleOpenCreate} leftIcon={<Plus className="w-4 h-4" />}>
          Create Voice Profile
        </Button>
      </div>

      {/* Brand Voices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {voices.map((voice) => (
          <div
            key={voice.id}
            className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-5"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-700/50 text-indigo-400">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{voice.name}</h3>
                    <Badge variant="indigo" size="sm" className="mt-0.5">
                      Tone: {voice.tone}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(voice)}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  {!voice.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(voice.id!, voice.name || 'Voice')}
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                {voice.description}
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Target className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="font-semibold text-slate-300">Audience:</span>
                  <span className="truncate text-slate-200">{voice.targetAudience}</span>
                </div>

                {voice.preferredCTA && (
                  <div className="flex items-start gap-2 text-slate-400">
                    <Megaphone className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
                    <span className="font-semibold text-slate-300 shrink-0">CTA:</span>
                    <span className="text-slate-300 italic">{voice.preferredCTA}</span>
                  </div>
                )}

                {voice.avoidWords && voice.avoidWords.length > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Avoided:
                    </span>
                    {voice.avoidWords.map((w) => (
                      <span
                        key={w}
                        className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-700/30 text-rose-300 text-[10px]"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 md:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingVoice ? 'Edit Brand Voice' : 'Create Brand Voice Profile'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Executive Tech Thought Leader"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Tone Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TONE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        tone === t
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Voice & Tone Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Authoritative, data-backed insights with clear actionable summaries..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Founders, CTOs, Engineering Leads"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Preferred CTA
                </label>
                <input
                  type="text"
                  value={preferredCTA}
                  onChange={(e) => setPreferredCTA(e.target.value)}
                  placeholder="e.g. Share your perspective below and follow for weekly breakdowns."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Banned Buzzwords / Phrases to Avoid
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={avoidWordsInput}
                    onChange={(e) => setAvoidWordsInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAvoidWord();
                      }
                    }}
                    placeholder="e.g. synergy, delve, game-changer"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <Button variant="secondary" size="sm" onClick={handleAddAvoidWord}>
                    Add
                  </Button>
                </div>
                {avoidWords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {avoidWords.map((w) => (
                      <span
                        key={w}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 border border-rose-700/40 text-rose-300 text-xs"
                      >
                        <span>{w}</span>
                        <button onClick={() => handleRemoveAvoidWord(w)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                Save Voice Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
