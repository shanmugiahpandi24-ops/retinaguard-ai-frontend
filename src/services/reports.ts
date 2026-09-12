import { api } from './api';
import { ReportSummaryItem, PredictionResponse } from '../types/api';

export const reportsService = {
  async getReports(): Promise<ReportSummaryItem[]> {
    const res = await api.get('/reports');
    if (res.data && Array.isArray(res.data.reports)) {
      return res.data.reports;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  },

  async getReport(assessmentId: string): Promise<PredictionResponse | null> {
    try {
      const res = await api.get(`/reports/${assessmentId}`);
      return res.data;
    } catch {
      // Graceful fallback if backend does not implement single report endpoint
      const list = await this.getReports();
      const item = list.find((r) => r.assessment_id === assessmentId);
      if (item) {
        return {
          success: true,
          assessment_id: item.assessment_id,
          prediction_status: item.severity ? 'PREDICTED' : (item.quality_status === 'POOR' ? 'REJECTED' : 'UNCERTAIN'),
          quality: {
            status: item.quality_status,
            score: item.quality_score,
          },
          prediction: item.severity
            ? {
                class_name: item.severity,
                class_id: 0,
                confidence: item.confidence ?? 0,
                probabilities: { [item.severity]: item.confidence ?? 0 },
              }
            : undefined,
          created_at: item.date,
        };
      }
      return null;
    }
  },

  async downloadReportPdf(assessmentId: string): Promise<Blob> {
    const res = await api.get(`/reports/${assessmentId}/download`, {
      responseType: 'blob',
    });
    return res.data;
  },

  async triggerPdfDownload(assessmentId: string): Promise<void> {
    const blob = await this.downloadReportPdf(assessmentId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RetinaGuard_Report_${assessmentId}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 150);
  },

  async deleteReport(assessmentId: string): Promise<boolean> {
    try {
      await api.delete(`/reports/${assessmentId}`);
      return true;
    } catch {
      return false;
    }
  },
};



export const reports = reportsService;
