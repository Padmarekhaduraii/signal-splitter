'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FolderKanban,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  BookOpen,
  Share2,
  ShieldCheck,
  Download,
  Filter,
} from 'lucide-react';
import { Project, SourceType } from '@/lib/types';
import { deleteStoredProject, getStoredProjects } from '@/lib/storage';
import { Button } from '@/components/ui/Button';
import { Badge, PlatformBadge, SourceTypeBadge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function ProjectsPage() {
  const router = useRouter();
  const { success } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProjects(getStoredProjects());
    setLoading(false);
  }, []);

  const handleDelete = (id: string, title: string) => {
    deleteStoredProject(id);
    setProjects(getStoredProjects());
    success('Project deleted', `"${title}" removed from workspace.`);
  };

  const handleExportProject = (project: Project) => {
    let bundle = `# ${project.title}\n\n`;
    bundle += `Source Type: ${project.sourceType}\n`;
    bundle += `Word Count: ${project.sourceWordCount}\n`;
    bundle += `Created: ${new Date(project.createdAt).toLocaleString()}\n`;
    bundle += `Brand Voice Tone: ${project.brandVoice?.tone || 'Professional'}\n\n`;

    if (project.sourceAnalysis) {
      bundle += `## 📌 SOURCE ANALYSIS\n`;
      bundle += `Topic: ${project.sourceAnalysis.mainTopic}\n`;
      bundle += `Summary: ${project.sourceAnalysis.summary}\n\n`;
    }

    Object.entries(project.outputs || {}).forEach(([platform, out]) => {
      bundle += `## 🚀 ${platform.toUpperCase()}\n\n${out?.content}\n\n`;
      bundle += `------------------------------------------------------\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-export.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    success('Export generated', `Downloaded "${project.title}" as Markdown.`);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sourceText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || p.sourceType === selectedType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            My Content Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage, reopen, and export saved research documents and social media campaigns.
          </p>
        </div>
        <Link href="/create">
          <Button variant="gradient" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            New Project
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or content keywords..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Source Type Filter */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {['all', 'Article', 'Blog', 'Research Report', 'Transcript', 'Other'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-indigo-600/30 text-white border border-indigo-500/60'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading saved projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {searchQuery || selectedType !== 'all'
                ? 'Try adjusting your search query or filters.'
                : 'You have not created any projects yet. Start by generating content from a document!'}
            </p>
          </div>
          <Link href="/create">
            <Button variant="gradient" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create New Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => {
            const outputCount = Object.keys(project.outputs || {}).length;
            const platformKeys = Object.keys(project.outputs || {}) as (keyof typeof project.outputs)[];

            return (
              <div
                key={project.id}
                className="glass-card glass-card-hover rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <SourceTypeBadge type={project.sourceType} />
                    <Badge variant="indigo" size="sm">
                      {outputCount} Channels
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white hover:text-indigo-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {project.sourceAnalysis?.summary || project.sourceText.slice(0, 140)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {platformKeys.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-[10px] font-semibold text-slate-300"
                      >
                        {p === 'linkedin'
                          ? 'LinkedIn'
                          : p === 'x_thread'
                          ? 'X Thread'
                          : p === 'instagram_carousel'
                          ? 'IG Carousel'
                          : 'Video Script'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDate(project.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExportProject(project)}
                      title="Export Markdown"
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id, project.title)}
                      title="Delete Project"
                      className="p-2 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/create?projectId=${project.id}`)}
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Open Studio
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
