'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AppFrameProps {
  children: ReactNode;
  variant?: 'default' | 'constrained';
  className?: string;
}

export function AppFrame({ children, variant = 'default', className }: AppFrameProps) {
  return (
    <div className={cn(
      'min-h-screen w-full',
      variant === 'constrained' && 'max-w-screen-sm mx-auto',
      className
    )}>
      <div className="px-4 py-6 md:px-6 md:py-8">
        {children}
      </div>
    </div>
  );
}
