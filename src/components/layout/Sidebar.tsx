'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  FolderKanban,
  Sliders,
  ShieldCheck,
  Settings,
  Layers,
  ExternalLink,
  Bot,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/Badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Create Content', href: '/create', icon: Sparkles, badge: 'Studio' },
  { label: 'My Projects', href: '/projects', icon: FolderKanban },
  { label: 'Brand Voice', href: '/brand-voice', icon: Sliders },
  { label: 'Verification Center', href: '/verification', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'w-64 bg-[#0B1120] border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none z-30',
        className
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  ContentBridge
                </span>
                <Badge variant="indigo" size="sm" className="px-1.5 py-0 text-[10px] font-bold">
                  AI
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Fact-Anchored Social Engine</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-6 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 text-white border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50 hover:bg-slate-800/40'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-colors',
                      isActive
                        ? 'text-indigo-400'
                        : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-md border',
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode: Standalone / Demo</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Realistic simulation active. Connect your API keys anytime in Settings.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Part 1 MVP • v1.0.0</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
