import React, { useState, useEffect, useRef } from 'react';
import { Layers, Activity, Sliders, Zap, ShieldCheck, Eye, Sparkles } from 'lucide-react';
import { ParallaxCard } from './ParallaxCard';

interface StageData {
  stage: number;
  label: string;
  shortName: string;
  confidence: number;
  qualityScore: number;
  risk: string;
  riskColor: string;
  riskBg: string;
  riskBorder: string;
  description: string;
  recommendation: string;
  lesions: string[];
}

const STAGES: StageData[] = [
  {
    stage: 0,
    label: 'Stage 0 · No Diabetic Retinopathy',
    shortName: 'No DR',
    confidence: 94.2,
    qualityScore: 98.5,
    risk: 'LOW RISK',
    riskColor: 'text-[#249B68]',
    riskBg: 'bg-[#EAF8F1]',
    riskBorder: 'border-[#B2E3C6]',
    description: 'Clear retinal fundus with normal vascular caliber, distinct optic disc margins, and pristine foveal reflex. No microaneurysms detected.',
    recommendation: 'Routine annual eye examination. Maintain glycemic control (HbA1c < 7.0%).',
    lesions: ['Normal Optic Disc', 'Clear Fovea', 'Intact Retinal Vessels'],
  },
  {
    stage: 1,
    label: 'Stage 1 · Mild Non-Proliferative DR',
    shortName: 'Mild NPDR',
    confidence: 89.6,
    qualityScore: 96.1,
    risk: 'MODERATE RISK',
    riskColor: 'text-[#F4A340]',
    riskBg: 'bg-[#FFF4E3]',
    riskBorder: 'border-[#FED7AA]',
    description: 'Isolated retinal microaneurysms detected in the inferotemporal quadrant. No hard exudates or macular edema observed.',
    recommendation: 'Follow-up screening in 6-12 months. Optimize blood pressure and lipid profile.',
    lesions: ['Isolated Microaneurysms', 'Minor Vascular Dilation'],
  },
  {
    stage: 2,
    label: 'Stage 2 · Moderate Non-Proliferative DR',
    shortName: 'Moderate NPDR',
    confidence: 87.4,
    qualityScore: 94.8,
    risk: 'ELEVATED RISK',
    riskColor: 'text-[#D97706]',
    riskBg: 'bg-[#FEF3C7]',
    riskBorder: 'border-[#FDE68A]',
    description: 'Multiple microaneurysms, dot-and-blot hemorrhages, and waxy yellow hard exudates near the parafoveal region.',
    recommendation: 'Ophthalmology referral within 2-4 weeks. Optical Coherence Tomography (OCT) recommended.',
    lesions: ['Dot-and-Blot Hemorrhages', 'Hard Lipid Exudates', 'Cotton Wool Spots'],
  },
  {
    stage: 3,
    label: 'Stage 3 · Severe Non-Proliferative DR',
    shortName: 'Severe NPDR',
    confidence: 85.8,
    qualityScore: 93.2,
    risk: 'HIGH RISK',
    riskColor: 'text-[#D9534F]',
    riskBg: 'bg-[#FFF0F0]',
    riskBorder: 'border-[#FCA5A5]',
    description: 'Extensive intraretinal hemorrhages in all 4 quadrants (4-2-1 rule), prominent venous beading, and IRMA microvascular anomalies.',
    recommendation: 'Urgent retinal specialist referral within 1-2 weeks. Anti-VEGF or panretinal photocoagulation evaluation.',
    lesions: ['4-Quadrant Hemorrhages', 'Venous Beading', 'IRMA Vascular Anomalies'],
  },
  {
    stage: 4,
    label: 'Stage 4 · Proliferative DR (PDR)',
    shortName: 'Proliferative DR',
    confidence: 91.5,
    qualityScore: 95.4,
    risk: 'CRITICAL RISK',
    riskColor: 'text-[#B91C1C]',
    riskBg: 'bg-[#FEF2F2]',
    riskBorder: 'border-[#FCA5A5]',
    description: 'Neovascularization at the optic disc (NVD) with vitreous hemorrhage risks and fibrous tractional bands.',
    recommendation: 'IMMEDIATE ophthalmology intervention. Panretinal photocoagulation (PRP) laser or vitreoretinal surgery.',
    lesions: ['Neovascularization (NVD)', 'Fibrovascular Proliferation', 'Preretinal Hemorrhage'],
  },
];

export const SimulatorCard: React.FC = () => {
  const [selectedStageIdx, setSelectedStageIdx] = useState(2); // Default Stage 2
  const [viewLayer, setViewLayer] = useState<'raw' | 'gradcam' | 'contrast' | 'thermal'>('gradcam');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentStage = STAGES[selectedStageIdx];

  // Draw simulated multi-spectral fundus canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    // Background base fill
    ctx.fillStyle = viewLayer === 'contrast' ? '#021811' : '#100402';
    ctx.fillRect(0, 0, w, h);

    // Retinal disc gradient
    if (viewLayer === 'raw') {
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
      grad.addColorStop(0, '#D94E28');
      grad.addColorStop(0.7, '#962409');
      grad.addColorStop(1, '#3B0901');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.fill();

      // Optic Disc
      ctx.fillStyle = '#FFE5B4';
      ctx.beginPath();
      ctx.arc(cx - 70, cy - 10, 28, 0, Math.PI * 2);
      ctx.fill();

      // Macula Fovea
      ctx.fillStyle = '#4A0E02';
      ctx.beginPath();
      ctx.arc(cx + 60, cy + 10, 18, 0, Math.PI * 2);
      ctx.fill();

      // Vascular Arcs
      ctx.strokeStyle = '#5E1004';
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy - 10);
        const angle = (i * Math.PI) / 3 - 0.5;
        ctx.quadraticCurveTo(cx + Math.cos(angle) * 90, cy + Math.sin(angle) * 90, cx + Math.cos(angle) * 190, cy + Math.sin(angle) * 190);
        ctx.stroke();
      }

      // Render Stage Lesions
      if (currentStage.stage >= 1) {
        // Microaneurysms
        ctx.fillStyle = '#FF0000';
        for (let i = 0; i < currentStage.stage * 5; i++) {
          const rx = cx + Math.cos(i * 1.2) * (40 + i * 15);
          const ry = cy + Math.sin(i * 1.2) * (30 + i * 12);
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (currentStage.stage >= 2) {
        // Exudates
        ctx.fillStyle = '#FFFF99';
        for (let i = 0; i < currentStage.stage * 3; i++) {
          const rx = cx + Math.sin(i * 1.8) * 60;
          const ry = cy + Math.cos(i * 1.8) * 50;
          ctx.beginPath();
          ctx.arc(rx, ry, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (viewLayer === 'gradcam') {
      // Grad-CAM Heatmap layer
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
      grad.addColorStop(0, '#1E293B');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Focal Heatmap blobs based on stage severity
      const heatGrad = ctx.createRadialGradient(cx + 30, cy + 20, 10, cx + 30, cy + 20, 140);
      if (currentStage.stage === 0) {
        heatGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        heatGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      } else if (currentStage.stage <= 2) {
        heatGrad.addColorStop(0, 'rgba(234, 179, 8, 0.85)');
        heatGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.5)');
        heatGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      } else {
        heatGrad.addColorStop(0, 'rgba(239, 68, 68, 0.95)');
        heatGrad.addColorStop(0.4, 'rgba(220, 38, 38, 0.7)');
        heatGrad.addColorStop(1, 'rgba(127, 29, 29, 0)');
      }
      ctx.fillStyle = heatGrad;
      ctx.beginPath();
      ctx.arc(cx + 30, cy + 20, 140, 0, Math.PI * 2);
      ctx.fill();
    } else if (viewLayer === 'contrast') {
      // Green-free vascular contrast
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
      grad.addColorStop(0, '#043A2B');
      grad.addColorStop(0.8, '#022118');
      grad.addColorStop(1, '#01110C');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.fill();

      // Sharp green vessels
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 3.5;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(cx - 70, cy - 10);
        const angle = (i * Math.PI) / 4;
        ctx.quadraticCurveTo(cx + Math.cos(angle) * 100, cy + Math.sin(angle) * 100, cx + Math.cos(angle) * 190, cy + Math.sin(angle) * 190);
        ctx.stroke();
      }
    } else {
      // Thermal intensity
      const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 210);
      grad.addColorStop(0, '#8B5CF6');
      grad.addColorStop(0.5, '#EC4899');
      grad.addColorStop(1, '#0F172A');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }, [selectedStageIdx, viewLayer, currentStage]);

  return (
    <ParallaxCard depth={14} tiltAmount={4} className="w-full">
      <div className="rounded-3xl border border-[#CBD5E1] bg-white p-6 md:p-8 space-y-6 shadow-md text-left">
        {/* Header Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold font-mono text-[#0B4A7A] bg-[#EAF5FF] border border-[#BAE6FD]">
                <Sparkles className="h-3.5 w-3.5 text-[#1677C8] animate-pulse" />
                INTERACTIVE CLINICAL SIMULATOR
              </span>
            </div>
            <h3 className="text-xl font-black text-[#0B4A7A]">Diabetic Retinopathy Stage Simulator</h3>
            <p className="text-xs text-[#64748B]">Select a severity stage to simulate CNN inference & multi-spectral explainability heatmaps</p>
          </div>
        </div>

        {/* Stage Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STAGES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedStageIdx(idx)}
              className={`rounded-2xl p-3 text-left border transition-all duration-200 ${
                selectedStageIdx === idx
                  ? 'border-[#0B4A7A] bg-[#0B4A7A] text-white shadow-md scale-105'
                  : 'border-[#DCE7F2] bg-[#F8FBFF] text-[#16324F] hover:border-[#1677C8] hover:bg-[#EAF5FF]'
              }`}
            >
              <span className="block text-[10px] font-mono opacity-80 font-bold uppercase">Stage {s.stage}</span>
              <span className="block text-xs font-black tracking-tight mt-0.5 truncate">{s.shortName}</span>
            </button>
          ))}
        </div>

        {/* Main Simulator Display: Canvas + Optical Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Canvas Viewport (5 Cols) */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-[#CBD5E1] bg-black shadow-inner flex flex-col items-center justify-center p-2 group">
            <canvas ref={canvasRef} width={400} height={320} className="w-full h-auto rounded-xl object-contain transition-all duration-500 transform group-hover:scale-[1.02]" />
            
            {/* Animated Laser Scanning Beam */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent animate-laser-scan opacity-70 shadow-[0_0_10px_#38BDF8]" />
            </div>

            {/* View Layer Selector Pill Bar */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-center gap-1.5 p-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white z-10">
              <button
                onClick={() => setViewLayer('raw')}
                className={`px-2.5 py-1 rounded-full transition ${viewLayer === 'raw' ? 'bg-[#1677C8] font-bold text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                Raw Fundus
              </button>
              <button
                onClick={() => setViewLayer('gradcam')}
                className={`px-2.5 py-1 rounded-full transition ${viewLayer === 'gradcam' ? 'bg-[#1677C8] font-bold text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                Grad-CAM
              </button>
              <button
                onClick={() => setViewLayer('contrast')}
                className={`px-2.5 py-1 rounded-full transition ${viewLayer === 'contrast' ? 'bg-[#22C55E] font-bold text-white' : 'opacity-70 hover:opacity-100'}`}
              >
                Green-Free
              </button>
            </div>
          </div>

          {/* Diagnostic Metrics & LLM Summary (7 Cols) */}
          <div className="md:col-span-7 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-3.5 hover:border-[#1677C8] transition duration-300">
                <span className="text-[#64748B] text-[10px] uppercase font-bold block">Calibrated Confidence</span>
                <span className="text-2xl font-black text-[#0B4A7A] font-mono mt-1 block">{currentStage.confidence}%</span>
                <div className="w-full bg-[#DCE7F2] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-gradient-to-r from-[#0B4A7A] to-[#1677C8] h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${currentStage.confidence}%` }} />
                </div>
                <span className="text-[10px] text-[#249B68] font-mono mt-1 block">T = 1.2 Scaled</span>
              </div>
              <div className="rounded-2xl border border-[#DCE7F2] bg-[#F8FBFF] p-3.5 hover:border-[#249B68] transition duration-300">
                <span className="text-[#64748B] text-[10px] uppercase font-bold block">Quality Gate Score</span>
                <span className="text-2xl font-black text-[#249B68] font-mono mt-1 block">{currentStage.qualityScore}%</span>
                <div className="w-full bg-[#DCE7F2] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div className="bg-[#249B68] h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${currentStage.qualityScore}%` }} />
                </div>
                <span className="text-[10px] text-[#249B68] font-mono mt-1 block">PASSED</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#0B4A7A] uppercase tracking-wider block">Clinical Observations</span>
              <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FBFF] border border-[#E2E8F0] p-3.5 rounded-2xl">
                {currentStage.description}
              </p>
            </div>

            {/* Detected Lesion Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider block">Key Lesions Detected</span>
              <div className="flex flex-wrap gap-1.5">
                {currentStage.lesions.map((les, i) => (
                  <span key={i} className="rounded-full bg-[#EAF5FF] border border-[#BAE6FD] px-2.5 py-1 text-[10px] font-mono font-bold text-[#0B4A7A]">
                    {les}
                  </span>
                ))}
              </div>
            </div>

            {/* Clinical Action Recommendation */}
            <div className="rounded-2xl border border-[#BAE6FD] bg-[#EAF5FF] p-3.5 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B4A7A]">Action Plan</span>
              <p className="text-xs text-[#0B4A7A] font-semibold">{currentStage.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </ParallaxCard>
  );
};
