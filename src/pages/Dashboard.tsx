import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Activity,
  ShieldCheck,
  Clock,
  FileText,
  Cpu,
  ArrowRight,
  Eye
} from 'lucide-react';
import { reportsService } from '../services/reports';
import { predictionService } from '../services/prediction';
import { ReportSummaryItem, SystemHealth } from '../types/api';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { formatDate, formatPercent, getSeverityColor, getQualityBadge } from '../utils/formatters';
import { ParallaxCard } from '../components/ParallaxCard';

export const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      reportsService.getReports().catch(() => []),
      predictionService.getHealth().catch(() => null),
    ]).then(([reportsData, healthData]) => {
      if (isMounted) {
        setReports(reportsData);
        setHealth(healthData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalAssessments = reports.length;
  const latest = reports.length > 0 ? reports[0] : null;
  const latestSeverity = getSeverityColor(latest?.severity);
  const latestQuality = getQualityBadge(latest?.quality_status);

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto text-left">
      {/* Welcome & Action Banner */}
      <ParallaxCard depth={12} tiltAmount={4}>
        <div className="relative overflow-hidden rounded-3xl border border-[#CBD5E1] bg-gradient-to-r from-white via-[#F4F9FE] to-[#EAF5FF] p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
          {/* Subtle background abstract eye/retinal visual motif */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
            <svg className="w-full h-full text-[#0B4A7A]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="55" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="100" cy="100" r="28" fill="currentColor" fillOpacity="0.25" />
              <path d="M15 100 Q100 25 185 100 Q100 175 15 100 Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono text-[#0B4A7A] bg-[#EAF5FF] border border-[#BAE6FD] shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-[#249B68] animate-pulse" />
                LIVE PIPELINE ACTIVE
              </span>
              <span className="text-[11px] font-mono text-[#64748B] font-semibold hidden sm:inline-block">
                EfficientNet-B0 CNN
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider">
              <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
                SCREENING DASHBOARD
              </span>
            </h1>
            <p className="text-xs md:text-sm text-[#475569] max-w-xl font-normal leading-relaxed">
              Real-time status of convolutional fundus grading pipelines and historical assessment logs.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <button
              onClick={() => navigate('/screening')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0B4A7A] to-[#1677C8] hover:from-[#083B63] hover:to-[#0B4A7A] px-5 py-3 text-xs font-extrabold text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
            >
              <Plus className="h-4.5 w-4.5 group-hover:rotate-90 transition duration-300" />
              <span>New Screening</span>
            </button>
          </div>
        </div>
      </ParallaxCard>

      {/* Overview Stat Cards Grid with Interactive 3D Parallax */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Screenings */}
        <ParallaxCard depth={14} tiltAmount={8} className="h-full">
          <div className="rounded-2xl border border-[#DCE7F2] border-t-4 border-t-[#0B4A7A] bg-white p-5 flex flex-col justify-between hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md h-full">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>Total Screenings</span>
              <div className="rounded-xl bg-[#EAF5FF] p-2 text-[#0B4A7A] shadow-2xs">
                <Activity className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2.5xl font-black text-[#0B4A7A] font-mono leading-none">{loading ? '—' : totalAssessments}</p>
              <span className="text-[11px] text-[#64748B] mt-2 block font-medium">Completed Assessments</span>
            </div>
          </div>
        </ParallaxCard>

        {/* Latest Severity */}
        <ParallaxCard depth={18} tiltAmount={8} className="h-full">
          <div className="rounded-2xl border border-[#DCE7F2] border-t-4 border-t-[#F4A340] bg-white p-5 flex flex-col justify-between hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md h-full">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>Latest Severity</span>
              <div className="rounded-xl bg-[#FFF4E3] p-2 text-[#F4A340] shadow-2xs">
                <Eye className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                {latest?.severity ? (
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${latestSeverity.bg} ${latestSeverity.text} border ${latestSeverity.border} shadow-2xs`}>
                    {latest.severity}
                  </span>
                ) : (
                  <span className="text-base font-bold text-[#64748B] font-mono">
                    {loading ? '—' : 'None yet'}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748B] mt-2 block font-mono">
                {latest ? `ID: ${latest.assessment_id.slice(0, 10)}...` : 'Run screening'}
              </span>
            </div>
          </div>
        </ParallaxCard>

        {/* Latest Confidence */}
        <ParallaxCard depth={12} tiltAmount={8} className="h-full">
          <div className="rounded-2xl border border-[#DCE7F2] border-t-4 border-t-[#1677C8] bg-white p-5 flex flex-col justify-between hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md h-full">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>Latest Confidence</span>
              <div className="rounded-xl bg-[#EAF5FF] p-2 text-[#1677C8] shadow-2xs">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2.5xl font-black text-[#0B4A7A] font-mono leading-none">
                {latest?.confidence !== null && latest?.confidence !== undefined
                  ? formatPercent(latest.confidence)
                  : '—'}
              </p>
              <span className="text-[11px] text-[#64748B] mt-2 block font-medium">Model statistical confidence</span>
            </div>
          </div>
        </ParallaxCard>

        {/* Latest Image Quality */}
        <ParallaxCard depth={20} tiltAmount={8} className="h-full">
          <div className="rounded-2xl border border-[#DCE7F2] border-t-4 border-t-[#249B68] bg-white p-5 flex flex-col justify-between hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md h-full">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>Latest Quality</span>
              <div className="rounded-xl bg-[#EAF8F1] p-2 text-[#249B68] shadow-2xs">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                {latest ? (
                  <span className={`rounded-lg px-2.5 py-1 text-xs font-extrabold ${latestQuality.bg} ${latestQuality.text} border ${latestQuality.border} shadow-2xs`}>
                    {latest.quality_status}
                  </span>
                ) : (
                  <span className="text-base font-bold text-[#64748B] font-mono">
                    {loading ? '—' : 'None yet'}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-[#64748B] mt-2 block font-medium">
                {latest ? `Score: ${formatPercent(latest.quality_score)}` : 'Pre-inference gate'}
              </span>
            </div>
          </div>
        </ParallaxCard>

        {/* Backend & Diagnostics */}
        <ParallaxCard depth={16} tiltAmount={8} className="h-full">
          <div className="rounded-2xl border border-[#DCE7F2] border-t-4 border-t-[#6366F1] bg-white p-5 flex flex-col justify-between hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md h-full">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
              <span>AI Subsystem</span>
              <div className="rounded-xl bg-[#EEF2FF] p-2 text-[#6366F1] shadow-2xs">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${health?.status === 'healthy' ? 'bg-[#249B68] animate-pulse' : 'bg-[#F4A340]'}`} />
                <span className="text-base font-extrabold text-[#0B4A7A] font-mono uppercase tracking-tight">
                  {health?.status || 'ONLINE'}
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] mt-2 block font-mono truncate" title={health?.model_architecture || 'efficientnet_b0'}>
                Arch: EfficientNet-B0
              </span>
            </div>
          </div>
        </ParallaxCard>
      </div>

      {/* Recent Assessments Table */}
      <ParallaxCard depth={8} tiltAmount={2}>
        <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 md:p-8 space-y-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[#0B4A7A] tracking-tight">Recent Assessments</h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F8FBFF] border border-[#DCE7F2] text-[10px] font-mono font-bold text-[#0B4A7A]">
                  <Activity className="h-3 w-3 text-[#249B68]" /> REAL-TIME AUDIT LOG
                </span>
              </div>
              <p className="text-xs text-[#64748B]">Most recent AI fundus screening records from database</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-[#F8FBFF] px-4 py-2 text-xs font-extrabold text-[#0B4A7A] hover:bg-[#EAF5FF] hover:border-[#0B4A7A] transition shadow-2xs"
            >
              <span>View Full History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#64748B]">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#0B4A7A] border-t-transparent mb-2" />
              <p>Fetching clinical records...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-14 text-center space-y-3">
              <FileText className="h-10 w-10 text-[#64748B] mx-auto" />
              <h4 className="text-sm font-semibold text-[#16324F]">No screening assessments recorded yet</h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Get started by uploading a high-resolution retinal fundus photograph to initiate CNN classification.
              </p>
              <button
                onClick={() => navigate('/screening')}
                className="mt-3 rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] px-5 py-2.5 text-xs font-bold text-white transition shadow-sm"
              >
                Start First Screening
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1E293B]">
                <thead className="border-b border-[#DCE7F2] text-[11px] font-bold uppercase tracking-wider text-[#475569] bg-gradient-to-r from-[#F8FBFF] to-[#EAF5FF]">
                  <tr>
                    <th className="py-3.5 px-4">Assessment ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Confidence</th>
                    <th className="py-3.5 px-4">Quality</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {reports.slice(0, 6).map((rep) => {
                    const severityStyle = getSeverityColor(rep.severity);
                    const qualityStyle = getQualityBadge(rep.quality_status);
                    const isRejected = rep.quality_status === 'POOR' || !rep.severity;

                    return (
                      <tr
                        key={rep.assessment_id}
                        onClick={() => navigate(`/reports/${rep.assessment_id}`)}
                        className="hover:bg-[#F4F9FE] transition cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-extrabold text-xs text-[#0B4A7A] bg-[#EAF5FF] px-2.5 py-1 rounded-lg border border-[#BAE6FD] group-hover:bg-[#0B4A7A] group-hover:text-white transition duration-200 shadow-2xs">
                            {rep.assessment_id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#64748B] whitespace-nowrap">
                          {formatDate(rep.date)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {rep.severity ? (
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border} shadow-2xs`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${severityStyle.dot}`} />
                              {rep.severity}
                            </span>
                          ) : (
                            <span className="text-[#64748B] italic font-medium">No Prediction (Rejected)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-[#0B4A7A]">
                          {rep.confidence !== null && rep.confidence !== undefined
                            ? formatPercent(rep.confidence)
                            : 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`rounded-md px-2.5 py-0.5 text-[11px] font-bold border ${qualityStyle.bg} ${qualityStyle.text} ${qualityStyle.border}`}>
                            {rep.quality_status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${isRejected ? 'bg-[#FFF0F0] text-[#D9534F] border border-[#FECACA]' : 'bg-[#EAF5FF] text-[#0B4A7A] border border-[#BAE6FD]'}`}>
                            {isRejected ? 'REJECTED' : 'PREDICTED'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/reports/${rep.assessment_id}`);
                            }}
                            className="rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-3.5 py-1.5 text-xs font-bold text-[#0B4A7A] hover:bg-[#0B4A7A] hover:text-white transition shadow-2xs"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ParallaxCard>

      {/* Safety Notice */}
      <ParallaxCard depth={6} tiltAmount={2}>
        <SafetyDisclaimer />
      </ParallaxCard>
    </div>
  );
};
