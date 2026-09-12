import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, FileText, Download, Clock, User as UserIcon } from 'lucide-react';
import { PredictionResponse } from '../types/api';
import { formatDate, formatPercent, getSeverityColor, getPredictionStatusBadge } from '../utils/formatters';
import { useAuth } from '../hooks/useAuth';

interface ResultCardProps {
  data: PredictionResponse;
  onDownloadPdf?: () => void;
  onViewReport?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onDownloadPdf, onViewReport }) => {
  const { user } = useAuth();
  const prediction = data.prediction;
  const isUncertain = data.prediction_status === 'UNCERTAIN';
  const isRejected = data.prediction_status === 'REJECTED';
  const severityStyle = getSeverityColor(prediction?.class_name);
  const statusBadge = getPredictionStatusBadge(data.prediction_status);

  const userName = data.user_name || (user?.email ? user.email.split('@')[0].replace('.', ' ').replace('_', ' ').toUpperCase() : '');

  if (isRejected) {
    return (
      <div className="rounded-3xl border border-medred-primary/30 bg-medred-light p-8 text-center space-y-6 shadow-sm">
        <div className="inline-flex rounded-2xl border border-medred-primary/30 bg-white p-4 text-medred-primary shadow-sm">
          <ShieldAlert className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-medred-primary">Quality Gate Triggered</span>
          <h2 className="text-3xl font-black text-brand-900">IMAGE REJECTED</h2>
          <p className="max-w-xl mx-auto text-sm text-medical-text-muted leading-relaxed">
            Your retinal photograph could not be used for reliable AI-assisted screening. The pre-inference quality engine detected insufficient focus or abnormal illumination.
          </p>
        </div>

        <div className="max-w-md mx-auto rounded-2xl border border-medical-border bg-white p-4 text-left space-y-2 text-xs shadow-sm">
          <div className="flex justify-between">
            <span className="text-medical-text-muted">Assessment ID:</span>
            <span className="font-mono text-brand-900 font-bold">{data.assessment_id}</span>
          </div>
          {userName && (
            <div className="flex justify-between">
              <span className="text-medical-text-muted">User / Clinician:</span>
              <span className="font-mono text-brand-primary font-bold">{userName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-medical-text-muted">Screened At:</span>
            <span className="font-mono text-medical-text">{formatDate(data.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-medical-text-muted">Quality Status:</span>
            <span className="font-bold text-medred-primary">{data.quality?.status || 'POOR'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-medical-text-muted">Quality Score:</span>
            <span className="font-mono text-brand-900 font-bold">{formatPercent(data.quality?.score)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-medical-text-muted">Reason:</span>
            <span className="text-medred-dark font-medium">{data.reason || 'Poor image quality or unsuitable retinal fundus image.'}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-medical-border bg-white p-6 md:p-8 space-y-6 shadow-sm relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-medical-border pb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-mono text-medical-text-muted">
            ID: <strong className="text-brand-900 font-semibold">{data.assessment_id}</strong>
          </span>
          {userName && (
            <span className="text-xs font-mono text-medical-text-muted border-l border-medical-border pl-3 flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5 text-brand-primary" />
              <strong className="text-medical-text font-medium">{userName}</strong>
            </span>
          )}
          {data.created_at && (
            <span className="text-xs font-mono text-medical-text-muted border-l border-medical-border pl-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-primary" />
              <strong className="text-medical-text font-medium">{formatDate(data.created_at)}</strong>
            </span>
          )}
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
            {statusBadge.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewReport && (
            <button
              onClick={onViewReport}
              className="flex items-center gap-1.5 rounded-xl border border-medical-border bg-white px-3.5 py-2 text-xs font-medium text-brand-900 hover:bg-brand-50 hover:text-brand-primary transition"
            >
              <FileText className="h-3.5 w-3.5 text-brand-primary" /> View Full Report
            </button>
          )}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 rounded-xl bg-brand-900 hover:bg-brand-800 px-3.5 py-2 text-xs font-medium text-white transition shadow-sm"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Uncertain banner if below threshold */}
      {isUncertain && (
        <div className="rounded-2xl border border-medorange-primary/30 bg-medorange-light p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-medorange-dark shrink-0 mt-0.5" />
          <div className="text-xs md:text-sm">
            <h4 className="font-bold text-medorange-dark">UNCERTAIN RESULT</h4>
            <p className="text-medorange-dark/90 mt-0.5">
              The model confidence is below the configured reliability threshold (60.0%). Results indicate ambiguous feature distribution. Please obtain professional clinical evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Main classification display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-7 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-medical-text-muted">
            Detected Retinopathy Severity
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className={`text-2xl md:text-3xl font-black tracking-tight ${isUncertain ? 'text-medorange-dark' : severityStyle.text}`}>
              {isUncertain
                ? 'Indeterminate Result — Clinical Review Required'
                : (prediction?.class_name || 'Inconclusive')}
            </h2>
            {!isUncertain && prediction?.class_id !== undefined && (
              <span className="text-xs font-mono text-medical-text-muted">
                (Stage {prediction.class_id})
              </span>
            )}
          </div>
          <p className="text-xs text-medical-text-muted leading-relaxed">
            {isUncertain
              ? 'Ambiguous feature distribution across clinical classes. Professional clinical evaluation is required.'
              : 'Derived from EfficientNet feature extraction trained on gold-standard fundus datasets.'}
          </p>
        </div>

        {/* Confidence metric card */}
        <div className="md:col-span-5 rounded-2xl border border-medical-border bg-medical-bg p-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-medical-text-muted">Model Confidence (Calibrated)</span>
            <span className="font-mono text-xl font-extrabold text-brand-900">
              {formatPercent(prediction?.confidence)}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white overflow-hidden border border-medical-border">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isUncertain
                  ? 'bg-medorange-primary'
                  : 'bg-brand-primary'
              }`}
              style={{ width: formatPercent(prediction?.confidence) }}
            />
          </div>
          <p className="text-[11px] text-medical-text-muted italic">
            * Calibrated confidence score — statistical probability, not clinical diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};
