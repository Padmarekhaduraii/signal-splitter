import React from 'react';
import { cn } from '@/lib/utils';
import { PlatformType, SourceType } from '@/lib/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-200 border-slate-700/60',
    indigo: 'bg-indigo-950/70 text-indigo-300 border-indigo-700/50',
    purple: 'bg-purple-950/70 text-purple-300 border-purple-700/50',
    cyan: 'bg-cyan-950/70 text-cyan-300 border-cyan-700/50',
    emerald: 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50',
    amber: 'bg-amber-950/70 text-amber-300 border-amber-700/50',
    rose: 'bg-rose-950/70 text-rose-300 border-rose-700/50',
    outline: 'bg-transparent text-slate-300 border-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: PlatformType }) {
  switch (platform) {
    case 'linkedin':
      return (
        <Badge variant="cyan" className="font-semibold">
          LinkedIn Post
        </Badge>
      );
    case 'x_thread':
      return (
        <Badge variant="indigo" className="font-semibold">
          X Thread
        </Badge>
      );
    case 'instagram_carousel':
      return (
        <Badge variant="purple" className="font-semibold">
          Instagram Carousel
        </Badge>
      );
    case 'short_video_script':
      return (
        <Badge variant="amber" className="font-semibold">
          Video Script
        </Badge>
      );
  }
}

export function SourceTypeBadge({ type }: { type: SourceType }) {
  const variants: Record<SourceType, 'default' | 'indigo' | 'purple' | 'cyan' | 'emerald' | 'amber'> = {
    'Research Report': 'indigo',
    Article: 'cyan',
    Blog: 'purple',
    Transcript: 'amber',
    Other: 'default',
  };

  return <Badge variant={variants[type] || 'default'}>{type}</Badge>;
}
