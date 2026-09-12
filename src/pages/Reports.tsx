import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { ReportSummaryItem } from '../types/api';
import { FileText, Download, Eye, Plus, Search, Calendar, ShieldCheck, Trash2 } from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { formatDate, formatPercent, getSeverityColor, getQualityBadge } from '../utils/formatters';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    reportsService
      .getReports()
      .then((data) => setReports(data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDownloadingId(id);
    try {
      await reportsService.triggerPdfDownload(id);
    } catch {
      alert(`Failed to download report PDF for ${id}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteReport = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm(`Delete assessment report ${id}?`)) return;
    try {
      await reportsService.deleteReport(id);
      setReports((prev) => prev.filter((r) => r.assessment_id !== id));
    } catch {
      alert(`Failed to delete report ${id}`);
    }
  };


  const filtered = reports.filter((r) =>
    r.assessment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.severity && r.severity.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4E7EC] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#1565C0] uppercase tracking-wider font-bold">
            <FileText className="h-3.5 w-3.5" /> Assessment Documentation
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider mt-1">
            <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
              CLINICAL REPORTS
            </span>
          </h1>
          <p className="text-xs text-[#667085] mt-1">
            Access, view, and export PDF reports for completed retinal screenings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/screening')}
            className="flex items-center gap-2 rounded-2xl bg-[#0D3B66] hover:bg-[#1565C0] px-5 py-3 text-xs md:text-sm font-bold text-white transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>+ New Screening</span>
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search reports by ID or severity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#D9E2EC] bg-[#FFFFFF] pl-10 pr-4 py-2.5 text-xs text-[#172033] placeholder-[#98A2B3] focus:border-[#1565C0] focus:outline-none"
          />
        </div>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-[#667085]">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#1565C0] border-t-transparent mb-2" />
          <p>Loading reports repository...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-[#D9E2EC] bg-[#FFFFFF] p-12 text-center space-y-3 shadow-sm">
          <FileText className="h-12 w-12 text-[#98A2B3] mx-auto" />
          <h3 className="text-base font-bold text-[#172033]">No reports available</h3>
          <p className="text-xs text-[#667085] max-w-sm mx-auto">
            {searchTerm ? 'No reports matched your search term.' : 'Perform an assessment to generate clinical documentation.'}
          </p>
          <button
            onClick={() => navigate('/screening')}
            className="mt-2 rounded-xl bg-[#0D3B66] hover:bg-[#1565C0] px-5 py-2.5 text-xs font-semibold text-white transition shadow-sm"
          >
            Start Screening
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((rep) => {
            const severityStyle = getSeverityColor(rep.severity);
            const qualityStyle = getQualityBadge(rep.quality_status);
            const isRejected = rep.quality_status === 'POOR' || !rep.severity;

            return (
              <div
                key={rep.assessment_id}
                onClick={() => navigate(`/reports/${rep.assessment_id}`)}
                className="rounded-3xl border border-[#D9E2EC] bg-[#FFFFFF] p-6 flex flex-col justify-between hover:border-[#1565C0] transition duration-200 cursor-pointer shadow-sm group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-[#1565C0]">
                      <FileText className="h-4 w-4" />
                      <span className="font-mono text-xs font-bold text-[#0D3B66] group-hover:text-[#1565C0] transition">
                        {rep.assessment_id}
                      </span>
                    </div>
                    <span className="rounded-full bg-[#F7F9FC] border border-[#E4E7EC] px-2 py-0.5 text-[10px] font-mono text-[#667085]">
                      {formatDate(rep.date)}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <span className="text-[11px] text-[#667085] uppercase tracking-wider block font-semibold">Grading Output</span>
                    <div className="flex items-center gap-2">
                      {rep.severity ? (
                        <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${severityStyle.bg} ${severityStyle.text} border ${severityStyle.border}`}>
                          {rep.severity}
                        </span>
                      ) : (
                        <span className="text-xs text-[#D32F2F] font-semibold italic">Quality Rejected</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-[#E4E7EC] pt-3">
                    <div>
                      <span className="text-[10px] text-[#667085] block font-medium">Confidence:</span>
                      <span className="font-mono font-bold text-[#172033]">
                        {rep.confidence !== null && rep.confidence !== undefined ? formatPercent(rep.confidence) : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#667085] block font-medium">Quality Score:</span>
                      <span className="font-mono font-bold text-[#172033]">
                        {formatPercent(rep.quality_score)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4E7EC] flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${isRejected ? 'bg-[#FDECEC] text-[#D32F2F] border border-[#FCA5A5]' : 'bg-[#E8F1FF] text-[#1565C0] border border-[#B9D5FF]'}`}>
                    {isRejected ? 'REJECTED' : 'READY'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDownload(e, rep.assessment_id)}
                      disabled={downloadingId === rep.assessment_id}
                      className="flex items-center gap-1 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] px-3 py-1.5 text-xs font-semibold text-[#0D3B66] hover:bg-[#E8F1FF] transition disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{downloadingId === rep.assessment_id ? 'Downloading...' : 'PDF'}</span>
                    </button>
                    <button
                      onClick={() => navigate(`/reports/${rep.assessment_id}`)}
                      className="rounded-xl border border-[#D9E2EC] bg-[#F7F9FC] p-2 text-[#0D3B66] hover:bg-[#E8F1FF] transition"
                      title="View Report"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteReport(e, rep.assessment_id)}
                      className="rounded-xl border border-[#FCA5A5] bg-[#FDECEC] p-2 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"
                      title="Delete Report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety Notice */}
      <SafetyDisclaimer />
    </div>
  );
};
