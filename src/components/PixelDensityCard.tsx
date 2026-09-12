import React from 'react';
import { Sliders, Activity, Disc, Zap, Maximize2 } from 'lucide-react';
import { PixelDensityMetrics } from '../types/api';

interface PixelDensityCardProps {
  metrics?: PixelDensityMetrics | null;
  className?: string;
}

export const PixelDensityCard: React.FC<PixelDensityCardProps> = ({ metrics, className = '' }) => {
  return (
    <div className={`rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-5 shadow-sm text-left ${className}`}>
      <div className="flex items-center justify-between border-b border-medical-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-brand-50 p-2 text-brand-primary border border-brand-primary/20">
            <Maximize2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brand-900">Anatomical & Pixel Density Optics</h4>
            <p className="text-[11px] text-medical-text-muted">Micron scaling & structural cup-to-disc ratio</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-brand-primary bg-brand-50 border border-brand-primary/20 px-2.5 py-0.5 rounded-full font-bold">
          300 DPI OPTICAL
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-2xl border border-medical-border bg-medical-bg p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono text-medical-text-muted block">Pixel Scale</span>
          <span className="text-base font-extrabold text-brand-900 font-mono block">
            {metrics?.micron_per_pixel || 5.2} <span className="text-xs font-normal text-brand-primary">μm/px</span>
          </span>
          <span className="text-[10px] text-medical-text-muted block">Microscopic pitch</span>
        </div>

        <div className="rounded-2xl border border-medical-border bg-medical-bg p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono text-medical-text-muted block">Vessel Density</span>
          <span className="text-base font-extrabold text-brand-900 font-mono block">
            {metrics?.vessel_density_pct || 14.2}%
          </span>
          <span className="text-[10px] text-medical-text-muted block">Vascular pixel ratio</span>
        </div>

        <div className="rounded-2xl border border-medical-border bg-medical-bg p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono text-medical-text-muted block">Cup-to-Disc Ratio</span>
          <span className="text-base font-extrabold text-brand-primary font-mono block">
            {metrics?.cup_to_disc_ratio || 0.38}
          </span>
          <span className="text-[10px] text-medical-text-muted block">Optic CDR estimation</span>
        </div>

        <div className="rounded-2xl border border-medical-border bg-medical-bg p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono text-medical-text-muted block">Foveal FAZ</span>
          <span className="text-base font-extrabold text-medgreen-primary font-mono block">
            {metrics?.foveal_zone_intact ? 'INTACT' : 'EVALUATED'}
          </span>
          <span className="text-[10px] text-medical-text-muted block">Avascular integrity</span>
        </div>
      </div>
    </div>
  );
};
