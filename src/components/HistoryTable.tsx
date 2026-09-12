import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportSummaryItem } from '../types/api';
import { formatDate, formatPercent, getSeverityColor, getQualityBadge, getPredictionStatusBadge } from '../utils/formatters';
import { FileText, Download, Search, Eye, Filter, Trash2, Check, X } from 'lucide-react';
import { reportsService } from '../services/reports';

interface HistoryTableProps {
  reports: ReportSummaryItem[];
  loading?: boolean;
  onDelete?: (assessmentId: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ reports, loading = false, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDownload = async (e: React.MouseEvent, assessmentId: string) => {
    e.stopPropagation();
    setDownloadingId(assessmentId);
    try {
      await reportsService.triggerPdfDownload(assessmentId);
    } catch {
      alert(`Failed to download report for ${assessmentId}`);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, assessmentId: string) => {
    e.stopPropagation();
    setDeletingId(assessmentId);
    try {
      const ok = await reportsService.deleteReport(assessmentId);
      if (ok && onDelete) {
        onDelete(assessmentId);
      }
    } catch {
      alert(`Failed to delete assessment ${assessmentId}`);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };


  const filtered = reports.filter((item) => {
    const matchesSearch = item.assessment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.severity && item.severity.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = severityFilter === 'ALL' || (item.severity && item.severity.toUpperCase().includes(severityFilter));
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search by Assessment ID or Severity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#D9E2EC] bg-[#FFFFFF] pl-10 pr-4 py-2.5 text-xs text-[#172033] placeholder-[#98A2B3] focus:border-[#1565C0] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-[#667085]" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-[#D9E2EC] bg-[#FFFFFF] px-3 py-2 text-xs text-[#172033] focus:border-[#1565C0] focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="NO DR">No DR</option>
            <option value="MILD">Mild DR</option>
            <option value="MODERATE">Moderate DR</option>
            <option value="SEVERE">Severe DR</option>
            <option value="PROLIFERATIVE">Proliferative DR</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-[#D9E2EC] bg-[#FFFFFF] overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-sm text-[#667085]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#1565C0] border-t-transparent mb-3" />
            <p>Loading assessment records from backend...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <div className="rounded-full bg-[#F7F9FC] border border-[#D9E2EC] h-14 w-14 mx-auto flex items-center justify-center text-[#667085]">
              <FileText className="h-7 w-7" />
            </div>
            <p className="text-[#172033] font-semibold">No assessment history found</p>
            <p className="text-xs text-[#667085]">Run a new screening or clear your current search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E4E7EC] bg-[#F7F9FC] text-[11px] font-mono uppercase tracking-wider text-[#667085]">
                <tr>
                  <th className="py-3.5 px-4 font-medium">Assessment ID</th>
                  <th className="py-3.5 px-4 font-medium">Screening Date</th>
                  <th className="py-3.5 px-4 font-medium">Retinopathy Severity</th>
                  <th className="py-3.5 px-4 font-medium">Confidence</th>
                  <th className="py-3.5 px-4 font-medium">Quality Gate</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {filtered.map((item) => {
                  const severityStyle = getSeverityColor(item.severity);
                  const qualityStyle = getQualityBadge(item.quality_status);
                  const isRejected = item.quality_status === 'POOR' || !item.severity;

                  return (
                    <tr
                      key={item.assessment_id}
                      onClick={() => navigate(`/reports/${item.assessment_id}`)}
                      className="hover:bg-[#F2F7FF] transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0D3B66] group-hover:text-[#1565C0] transition">
                        {item.assessment_id}
                      </td>
                      <td className="py-3.5 px-4 text-[#475467] whitespace-nowrap">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.severity ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${severityStyle.dot}`} />
                            {item.severity}
                          </span>
                        ) : (
                          <span className="text-[#98A2B3] italic">No prediction (Rejected)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#172033]">
                        {item.confidence !== null && item.confidence !== undefined
                          ? formatPercent(item.confidence)
                          : 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${qualityStyle.bg} ${qualityStyle.text} ${qualityStyle.border}`}>
                          {item.quality_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isRejected ? 'bg-[#FDECEC] text-[#D32F2F] border border-[#FCA5A5]' : 'bg-[#E8F1FF] text-[#1565C0] border border-[#B9D5FF]'}`}>
                          {isRejected ? 'REJECTED' : 'PREDICTED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/reports/${item.assessment_id}`)}
                            className="rounded-lg border border-[#D9E2EC] bg-[#FFFFFF] p-1.5 text-[#0D3B66] hover:bg-[#E8F1FF] transition"
                            title="View Report Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleDownload(e, item.assessment_id)}
                            disabled={downloadingId === item.assessment_id}
                            className="rounded-lg border border-[#D9E2EC] bg-[#FFFFFF] p-1.5 text-[#0D3B66] hover:bg-[#E8F1FF] transition disabled:opacity-50"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>

                          {confirmDeleteId === item.assessment_id ? (
                            <div className="flex items-center gap-1.5 bg-[#FDECEC] border border-[#FCA5A5] rounded-lg px-2 py-1 animate-in fade-in">
                              <span className="text-[10px] text-[#D32F2F] font-bold">Delete?</span>
                              <button
                                onClick={(e) => handleDelete(e, item.assessment_id)}
                                disabled={deletingId === item.assessment_id}
                                className="rounded bg-[#D32F2F] p-1 text-white hover:bg-[#9B1C1C] transition"
                                title="Confirm Delete"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDeleteId(null);
                                }}
                                className="rounded bg-[#FFFFFF] border border-[#D9E2EC] p-1 text-[#667085] hover:text-[#172033] transition"
                                title="Cancel"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(item.assessment_id);
                              }}
                              className="rounded-lg border border-[#FCA5A5] bg-[#FDECEC] p-1.5 text-[#D32F2F] hover:bg-[#D32F2F] hover:text-white transition"
                              title="Delete Record"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
