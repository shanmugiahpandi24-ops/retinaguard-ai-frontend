import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { ProcessingTimeline } from '../components/ProcessingTimeline';
import { predictionService } from '../services/prediction';
import { PredictionResponse } from '../types/api';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { AlertCircle, ShieldAlert, ArrowLeft, RefreshCw } from 'lucide-react';
import { formatPercent } from '../utils/formatters';
import { ParallaxCard } from '../components/ParallaxCard';

export const Screening: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [rejectedData, setRejectedData] = useState<PredictionResponse | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file || loading) return;

    setLoading(true);
    setRejectedData(null);
    setErrorDetails(null);

    try {
      const response = await predictionService.predict(file);

      // Store object URL for side-by-side original viewing
      const originalImageUrl = URL.createObjectURL(file);

      if (response.prediction_status === 'REJECTED') {
        setRejectedData(response);
        setLoading(false);
      } else {
        setTimeout(() => {
          navigate(`/result/${response.assessment_id}`, {
            state: { result: response, originalImageUrl },
          });
        }, 600);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response?.status === 500 && typeof err.response?.data?.detail === 'string' && err.response.data.detail.includes('weights')) {
        setErrorDetails(
          'Model weights are not installed on the backend server. The system is operating in verification mode. Real neural inference requires "models/dr_model.pth".'
        );
      } else if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        setErrorDetails(typeof detail === 'string' ? detail : JSON.stringify(detail));
      } else if (!err.response) {
        setErrorDetails('Connection momentarily interrupted while backend was compiling/reloading. Click "Reset & Try Again" to execute screening.');
      } else {
        setErrorDetails('An error occurred during inference processing. Please verify the uploaded image and try again.');
      }
    }
  };

  const createSampleFile = (): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#110502';
      ctx.fillRect(0, 0, 512, 512);

      const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 240);
      gradient.addColorStop(0, '#c3411b');
      gradient.addColorStop(0.7, '#8b2108');
      gradient.addColorStop(1, '#3b0d03');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(256, 256, 230, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffdfa0';
      ctx.beginPath();
      ctx.arc(170, 256, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#4a0e02';
      ctx.beginPath();
      ctx.arc(320, 256, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#5c1004';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(170, 256);
        const angle = (i * Math.PI) / 4;
        ctx.quadraticCurveTo(
          220 + Math.cos(angle) * 80,
          256 + Math.sin(angle) * 80,
          256 + Math.cos(angle) * 190,
          256 + Math.sin(angle) * 190
        );
        ctx.stroke();
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const sample = new File([blob], 'sample_retina_fundus.jpg', { type: 'image/jpeg' });
          resolve(sample);
        }
      }, 'image/jpeg', 0.95);
    });
  };

  const handleRunSample = async () => {
    const sample = await createSampleFile();
    setFile(sample);
    setLoading(true);
    try {
      const response = await predictionService.predict(sample);
      const originalImageUrl = URL.createObjectURL(sample);
      if (response.prediction_status === 'REJECTED') {
        setRejectedData(response);
        setLoading(false);
      } else {
        setTimeout(() => {
          navigate(`/result/${response.assessment_id}`, {
            state: { result: response, originalImageUrl },
          });
        }, 600);
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        setErrorDetails(typeof detail === 'string' ? detail : JSON.stringify(detail));
      } else if (!err.response) {
        setErrorDetails('Connection momentarily interrupted. Click "Run Sample Screening" below.');
      } else {
        setErrorDetails('An error occurred during processing. Please try again.');
      }
    }
  };

  const handleClearAll = () => {
    setFile(null);
    setRejectedData(null);
    setErrorDetails(null);
    setLoading(false);
  };

  return (
    <div className="space-y-8 p-6 md:p-10 max-w-5xl mx-auto text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE7F2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#0B4A7A] uppercase tracking-wider font-bold">
            <span>Stage 1 · Acquisition & Ingestion</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-[#0B4A7A] uppercase tracking-wider mt-1">
            <span className="bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
              RETINAL FUNDUS SCREENING
            </span>
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Upload a clear retinal fundus photograph. The system validates image quality before triggering CNN classification.
          </p>
        </div>
      </div>

      {/* Main Workspace Card - Static */}
      <ParallaxCard depth={0} tiltAmount={0} enableGlobalParallax={false}>
        <div className="rounded-3xl border border-[#DCE7F2] bg-[#FFFFFF] p-6 md:p-10 shadow-sm space-y-6">
          {/* State 1: Active Processing Timeline Animation */}
          {loading && (
            <div className="py-8 space-y-6">
              <ProcessingTimeline status="processing" />
            </div>
          )}

          {/* State 2: Quality Gate Rejection Card */}
          {!loading && rejectedData && (
            <div className="rounded-2xl border border-[#D9534F]/30 bg-[#FFF0F0] p-8 text-center space-y-6 animate-in fade-in">
              <div className="inline-flex rounded-2xl border border-[#D9534F]/40 bg-[#FFFFFF] p-4 text-[#D9534F] shadow-sm">
                <ShieldAlert className="h-12 w-12" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D9534F]">
                  Pre-Inference Quality Rejection
                </span>
                <h2 className="text-3xl font-black text-[#16324F]">IMAGE REJECTED</h2>
                <p className="max-w-xl mx-auto text-sm text-[#64748B] leading-relaxed">
                  Your image could not be used for reliable AI-assisted screening. Please upload a clearer retinal fundus photograph.
                </p>
              </div>

              <div className="max-w-md mx-auto rounded-2xl border border-[#DCE7F2] bg-[#FFFFFF] p-5 text-left space-y-3 text-xs shadow-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Assessment ID:</span>
                  <span className="font-mono text-[#16324F] font-bold">{rejectedData.assessment_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Quality Assessment:</span>
                  <span className="rounded-md bg-[#FFF0F0] border border-[#D9534F]/30 px-2 py-0.5 text-xs font-bold text-[#D9534F]">
                    {rejectedData.quality?.status || 'POOR'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Clarity Score:</span>
                  <span className="font-mono text-[#16324F] font-bold">{formatPercent(rejectedData.quality?.score)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#DCE7F2]">
                  <span className="text-[#64748B]">Rejection Reason:</span>
                  <span className="text-[#D9534F] font-semibold">{rejectedData.reason || 'Insufficient focus or illumination'}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] px-6 py-3 text-xs font-bold text-white transition shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Upload Different Image</span>
                </button>
              </div>
            </div>
          )}

          {/* State 3: Upload Ingestion Area */}
          {!loading && !rejectedData && (
            <div className="space-y-6">
              {errorDetails && (
                <div className="flex items-start gap-3 rounded-2xl border border-[#FCA5A5] bg-[#FFF0F0] p-4 text-xs text-[#D9534F]">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <span className="font-bold block">Inference Execution Error</span>
                    <p className="leading-relaxed">{errorDetails}</p>
                    <button
                      onClick={handleRunSample}
                      className="mt-2 text-[#0B4A7A] font-bold underline hover:text-[#083B63]"
                    >
                      Click here to run verified sample fundus screening
                    </button>
                  </div>
                </div>
              )}

              <ImageUploader onFileSelected={(f: File) => setFile(f)} onAnalyze={handleAnalyze} isLoading={loading} />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DCE7F2]">
                <button
                  onClick={handleRunSample}
                  className="text-xs font-bold text-[#1677C8] hover:text-[#0B4A7A] hover:underline transition"
                >
                  Need a sample fundus image? Click to run instant demo
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={!file}
                  className="w-full sm:w-auto rounded-2xl bg-[#0B4A7A] hover:bg-[#083B63] px-8 py-3.5 text-xs font-black text-white transition shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Execute Screening Pipeline &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </ParallaxCard>

      <ParallaxCard depth={0} tiltAmount={0} enableGlobalParallax={false}>
        <SafetyDisclaimer />
      </ParallaxCard>
    </div>
  );
};
