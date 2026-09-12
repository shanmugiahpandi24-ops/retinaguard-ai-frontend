import React from 'react';
import { Eye, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading RetinaGuard AI Workspace...',
  submessage = 'Connecting to neural inference services and verifying session security',
  fullScreen = true,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-6 flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute h-20 w-20 rounded-full border-2 border-brand-500/20 animate-ping opacity-75" />
        <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-brand-500/40 animate-spin" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600/30 to-brand-400/10 border border-brand-500/40 shadow-lg shadow-brand-500/20 backdrop-blur-md">
          <Eye className="h-7 w-7 text-brand-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white tracking-wide">{message}</h3>
      {submessage && <p className="mt-2 max-w-sm text-xs text-gray-400 leading-relaxed">{submessage}</p>}

      <div className="mt-6 flex items-center gap-2 text-xs font-mono text-brand-400/80">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>INITIALIZING SUBSYSTEMS</span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/95 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
};
