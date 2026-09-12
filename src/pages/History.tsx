import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { ReportSummaryItem } from '../types/api';
import { HistoryTable } from '../components/HistoryTable';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { Clock, Plus } from 'lucide-react';
import { ParallaxCard } from '../components/ParallaxCard';

export const History: React.FC = () => {
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    reportsService
      .getReports()
      .then((data) => {
        setReports(data);
      })
      .catch(() => {
        setReports([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Compute severity distributions
  const counts = reports.reduce(
    (acc, cur) => {
      const s = (cur.severity || '').toLowerCase();
      if (s.includes('no dr')) acc.noDr += 1;
      else if (s.includes('mild')) acc.mild += 1;
      else if (s.includes('moderate')) acc.moderate += 1;
      else if (s.includes('severe')) acc.severe += 1;
      else if (s.includes('proliferative')) acc.proliferative += 1;
      else acc.rejected += 1;
      return acc;
    },
    { noDr: 0, mild: 0, moderate: 0, severe: 0, proliferative: 0, rejected: 0 }
  );

  const handleDeleteReport = (assessmentId: string) => {
    setReports((prev) => prev.filter((r) => r.assessment_id !== assessmentId));
  };

  const handleClearRejected = async () => {
    if (!window.confirm('Are you sure you want to delete all rejected screening records?')) return;
    const rejectedItems = reports.filter((r) => r.quality_status === 'POOR' || !r.severity);
    setReports((prev) => prev.filter((r) => r.quality_status !== 'POOR' && r.severity));
    for (const r of rejectedItems) {
      try {
        await reportsService.deleteReport(r.assessment_id);
      } catch {}
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#1677C8] uppercase tracking-wider font-bold">
            <Clock className="h-3.5 w-3.5" /> Longitudinal Audit Trail
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider mt-1">
            <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
              SCREENING ASSESSMENT HISTORY
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Complete database record of all processed retinal fundus examinations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {counts.rejected > 0 && (
            <button
              onClick={handleClearRejected}
              className="rounded-2xl border border-[#FCA5A5] bg-[#FFF0F0] px-4 py-3 text-xs font-bold text-[#D9534F] hover:bg-[#FFE5E5] transition"
              title="Bulk remove rejected records"
            >
              Clear Rejected Records ({counts.rejected})
            </button>
          )}
          <button
            onClick={() => navigate('/screening')}
            className="flex items-center gap-2 rounded-2xl bg-[#0B4A7A] hover:bg-[#083B63] px-5 py-3 text-xs md:text-sm font-bold text-white transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Screening</span>
          </button>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      {reports.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <ParallaxCard depth={10} tiltAmount={6}>
            <div className="rounded-xl border border-[#B2E3C6] bg-[#EAF8F1] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-[#249B68] block">No DR</span>
              <span className="text-xl font-bold text-[#249B68] font-mono mt-0.5 block">{counts.noDr}</span>
            </div>
          </ParallaxCard>

          <ParallaxCard depth={14} tiltAmount={6}>
            <div className="rounded-xl border border-[#FED7AA] bg-[#FFF4E3] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-[#F4A340] block">Mild DR</span>
              <span className="text-xl font-bold text-[#F4A340] font-mono mt-0.5 block">{counts.mild}</span>
            </div>
          </ParallaxCard>

          <ParallaxCard depth={12} tiltAmount={6}>
            <div className="rounded-xl border border-[#FDBA74] bg-[#FFF4E3] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-[#F4A340] block">Moderate DR</span>
              <span className="text-xl font-bold text-[#F4A340] font-mono mt-0.5 block">{counts.moderate}</span>
            </div>
          </ParallaxCard>

          <ParallaxCard depth={16} tiltAmount={6}>
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FFF0F0] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-[#D9534F] block">Severe DR</span>
              <span className="text-xl font-bold text-[#D9534F] font-mono mt-0.5 block">{counts.severe}</span>
            </div>
          </ParallaxCard>

          <ParallaxCard depth={18} tiltAmount={6}>
            <div className="rounded-xl border border-[#D9534F] bg-[#D9534F] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-white block">Proliferative</span>
              <span className="text-xl font-bold text-white font-mono mt-0.5 block">{counts.proliferative}</span>
            </div>
          </ParallaxCard>

          <ParallaxCard depth={10} tiltAmount={6}>
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FFF0F0] p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-[#D9534F] block">Rejected Quality</span>
              <span className="text-xl font-bold text-[#D9534F] font-mono mt-0.5 block">{counts.rejected}</span>
            </div>
          </ParallaxCard>
        </div>
      )}

      {/* Main Table with Parallax */}
      <ParallaxCard depth={8} tiltAmount={2}>
        <HistoryTable reports={reports} loading={loading} onDelete={handleDeleteReport} />
      </ParallaxCard>

      {/* Safety Notice */}
      <ParallaxCard depth={6} tiltAmount={2}>
        <SafetyDisclaimer />
      </ParallaxCard>
    </div>
  );
};
