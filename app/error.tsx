'use client';

import { Shield, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card-strong p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        
        <p className="text-white text-opacity-80 mb-6">
          We encountered an error while loading RightsSphere. This might be a temporary issue.
        </p>
        
        <button
          onClick={reset}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
        
        <div className="mt-6 text-sm text-white text-opacity-60">
          <p>If the problem persists, please contact support.</p>
          {error.digest && (
            <p className="mt-2 font-mono text-xs">Error ID: {error.digest}</p>
          )}
        </div>
      </div>
    </div>
  );
}
