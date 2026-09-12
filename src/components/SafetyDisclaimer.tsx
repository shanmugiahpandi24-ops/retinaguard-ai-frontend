import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

interface SafetyDisclaimerProps {
  compact?: boolean;
  className?: string;
}

export const SafetyDisclaimer: React.FC<SafetyDisclaimerProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <div className={`flex items-center gap-2 rounded-xl border border-medorange-primary/30 bg-medorange-light px-3 py-2 text-xs text-medorange-dark ${className}`}>
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-medorange-dark" />
        <span>
          <strong>Research/Screening Demonstration:</strong> Not a clinical diagnosis. Consult a qualified ophthalmologist.
        </span>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Safety Notice" className={`relative overflow-hidden rounded-2xl border border-medorange-primary/30 bg-medorange-light p-5 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-medorange-primary/30 bg-white p-2.5 text-medorange-dark shrink-0 mt-0.5 shadow-sm">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-medorange-dark tracking-wide">CLINICAL SAFETY DISCLAIMER</h4>
            <span className="rounded bg-white border border-medorange-primary/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-medorange-dark">Demonstration Only</span>
          </div>
          <p className="text-medorange-dark/90 leading-relaxed text-xs md:text-sm">
            EYESCREEN AI is an AI-assisted screening and research platform designed to evaluate retinal fundus photography. It is <strong>NOT a definitive medical diagnosis</strong>. AI model confidence does not substitute for clinical evaluation by a licensed ophthalmologist or eye-care professional. Never alter or discontinue prescribed diabetic treatment without clinical consultation.
          </p>
        </div>
      </div>
    </aside>
  );
};

export const Disclaimer = SafetyDisclaimer;
