import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: 'indigo' | 'purple' | 'cyan' | 'none';
}

export function Card({
  children,
  hoverable = false,
  glow = 'none',
  className,
  ...props
}: CardProps) {
  const glowClasses = {
    indigo: 'glow-indigo',
    purple: 'glow-purple',
    cyan: 'glow-cyan',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass-card rounded-2xl p-6 text-slate-100 transition-all duration-200',
        hoverable && 'glass-card-hover cursor-pointer',
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-start justify-between mb-5 gap-4', className)}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-700/40 text-indigo-400 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
