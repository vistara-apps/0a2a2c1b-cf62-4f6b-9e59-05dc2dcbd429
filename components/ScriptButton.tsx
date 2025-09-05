'use client';

import { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/utils';

interface ScriptButtonProps {
  title: string;
  content: string;
  variant?: 'primary' | 'secondary' | 'lang';
  language?: string;
  className?: string;
}

export function ScriptButton({ 
  title, 
  content, 
  variant = 'primary', 
  language = 'en',
  className 
}: ScriptButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className={cn('script-button', className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-medium text-white">{title}</h4>
            {language !== 'en' && (
              <span className="text-xs text-white text-opacity-60 uppercase">
                {language}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleCopy}
          className={cn(
            'glass-card p-2 rounded-lg transition-all duration-200',
            copied ? 'bg-green-500 bg-opacity-20' : 'hover:bg-opacity-20'
          )}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
      
      <p className="text-sm text-white text-opacity-90 leading-relaxed">
        "{content}"
      </p>
    </div>
  );
}
