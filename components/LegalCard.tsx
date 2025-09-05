'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Share2, BookOpen } from 'lucide-react';

interface LegalCardProps {
  title: string;
  content?: string;
  variant?: 'base' | 'detailed' | 'shareable';
  onClick?: () => void;
  onShare?: () => void;
  className?: string;
  children?: ReactNode;
}

export function LegalCard({ 
  title, 
  content, 
  variant = 'base', 
  onClick, 
  onShare,
  className,
  children 
}: LegalCardProps) {
  const isClickable = !!onClick;
  
  return (
    <div 
      className={cn(
        'legal-guide-card',
        isClickable && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        
        {variant === 'shareable' && onShare && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className="glass-card p-2 rounded-lg hover:bg-opacity-20 transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        )}
        
        {isClickable && (
          <ExternalLink className="w-4 h-4 text-white text-opacity-60" />
        )}
      </div>
      
      {content && variant === 'detailed' && (
        <div className="text-sm text-white text-opacity-90 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      )}
      
      {content && variant === 'base' && (
        <p className="text-sm text-white text-opacity-80 line-clamp-3">
          {content.substring(0, 150)}...
        </p>
      )}
      
      {children}
    </div>
  );
}
