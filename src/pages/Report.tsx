import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { PredictionResponse } from '../types/api';
import { ReportCard } from '../components/ReportCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const Report: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (assessmentId) {
      setLoading(true);
      reportsService
        .getReport(assessmentId)
        .then((res) => {
          if (res) {
            setData(res);
          } else {
            setError('Report not found for this assessment ID.');
          }
        })
        .catch(() => {
          setError('Failed to load report from server.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assessmentId]);

  if (loading) {
    return (
      <LoadingScreen
        message="Compiling Clinical Report..."
        submessage="Assembling neural probabilities, quality metrics, and explainability heatmaps"
        fullScreen={false}
      />
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 my-16">
        <AlertCircle className="h-12 w-12 text-medred-primary mx-auto" />
        <h2 className="text-xl font-bold text-brand-900">Report Unavailable</h2>
        <p className="text-xs text-medical-text-muted">{error || 'Could not locate assessment record.'}</p>
        <button
          onClick={() => navigate('/history')}
          className="rounded-xl bg-brand-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-800 transition shadow-sm"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 md:p-10 max-w-6xl mx-auto text-left">
      <div className="flex items-center gap-2 text-xs font-mono text-medical-text-muted">
        <button
          onClick={() => navigate('/history')}
          className="hover:text-brand-primary transition flex items-center gap-1.5 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to History
        </button>
      </div>

      <ReportCard data={data} />
    </div>
  );
};
