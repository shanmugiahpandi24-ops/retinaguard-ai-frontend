import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle, AlertCircle, Sparkles } from 'lucide-react';

export interface TimelineStage {
  id: string;
  name: string;
  description: string;
}

const STAGES: TimelineStage[] = [
  { id: 'validation', name: 'Image Validation', description: 'Encoding, resolution & format validation' },
  { id: 'fundus', name: 'Fundus Verification', description: 'Detecting optic disc & vascular geometry' },
  { id: 'quality', name: 'Image Quality Assessment', description: 'Evaluating Laplacian blur, illumination & contrast' },
  { id: 'cnn', name: 'CNN Classification', description: 'Multi-class diabetic retinopathy feature extraction' },
  { id: 'confidence', name: 'Confidence Check', description: 'Comparing predictive entropy to certainty threshold' },
  { id: 'gradcam', name: 'Grad-CAM Generation', description: 'Backpropagating gradients to final convolution layer' },
  { id: 'report', name: 'Report Generation', description: 'Synthesizing clinical findings & PDF export' },
];

interface ProcessingTimelineProps {
  currentStageIndex?: number;
  status?: 'processing' | 'rejected' | 'error' | 'complete';
  errorMessage?: string;
}

export const ProcessingTimeline: React.FC<ProcessingTimelineProps> = ({
  status = 'processing',
  errorMessage,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (status === 'complete') {
      setActiveStep(STAGES.length);
      return;
    }
    if (status === 'rejected') {
      setActiveStep(2); // Stopped at quality check
      return;
    }
    if (status === 'error') {
      return;
    }

    // Progression timer while waiting for backend API response
    const intervals = [400, 700, 1000, 1400, 1800, 2200];
    const timers: ReturnType<typeof setTimeout>[] = [];

    intervals.forEach((delay, idx) => {
      const t = setTimeout(() => {
        setActiveStep((prev) => Math.max(prev, idx + 1));
      }, delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [status]);

  const progressPct = Math.min(Math.round(((activeStep + 1) / STAGES.length) * 100), 100);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-dark-border/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-brand-500/10 p-1.5 text-brand-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <h4 className="text-sm font-semibold text-white tracking-wide uppercase">AI Diagnostic Pipeline</h4>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-peach">
            {progressPct}%
          </span>
          <span className="text-xs font-mono text-peach bg-peach-500/10 border border-peach-500/20 px-2 py-0.5 rounded-full font-bold">
            {status === 'processing' && 'INFERENCE ACTIVE'}
            {status === 'complete' && 'PIPELINE COMPLETE'}
            {status === 'rejected' && 'QUALITY GATE REJECTED'}
            {status === 'error' && 'PIPELINE ERROR'}
          </span>
        </div>
      </div>

      {/* Laser Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-dark border border-dark-border">
        <div
          className="h-full bg-gradient-to-r from-brand-700 via-brand-600 to-peach transition-all duration-500 shadow-[0_0_12px_#F4B183]"
          style={{ width: `${progressPct}%` }}
        />
        <div className="absolute inset-0 bg-white/10 animate-shimmer pointer-events-none" />
      </div>


      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          let state: 'completed' | 'active' | 'pending' | 'rejected' | 'error' = 'pending';

          if (status === 'rejected' && idx === 2) {
            state = 'rejected';
          } else if (status === 'rejected' && idx > 2) {
            state = 'pending';
          } else if (status === 'error' && idx === activeStep) {
            state = 'error';
          } else if (idx < activeStep || status === 'complete') {
            state = 'completed';
          } else if (idx === activeStep) {
            state = 'active';
          }

          return (
            <div
              key={stage.id}
              className={`flex items-start gap-4 rounded-xl border p-3.5 transition-all duration-300 ${
                state === 'active'
                  ? 'border-brand-500/40 bg-brand-500/10 shadow-lg shadow-brand-500/5'
                  : state === 'completed'
                  ? 'border-peach-500/20 bg-peach-500/5 text-gray-200'
                  : state === 'rejected'
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                  : state === 'error'
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                  : 'border-dark-border/40 bg-dark/20 text-gray-500 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {state === 'completed' && <CheckCircle2 className="h-5 w-5 text-peach" />}
                {state === 'active' && <Loader2 className="h-5 w-5 animate-spin text-brand-400" />}
                {state === 'rejected' && <AlertCircle className="h-5 w-5 text-rose-400" />}
                {state === 'error' && <AlertCircle className="h-5 w-5 text-rose-400" />}
                {state === 'pending' && <Circle className="h-5 w-5 text-gray-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-sm font-medium ${
                      state === 'active'
                        ? 'text-white'
                        : state === 'completed'
                        ? 'text-peach-300'
                        : state === 'rejected'
                        ? 'text-rose-300'
                        : state === 'error'
                        ? 'text-rose-300'
                        : 'text-gray-400'
                    }`}
                  >
                    {stage.name}
                  </p>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                    {state === 'completed' && 'PASSED'}
                    {state === 'active' && 'PROCESSING...'}
                    {state === 'rejected' && 'POOR QUALITY'}
                    {state === 'error' && 'FAILED'}
                    {state === 'pending' && 'WAITING'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <p className="font-semibold text-rose-200 mb-1">Pipeline Halt Details:</p>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
