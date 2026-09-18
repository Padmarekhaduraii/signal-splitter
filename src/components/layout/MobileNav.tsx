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
  X,
  Layers,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/Badge';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Create Content', href: '/create', icon: Sparkles, badge: 'Studio' },
  { label: 'My Projects', href: '/projects', icon: FolderKanban },
  { label: 'Brand Voice', href: '/brand-voice', icon: Sliders },
  { label: 'Verification Center', href: '/verification', icon: ShieldCheck },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 bg-[#0B1120] border-r border-slate-800 h-full flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 shadow-2xl">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#0B1120] rounded-[6px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-white text-base tracking-tight">ContentBridge AI</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav list */}
          <div className="px-3 py-4 space-y-1">
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
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="indigo" size="sm" className="text-[10px]">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Ready for immediate testing without required API keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
