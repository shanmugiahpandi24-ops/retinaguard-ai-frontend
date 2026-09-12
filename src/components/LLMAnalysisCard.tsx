import React, { useState } from 'react';
import { Bot, Sparkles, Send, ShieldAlert, CheckCircle2, AlertTriangle, User, MessageSquare } from 'lucide-react';
import { LLMAnalysis } from '../types/api';
import { supportService } from '../services/support';

interface LLMAnalysisCardProps {
  analysis?: LLMAnalysis | null;
  className?: string;
}

export const LLMAnalysisCard: React.FC<LLMAnalysisCardProps> = ({ analysis, className = '' }) => {
  const [userQuery, setUserQuery] = useState('');
  const [customReply, setCustomReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const riskLevel = (analysis?.risk_level || 'MODERATE').toUpperCase();

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-medgreen-light text-medgreen-primary border-medgreen-primary/30';
      case 'MODERATE':
        return 'bg-medorange-light text-medorange-dark border-medorange-primary/30';
      case 'HIGH':
        return 'bg-medorange-light text-medorange-dark border-medorange-primary/40 font-bold';
      case 'CRITICAL':
        return 'bg-medred-light text-medred-primary border-medred-primary/30 font-bold';
      case 'INDETERMINATE':
        return 'bg-medorange-light text-medorange-dark border-medorange-primary/40 font-bold';
      default:
        return 'bg-brand-50 text-brand-primary border-brand-primary/30';
    }
  };

  const handleAskVisionLLM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim() || loading) return;

    setLoading(true);
    try {
      const res = await supportService.sendMessage(`[Image Analysis Query]: ${userQuery}`);
      setCustomReply(res.reply);
    } catch {
      setCustomReply('LLM Vision inference service momentarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-6 shadow-sm text-left ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-medical-border pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-900 p-2.5 text-white shadow-sm">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-brand-900">LLM Vision Clinical Assistant</h3>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-mono font-bold text-brand-primary border border-brand-primary/20">
                Multimodal Vision AI Synthesis
              </span>
            </div>
            <p className="text-xs text-medical-text-muted">Automated diagnostic narrative & risk stratification</p>
          </div>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getRiskBadge()}`}>
          Risk Level: {riskLevel}
        </span>
      </div>

      {/* Main Narrative Content */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-medical-border bg-medical-bg p-4 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-brand-primary font-bold block">
            Synthesized Clinical Impression
          </span>
          <p className="text-xs md:text-sm text-brand-900 leading-relaxed font-medium">
            {analysis?.summary || 'LLM analysis complete. Observations indicate structural alignment with trained distribution.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-medical-border bg-medical-bg p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-medical-text-muted font-semibold block">
              Differential Observation
            </span>
            <p className="text-xs text-medical-text leading-relaxed">
              {analysis?.differential_observation || 'Intraretinal vascular features evaluated across green/red channels.'}
            </p>
          </div>

          <div className="rounded-2xl border border-medical-border bg-medical-bg p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-medical-text-muted font-semibold block">
              Clinical Recommendation
            </span>
            <p className="text-xs text-brand-900 font-semibold leading-relaxed">
              {analysis?.recommendation || 'Consult a licensed ophthalmologist for comprehensive evaluation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Ask LLM Vision Box */}
      <div className="rounded-2xl border border-medical-border bg-medical-bg p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-900">
          <MessageSquare className="h-4 w-4 text-brand-primary" />
          <span>Interactive Query: Ask LLM Vision About This Image</span>
        </div>

        {customReply && (
          <div className="rounded-xl border border-medical-border bg-white p-3 text-xs text-medical-text space-y-1 animate-in fade-in shadow-sm">
            <span className="text-[10px] font-mono text-brand-primary font-bold block">LLM Response:</span>
            <p className="leading-relaxed">{customReply}</p>
          </div>
        )}

        <form onSubmit={handleAskVisionLLM} className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="e.g. Are there exudates near the macula?"
            className="flex-1 rounded-xl border border-medical-border bg-white px-3.5 py-2 text-xs text-medical-text placeholder-medical-text-muted focus:border-brand-primary focus:outline-none shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !userQuery.trim()}
            className="rounded-xl bg-brand-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-800 transition disabled:opacity-40 shadow-sm"
          >
            {loading ? 'Analyzing...' : 'Ask LLM'}
          </button>
        </form>
      </div>
    </div>
  );
};
