import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { reportsService } from '../services/reports';
import { PredictionResponse } from '../types/api';
import { ResultCard } from '../components/ResultCard';
import { QualityCard } from '../components/QualityCard';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { GradCAMViewer } from '../components/GradCAMViewer';
import { LLMAnalysisCard } from '../components/LLMAnalysisCard';
import { PixelDensityCard } from '../components/PixelDensityCard';
import { CalibrationCard } from '../components/CalibrationCard';
import { KaggleBenchmarkCard } from '../components/KaggleBenchmarkCard';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { LoadingScreen } from '../components/LoadingScreen';
import { Download, FileText, Plus, AlertCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export const Result: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<PredictionResponse | null>(location.state?.result || null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | undefined>(location.state?.originalImageUrl);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!data && assessmentId) {
      setLoading(true);
      reportsService
        .getReport(assessmentId)
        .then((res) => {
          if (res) {
            setData(res);
          } else {
            setError('Assessment record not found on backend.');
          }
        })
        .catch(() => {
          setError('Failed to retrieve assessment data from backend.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [assessmentId, data]);

  const handleDownloadPdf = async () => {
    const aid = assessmentId || data?.assessment_id;
    if (!aid) return;
    setDownloading(true);
    try {
      await reportsService.triggerPdfDownload(aid);
    } catch {
      alert('PDF generation unavailable on the backend for this assessment.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <LoadingScreen
        message="Loading AI Screening Assessment..."
        submessage="Retrieving multi-modal heatmaps, calibration metrics, and LLM Vision analysis"
        fullScreen={false}
      />
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 my-16">
        <div className="rounded-2xl bg-medred-light border border-medred-primary/30 p-4 inline-block text-medred-primary shadow-sm">
          <AlertCircle className="h-10 w-10 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-brand-900">Assessment Record Unavailable</h2>
        <p className="text-xs text-medical-text-muted">{error || 'The requested assessment could not be found.'}</p>
        <div className="pt-4 flex justify-center gap-3">
          <button
            onClick={() => navigate('/screening')}
            className="rounded-xl bg-brand-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-800 transition shadow-sm"
          >
            Start New Screening
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-xl border border-medical-border bg-white px-5 py-2.5 text-xs font-semibold text-brand-900 hover:bg-brand-50 transition shadow-sm"
          >
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Handle REJECTED image
  if (data.prediction_status === 'REJECTED') {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 text-left">
        <div className="flex items-center gap-2 text-xs font-mono text-medical-text-muted">
          <button onClick={() => navigate('/screening')} className="hover:text-brand-primary transition flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Screening
          </button>
        </div>

        <ResultCard data={data} />

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/screening')}
            className="flex items-center gap-2 mx-auto rounded-xl bg-brand-900 px-7 py-3 text-sm font-bold text-white hover:bg-brand-800 transition shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Upload Another Image</span>
          </button>
        </div>

        <SafetyDisclaimer />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-7xl mx-auto text-left">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-medical-border pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-primary uppercase tracking-wider font-bold">
            <Sparkles className="h-3.5 w-3.5" /> Multi-Modal Diagnostic Output
          </div>
          <h1 className="text-3xl font-black text-brand-900 mt-1">AI-Assisted Screening Result</h1>
          <p className="text-xs text-medical-text-muted mt-1">
            Assessment ID: <span className="font-mono text-brand-900 font-bold">{data.assessment_id}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate(`/reports/${data.assessment_id || assessmentId}`)}
            className="flex items-center gap-1.5 rounded-xl border border-medical-border bg-white px-4 py-2.5 text-xs font-semibold text-brand-900 hover:bg-brand-50 hover:text-brand-primary transition shadow-sm"
          >
            <FileText className="h-4 w-4 text-brand-primary" />
            <span>View Full Report</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="flex items-center gap-1.5 rounded-xl bg-brand-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-brand-800 transition shadow-sm disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>

          <button
            onClick={() => navigate('/screening')}
            className="flex items-center gap-1.5 rounded-xl border border-medical-border bg-white px-4 py-2.5 text-xs font-semibold text-medical-text-muted hover:text-brand-900 hover:bg-medical-bg transition shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Screening</span>
          </button>
        </div>
      </div>

      {/* 1. Primary Result Banner */}
      <ResultCard
        data={data}
        onDownloadPdf={handleDownloadPdf}
        onViewReport={() => navigate(`/reports/${data.assessment_id || assessmentId}`)}
      />

      {/* 2. LLM Vision Clinical Analysis Card */}
      <LLMAnalysisCard analysis={data.llm_analysis} />

      {/* 3. Pre-Inference Quality & Anatomical Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QualityCard quality={data.quality} />
        <PixelDensityCard metrics={data.pixel_density_metrics} />
      </div>

      {/* 4. Multi-Modal Optical & Heatmap Suite (Grad-CAM, Thermal View, Red-Free Filter) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-4 shadow-sm">
          <GradCAMViewer
            heatmapUrl={data.explainability?.heatmap_url}
            thermalUrl={data.explainability?.thermal_url}
            vascularUrl={data.explainability?.vascular_url}
            originalImageUrl={originalImageUrl}
          />
        </div>

        {/* 5. Probability Chart Distribution */}
        <div className="lg:col-span-5 rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider">Five-Class Probability Distribution</h3>
            <span className="text-[10px] font-mono text-medical-text-muted">Softmax</span>
          </div>
          <p className="text-xs text-medical-text-muted">
            Probability spectrum across all five clinical stages returned by the neural network:
          </p>
          <ProbabilityChart
            probabilities={data.prediction?.probabilities}
            isUncertain={data.prediction_status === 'UNCERTAIN' || data.evaluation?.is_uncertain}
          />
        </div>
      </div>

      {/* 6. Calibration & Dataset Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalibrationCard calibration={data.confidence_calibration} />
        <KaggleBenchmarkCard benchmark={data.kaggle_benchmark} />
      </div>

      {/* Medical Safety Notice */}
      <SafetyDisclaimer />
    </div>
  );
};
