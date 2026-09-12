import React from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, SlidersHorizontal, Info } from 'lucide-react';
import { QualityResult } from '../types/api';
import { formatPercent } from '../utils/formatters';

interface QualityCardProps {
  quality?: QualityResult | null;
  className?: string;
}

export const QualityCard: React.FC<QualityCardProps> = ({ quality, className = '' }) => {
  const isGood = quality?.status?.toUpperCase() === 'GOOD';
  const scorePercent = formatPercent(quality?.score);

  return (
    <div className={`rounded-2xl border ${isGood ? 'border-medgreen-primary/30 bg-medgreen-light' : 'border-medred-primary/30 bg-medred-light'} p-6 flex flex-col justify-between shadow-sm ${className}`}>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-medical-text-muted">Pre-Inference Quality Gate</span>
          <div className="flex items-center gap-1.5 rounded-full bg-white border border-medical-border px-2.5 py-1 text-[11px] text-medical-text font-medium shadow-sm">
            <SlidersHorizontal className="h-3 w-3 text-brand-primary" />
            <span>Checked First</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className={`rounded-xl p-2.5 ${isGood ? 'bg-medgreen-primary/10 text-medgreen-primary border border-medgreen-primary/20' : 'bg-medred-primary/10 text-medred-primary border border-medred-primary/20'}`}>
            {isGood ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <span className="text-xs text-medical-text-muted">Quality Assessment</span>
            <h3 className={`text-2xl font-black tracking-tight ${isGood ? 'text-medgreen-primary' : 'text-medred-primary'}`}>
              {quality?.status || 'UNKNOWN'}
            </h3>
          </div>
        </div>

        <div className="mt-5 space-y-2 pt-4 border-t border-medical-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-medical-text-muted font-medium">Composite Clarity Score:</span>
            <span className="font-mono font-bold text-brand-900 text-sm">{scorePercent}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white overflow-hidden border border-medical-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isGood ? 'bg-medgreen-primary' : 'bg-medred-primary'}`}
              style={{ width: scorePercent }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-medical-text-muted">
            <span>Threshold: 70.0%</span>
            <span className="font-medium">{isGood ? 'Exceeds Safety Threshold' : 'Below Safety Threshold'}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-white p-2.5 text-[11px] text-medical-text-muted border border-medical-border shadow-sm">
        <Info className="h-3.5 w-3.5 text-brand-primary shrink-0 mt-0.5" />
        <span>
          EYESCREEN AI verifies Laplacian focus, vascular illumination, and contrast <em>before</em> DR classification.
        </span>
      </div>
    </div>
  );
};
