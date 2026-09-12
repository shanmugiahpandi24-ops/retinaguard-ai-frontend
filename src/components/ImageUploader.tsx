import React, { useState, useRef } from 'react';
import { Upload, FileImage, X, AlertTriangle, Sparkles, Check, Crosshair, Eye, ShieldCheck } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

interface ImageMeta {
  width: number;
  height: number;
  sizeMb: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelected, onAnalyze, isLoading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<ImageMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidExt = ext === 'jpg' || ext === 'jpeg' || ext === 'png';

    if (!validTypes.includes(file.type) && !isValidExt) {
      setError('Unsupported file type. Only JPG, JPEG, and PNG retinal fundus photographs are accepted.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File size exceeds the 25MB limit. Please upload an optimized fundus image.');
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setMeta({
        width: img.width,
        height: img.height,
        sizeMb: (file.size / (1024 * 1024)).toFixed(2),
      });
    };
    img.src = url;

    setSelectedFile(file);
    setPreviewUrl(url);
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setMeta(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = (sampleType: 'clear' | 'blurry') => {
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
    ctx.arc(170, 256, sampleType === 'blurry' ? 45 : 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#4a0e02';
    ctx.beginPath();
    ctx.arc(320, 256, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#5c1004';
    ctx.lineWidth = sampleType === 'blurry' ? 1.5 : 3;
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

    if (sampleType === 'blurry') {
      ctx.filter = 'blur(12px)';
      ctx.drawImage(canvas, 0, 0);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `sample_${sampleType}_fundus.jpg`, { type: 'image/jpeg' });
        processFile(file);
        setTimeout(() => {
          onAnalyze();
        }, 150);
      }
    }, 'image/jpeg', 0.95);
  };


  return (
    <div className="w-full space-y-5 text-left">
      {!selectedFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 md:p-16 text-center cursor-pointer transition-colors duration-200 ${
            isDragOver
              ? 'border-[#0B4A7A] bg-[#EAF5FF]'
              : 'border-[#0B4A7A]/40 bg-[#F4F9FE] hover:border-[#0B4A7A] hover:bg-[#EAF5FF]'
          }`}
        >
          <div className="relative rounded-2xl bg-[#EAF5FF] border border-[#BAE6FD] p-5 text-[#0B4A7A] shadow-xs">
            <Upload className="h-10 w-10 text-[#0B4A7A]" />
          </div>

          <h3 className="mt-5 text-xl md:text-2xl font-black text-[#16324F] tracking-wide">
            Upload Retinal Fundus Photograph
          </h3>
          <p className="mt-2 text-xs md:text-sm text-[#64748B] max-w-md leading-relaxed">
            Drag and drop fundus image here, or <span className="text-[#0B4A7A] font-bold underline underline-offset-2">browse computer</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#64748B]">
            <span className="rounded-md border border-[#BAE6FD] bg-[#EAF5FF] px-2.5 py-1 text-[#0B4A7A] font-bold">JPG</span>
            <span className="rounded-md border border-[#BAE6FD] bg-[#EAF5FF] px-2.5 py-1 text-[#0B4A7A] font-bold">JPEG</span>
            <span className="rounded-md border border-[#BAE6FD] bg-[#EAF5FF] px-2.5 py-1 text-[#0B4A7A] font-bold">PNG</span>
            <span>• Max 25 MB</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="rounded-3xl border border-[#DCE7F2] bg-[#FFFFFF] p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Fundus Preview */}
            <div className="relative h-60 w-60 shrink-0 overflow-hidden rounded-2xl border-2 border-[#0B4A7A]/40 bg-black shadow-md group">
              <img
                src={previewUrl!}
                alt="Retinal Fundus Preview"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* High-Tech Animated Laser Scan Line */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-10">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent animate-laser-scan opacity-80 shadow-[0_0_12px_#38BDF8]" />
              </div>

              <span className="absolute bottom-2.5 left-2.5 z-20 rounded-md bg-black/85 border border-white/20 px-2.5 py-1 text-[10px] font-mono font-bold text-[#EAF5FF] backdrop-blur">
                TARGET LOADED
              </span>
            </div>

            {/* Metadata & Controls */}
            <div className="flex-1 space-y-4 text-left w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF8F1] px-3.5 py-1 text-xs font-bold text-[#249B68] border border-[#A7F3D0]">
                    <Check className="h-3.5 w-3.5 text-[#249B68]" /> Target Image Selected
                  </span>
                  <h4 className="mt-2 text-xl font-black text-[#0B4A7A] break-all flex items-center gap-2">
                    <FileImage className="h-5 w-5 text-[#0B4A7A] shrink-0" />
                    {selectedFile.name}
                  </h4>
                </div>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="rounded-xl border border-[#DCE7F2] p-2.5 text-[#64748B] hover:text-[#16324F] hover:bg-[#F4F9FE] transition disabled:opacity-50"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Dimensions grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-3.5">
                  <span className="text-[10px] text-[#64748B] uppercase font-mono block">Dimensions</span>
                  <span className="text-sm font-bold text-[#16324F] font-mono mt-0.5 block">
                    {meta ? `${meta.width} × ${meta.height} px` : 'Detecting...'}
                  </span>
                </div>
                <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-3.5">
                  <span className="text-[10px] text-[#64748B] uppercase font-mono block">File Size</span>
                  <span className="text-sm font-bold text-[#16324F] font-mono mt-0.5 block">
                    {meta ? `${meta.sizeMb} MB` : `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`}
                  </span>
                </div>
                <div className="col-span-2 md:col-span-1 rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-3.5">
                  <span className="text-[10px] text-[#64748B] uppercase font-mono block">MIME Type</span>
                  <span className="text-sm font-bold text-[#0B4A7A] font-mono mt-0.5 block">
                    {selectedFile.type || 'image/jpeg'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={onAnalyze}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 rounded-2xl bg-[#0B4A7A] hover:bg-[#083B63] px-8 py-4 font-extrabold text-white transition shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                  <span>{isLoading ? 'Executing Pipeline...' : 'Analyze Fundus Image'}</span>
                </button>
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full sm:w-auto rounded-2xl border border-[#DCE7F2] bg-[#FFFFFF] px-5 py-4 text-xs font-semibold text-[#0B4A7A] hover:bg-[#F4F9FE] transition disabled:opacity-50"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Sample Buttons for Instant Hackathon Testing */}
      {!selectedFile && !isLoading && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#DCE7F2] bg-[#FFFFFF] p-4 text-xs shadow-xs">
          <span className="font-semibold text-[#64748B] flex items-center gap-2">
            <Eye className="h-4 w-4 text-[#0B4A7A]" />
            <span>Hackathon Evaluator Quick Presets:</span>
          </span>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => handleLoadSample('clear')}
              className="rounded-xl border border-[#BAE6FD] bg-[#EAF5FF] px-3.5 py-2 font-bold text-[#0B4A7A] hover:bg-[#BAE6FD]/40 transition shadow-xs"
            >
              Load Clear Fundus Sample
            </button>
            <button
              type="button"
              onClick={() => handleLoadSample('blurry')}
              className="rounded-xl border border-[#FECACA] bg-[#FFF0F0] px-3.5 py-2 font-bold text-[#D9534F] hover:bg-[#FECACA]/40 transition shadow-xs"
              title="Tests non-fundus / quality rejection gate"
            >
              Load Blurry Sample (Test Rejection)
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#FECACA] bg-[#FFF0F0] p-4 text-xs text-[#D9534F]">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#D9534F] mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export const UploadZone = ImageUploader;
