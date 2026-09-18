'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  FolderKanban,
  FileCheck2,
  Share2,
  ArrowRight,
  Plus,
  ShieldCheck,
  Clock,
  ExternalLink,
  BookOpen,
  Trash2,
  Layers,
  Search,
  Sliders,
  Zap,
} from 'lucide-react';
import { Project } from '@/lib/types';
import { deleteStoredProject, getStoredProjects } from '@/lib/storage';
import { SAMPLE_DOCUMENTS } from '@/lib/samples';
import { Button } from '@/components/ui/Button';
import { Badge, PlatformBadge, SourceTypeBadge } from '@/components/ui/Badge';
import { Card, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const router = useRouter();
  const { success } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = getStoredProjects();
    setProjects(loaded);
    setLoading(false);
  }, []);

  const totalProjects = projects.length;
  const totalContentPieces = projects.reduce((acc, p) => {
    return acc + Object.keys(p.outputs || {}).length;
  }, 0);
  const totalVerifiedClaims = projects.reduce((acc, p) => {
    const fromOutputs = Object.values(p.outputs || {}).reduce(
      (evAcc, out) => evAcc + (out?.evidence?.length || 0),
      0
    );
    const fromAnalysis = p.sourceAnalysis?.importantClaims?.length || 0;
    return acc + Math.max(fromOutputs, fromAnalysis);
  }, 0);

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteStoredProject(id);
    setProjects(getStoredProjects());
    success('Project deleted', 'Removed from local workspace.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>ContentBridge AI • Enterprise Synthesis Engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Turn Deep Research into{' '}
            <span className="gradient-text">Verified Social Authority</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Synthesize articles, whitepapers, and transcripts into high-retention LinkedIn posts, X
            threads, Instagram carousels, and video scripts without losing source factual anchors.
          </p>
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link href="/create">
              <Button
                variant="gradient"
                size="lg"
                leftIcon={<Plus className="w-5 h-5" />}
                className="font-bold shadow-xl"
              >
                New Content Project
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="outline" size="lg" leftIcon={<FolderKanban className="w-4 h-4" />}>
                Browse All Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/60 border border-indigo-700/50 text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalProjects}</div>
          <p className="text-[11px] text-slate-400">Stored in local browser workspace</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Content Pieces Generated
            </span>
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-700/50 text-purple-400">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalContentPieces}</div>
          <p className="text-[11px] text-slate-400">Across 4 social & video formats</p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Verified Claims Tracked
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-700/50 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{totalVerifiedClaims}</div>
          <p className="text-[11px] text-emerald-400 font-medium">100% Traceable to source documents</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-2 relative overflow-hidden group hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Supported Channels
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-700/50 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">4</div>
          <p className="text-[11px] text-slate-400">LinkedIn • X • Instagram • Shorts</p>
        </div>
      </div>

      {/* Simple Workflow Overview Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              ContentBridge AI Workflow Overview
            </h3>
            <p className="text-xs text-slate-400">
              End-to-end pipeline ensuring factual integrity from source to multi-platform publication.
            </p>
          </div>
          <Badge variant="indigo" size="sm">
            5-Stage Pipeline
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
              1
            </div>
            <h4 className="font-bold text-sm text-white">Source Input</h4>
            <p className="text-xs text-slate-400">
              Ingest raw research, articles, or transcripts via upload or editor.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-xs border border-purple-500/30">
              2
            </div>
            <h4 className="font-bold text-sm text-white">Source Analysis</h4>
            <p className="text-xs text-slate-400">
              Extract core thesis, empirical claims, statistics, quotes, and entities.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
              3
            </div>
            <h4 className="font-bold text-sm text-white">Brand Voice</h4>
            <p className="text-xs text-slate-400">
              Tune tone (Professional, Bold, Educational) and define banned buzzwords.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              4
            </div>
            <h4 className="font-bold text-sm text-white">Multi-Channel Gen</h4>
            <p className="text-xs text-slate-400">
              Parallel generation for LinkedIn, X Threads, IG Carousels & Video scripts.
            </p>
          </div>

          {/* Stage 5 */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
              5
            </div>
            <h4 className="font-bold text-sm text-white">Fact Verification</h4>
            <p className="text-xs text-slate-400">
              Audit every claim and quote back to the verified source context.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Templates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Instant Demo Launchers
            </h3>
            <p className="text-xs text-slate-400">
              Load realistic benchmark data to immediately test the generation pipeline.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => router.push(`/create?sample=${doc.id}`)}
              className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <SourceTypeBadge type={doc.sourceType} />
                  <Badge variant="indigo" size="sm">
                    {doc.badge}
                  </Badge>
                </div>
                <h4 className="font-bold text-sm text-white leading-snug">{doc.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {doc.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold pt-3 border-t border-slate-800/80">
                <span>Load into Studio</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Projects</h3>
            <p className="text-xs text-slate-400">
              Continue working on saved content drafts or export finished assets.
            </p>
          </div>
          <Link href="/create">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No projects created yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Start by ingesting your first research document or load an instant demo template above.
              </p>
            </div>
            <Link href="/create">
              <Button variant="gradient" size="sm">
                Start First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 overflow-x-auto">
            {projects.slice(0, 5).map((project) => {
              const platformKeys = Object.keys(project.outputs || {}) as (keyof typeof project.outputs)[];

              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/create?projectId=${project.id}`)}
                  className="p-5 flex items-center justify-between hover:bg-slate-850/50 transition-colors cursor-pointer gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SourceTypeBadge type={project.sourceType} />
                      <h4 className="font-bold text-sm text-white truncate max-w-md">
                        {project.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(project.updatedAt)}
                      </span>
                      <span>•</span>
                      <span>{project.sourceWordCount || 0} words</span>
                      <span>•</span>
                      <span className="text-indigo-300">Tone: {project.brandVoice?.tone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5">
                      {platformKeys.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-semibold text-slate-300"
                        >
                          {p === 'linkedin'
                            ? 'LI'
                            : p === 'x_thread'
                            ? 'X'
                            : p === 'instagram_carousel'
                            ? 'IG'
                            : 'Script'}
                        </span>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="text-slate-500 hover:text-rose-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Open
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
