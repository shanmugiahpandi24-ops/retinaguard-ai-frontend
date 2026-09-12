import React, { useState } from 'react';
import { getAssetUrl } from '../services/api';
import { Maximize2, X, Eye, Layers, Flame, Sliders, Activity, Sparkles, Filter } from 'lucide-react';

interface GradCAMViewerProps {
  heatmapUrl?: string;
  thermalUrl?: string;
  vascularUrl?: string;
  originalImageUrl?: string;
}

export const GradCAMViewer: React.FC<GradCAMViewerProps> = ({
  heatmapUrl,
  thermalUrl,
  vascularUrl,
  originalImageUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'gradcam' | 'thermal' | 'vascular' | 'original'>('gradcam');
  const [opacity, setOpacity] = useState(0.85);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const fullGradcam = getAssetUrl(heatmapUrl);
  const fullThermal = getAssetUrl(thermalUrl);
  const fullVascular = getAssetUrl(vascularUrl);

  const getCurrentImageUrl = () => {
    switch (activeTab) {
      case 'thermal':
        return fullThermal || fullGradcam;
      case 'vascular':
        return fullVascular || fullGradcam;
      case 'original':
        return originalImageUrl || fullGradcam;
      case 'gradcam':
      default:
        return fullGradcam;
    }
  };

  const activeUrl = getCurrentImageUrl();

  return (
    <div className="space-y-4 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-brand-primary" />
          <h4 className="text-sm font-bold text-brand-900 tracking-wide">Multi-Modal Optical & Heatmap Suite</h4>
        </div>
        <span className="text-[11px] font-mono text-brand-primary bg-brand-50 border border-brand-primary/20 px-2.5 py-0.5 rounded-full font-bold">
          4-Layer Spectral Engine
        </span>
      </div>

      {/* Layer selector tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-medical-border bg-medical-bg p-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('gradcam')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
            activeTab === 'gradcam'
              ? 'bg-brand-900 text-white shadow-sm'
              : 'text-medical-text-muted hover:text-brand-900 hover:bg-white'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Grad-CAM AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('thermal')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
            activeTab === 'thermal'
              ? 'bg-medorange-primary text-white shadow-sm'
              : 'text-medical-text-muted hover:text-brand-900 hover:bg-white'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Thermal View</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vascular')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
            activeTab === 'vascular'
              ? 'bg-brand-primary text-white shadow-sm'
              : 'text-medical-text-muted hover:text-brand-900 hover:bg-white'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>Red-Free Filter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('original')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
            activeTab === 'original'
              ? 'bg-white border border-medical-border text-brand-900 shadow-sm'
              : 'text-medical-text-muted hover:text-brand-900 hover:bg-white'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Original Fundus</span>
        </button>
      </div>

      {/* Main Interactive Display Box */}
      <div className="relative group overflow-hidden rounded-2xl border border-medical-border bg-slate-950 aspect-video sm:aspect-[16/9] flex items-center justify-center shadow-md">
        {/* Underlay Original Fundus image if available */}
        {originalImageUrl && activeTab !== 'original' && (
          <img
            src={originalImageUrl}
            alt="Base Fundus"
            className="absolute inset-0 h-full w-full object-contain pointer-events-none"
          />
        )}

        {/* Active Layer overlay */}
        {activeUrl ? (
          <img
            src={activeUrl}
            alt={`${activeTab} visualization`}
            style={{ opacity: activeTab === 'original' ? 1 : opacity }}
            className="relative z-10 h-full w-full object-contain transition-opacity duration-200"
          />
        ) : (
          <div className="p-8 text-center space-y-2 text-xs text-gray-400 z-10">
            <Layers className="h-10 w-10 mx-auto text-gray-500" />
            <p>Visualization layer processing complete</p>
          </div>
        )}

        {/* Top-right layer indicator badge */}
        <div className="absolute top-3 right-3 z-20 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[10px] font-mono font-bold text-white backdrop-blur">
          LAYER: {activeTab.toUpperCase()}
        </div>

        {/* Bottom-right expand button */}
        {activeUrl && (
          <button
            onClick={() => setModalImage(activeUrl)}
            className="absolute bottom-3 right-3 z-20 rounded-xl bg-slate-900/80 border border-slate-700 p-2.5 text-white backdrop-blur opacity-0 group-hover:opacity-100 transition duration-200 hover:bg-brand-primary"
            title="Enlarge Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Opacity Blending Slider (when overlay active) */}
      {activeTab !== 'original' && originalImageUrl && (
        <div className="flex items-center gap-4 rounded-xl border border-medical-border bg-medical-bg p-3 text-xs">
          <Sliders className="h-4 w-4 text-brand-primary shrink-0" />
          <span className="text-brand-900 font-semibold w-24 shrink-0">Overlay Blend:</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="flex-1 accent-brand-primary cursor-pointer h-1.5 bg-white border border-medical-border rounded-lg"
          />
          <span className="font-mono text-brand-primary font-bold w-12 text-right">
            {Math.round(opacity * 100)}%
          </span>
        </div>
      )}

      {/* Explanatory description card */}
      <div className="rounded-xl border border-medical-border bg-white p-3.5 space-y-1 text-xs text-medical-text-muted shadow-sm">
        {activeTab === 'gradcam' && (
          <p>
            <strong className="text-brand-900">Grad-CAM Attribution:</strong> Highlights gradient feature activations on the final EfficientNet convolutional layer driving classification.
          </p>
        )}
        {activeTab === 'thermal' && (
          <p>
            <strong className="text-medorange-dark">Thermal Intensity View:</strong> Maps pixel intensity variance using pseudo-color thermal scales to accentuate ischemic fundus zones.
          </p>
        )}
        {activeTab === 'vascular' && (
          <p>
            <strong className="text-brand-primary">Red-Free Vascular Filter:</strong> Isolates the green spectral channel with CLAHE contrast enhancement for microaneurysm and vessel inspection.
          </p>
        )}
        {activeTab === 'original' && (
          <p>
            <strong className="text-brand-900">Original Fundus Capture:</strong> Raw unenhanced 45° macular centered fundus photography.
          </p>
        )}
      </div>

      {/* Lightbox Enlargement Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-h-[92vh] max-w-[92vw] rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-slate-900/80 p-2.5 text-white hover:bg-brand-primary transition border border-slate-700"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={modalImage}
              alt="Enlarged layer view"
              className="max-h-[85vh] max-w-[88vw] object-contain p-2"
            />
          </div>
        </div>
      )}
    </div>
  );
};
