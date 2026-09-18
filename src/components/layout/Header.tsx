'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MobileNav } from './MobileNav';

export function Header() {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ isConfigured: boolean; provider: string } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.aiStatus) {
          setAiStatus({
            isConfigured: data.aiStatus.isConfigured,
            provider: data.aiStatus.provider,
          });
        }
      })
      .catch(() => {
        // Fallback default
        setAiStatus({ isConfigured: false, provider: 'demo' });
      });
  }, []);

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/create') return 'Create Content Studio';
    if (pathname === '/projects') return 'My Projects';
    if (pathname === '/brand-voice') return 'Brand Voice Profiles';
    if (pathname === '/verification') return 'Verification & Fact-Check Center';
    if (pathname === '/settings') return 'Settings & LLM Configuration';
    return 'ContentBridge AI';
  };

  return (
    <>
      <header className="h-16 bg-[#0B1120]/80 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-850 border border-slate-700/80 text-slate-300 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Turn long-form research into high-fidelity social content with verified traceability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {aiStatus ? (
            aiStatus.isConfigured ? (
              <Badge variant="emerald" size="sm" className="hidden sm:inline-flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {aiStatus.provider.toUpperCase()} Connected
              </Badge>
            ) : (
              <Badge variant="amber" size="sm" className="hidden sm:inline-flex">
                <Zap className="w-3 h-3 text-amber-400" />
                Demo Engine Active
              </Badge>
            )
          ) : null}

          {pathname !== '/create' && (
            <Link href="/create">
              <Button
                variant="gradient"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="font-medium shadow-md"
              >
                <span className="hidden xs:inline">New Content</span> Project
              </Button>
            </Link>
          )}
        </div>
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
