import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  ShieldCheck,
  Activity,
  Layers,
  MessageSquare,
  Sliders,
  Cpu,
  Award,
  Zap,
  Bot
} from 'lucide-react';
import { SafetyDisclaimer } from '../components/SafetyDisclaimer';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { useAuth } from '../hooks/useAuth';
import { ParallaxCard } from '../components/ParallaxCard';
import { MovableHeroTitle } from '../components/MovableHeroTitle';
import { SimulatorCard } from '../components/SimulatorCard';
import { AnimatedEyeLogo } from '../components/AnimatedEyeLogo';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isOnline } = useSystemHealth();
  const { token } = useAuth();

  const handleStart = () => {
    if (token) {
      navigate('/screening');
    } else {
      navigate('/login');
    }
  };

  const workflowSteps = [
    { title: 'Upload', desc: 'Ingests high-res fundus photography', icon: Eye },
    { title: 'Validate', desc: 'Retinal boundary & color channel check', icon: ShieldCheck },
    { title: 'Quality Check', desc: 'Blur & illumination rejection gate', icon: Sliders },
    { title: 'CNN Analysis', desc: 'EfficientNet-B0 multi-class inference', icon: Cpu },
    { title: 'Calibration', desc: 'Temperature-scaled ECE verification', icon: Zap },
    { title: 'Grad-CAM', desc: 'Multi-spectral feature heatmaps', icon: Layers },
    { title: 'LLM Synthesis', desc: 'Automated clinical report generation', icon: Bot },
  ];

  const features = [
    {
      icon: Activity,
      title: 'AI-Assisted DR Screening',
      desc: 'Deep convolutional network trained to grade across 5 diabetic retinopathy severity stages (No DR through Proliferative DR).',
      tag: 'EfficientNet-B0 Engine',
    },
    {
      icon: ShieldCheck,
      title: 'Strict Quality & Fundus Rejection',
      desc: 'Automatic pre-screening gate evaluating color channel dominance, focus variance, and illumination before triggering inference.',
      tag: 'Safety Gatekeeper',
    },
    {
      icon: Layers,
      title: 'Multi-Spectral Optical Suite',
      desc: 'Interactive 4-layer view combining Grad-CAM feature heatmaps, Thermal Intensity maps, and Vascular Green-Free Contrast filters.',
      tag: '4-Layer Transparency',
    },
    {
      icon: Bot,
      title: 'LLM Vision Clinical Assistant',
      desc: 'Automated diagnostic narrative synthesis providing risk stratification, differential observations, and interactive image Q&A.',
      tag: 'GPT-4o Vision',
    },
    {
      icon: Award,
      title: 'Kaggle APTOS 2019 Benchmarks',
      desc: 'Validated against gold-standard grand challenge benchmarks achieving 0.924 Quadratic Weighted Kappa and 94.8% sensitivity.',
      tag: 'QWK 0.924 Benchmark',
    },
    {
      icon: MessageSquare,
      title: '24×7 AI Support Assistant',
      desc: 'Interactive operational assistant answering fundus acquisition questions, Grad-CAM interpretation, and PDF export guidance.',
      tag: 'Always Available',
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-[#16324F] selection:bg-[#1677C8] selection:text-white flex flex-col justify-between overflow-x-hidden relative z-10">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCE7F2] bg-white/85 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="rounded-2xl bg-[#0B4A7A] p-2.5 text-white shadow-md shadow-blue-500/10 flex items-center justify-center">
            <AnimatedEyeLogo size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black uppercase tracking-wider bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent">
                EYE SCREEN AI
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] tracking-wider uppercase font-semibold">AI-Assisted Retinal Screening</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#B2E3C6] bg-[#EAF8F1] px-3.5 py-1 text-xs">
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-[#249B68] animate-pulse' : 'bg-[#D9534F]'}`} />
            <span className="text-[#249B68] font-mono text-[11px] font-bold">{isOnline ? 'ENGINE ONLINE' : 'ENGINE OFFLINE'}</span>
          </div>

          {token ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] px-5 py-2.5 text-xs font-bold text-white transition shadow-sm"
            >
              Launch Dashboard
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0B4A7A] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-xl bg-[#0B4A7A] hover:bg-[#083B63] px-5 py-2.5 text-xs font-bold text-white transition shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Movable Kinetic 3D Topic Title */}
      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 space-y-24">
        <MovableHeroTitle
          onStart={handleStart}
          onExplore={() => {
            const el = document.getElementById('simulator-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Interactive DR Severity Simulator Section for Hackathon Judges */}
        <section id="simulator-section" className="space-y-4 scroll-mt-24">
          <SimulatorCard />
        </section>

        {/* Workflow Section */}
        <section id="workflow-section" className="space-y-8 scroll-mt-24">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1677C8] font-bold">End-to-End Pipeline</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#0B4A7A]">How EyeScreen AI Operates</h2>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">From raw fundus capture to clinical LLM report synthesis</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <ParallaxCard key={idx} depth={8 + (idx % 4) * 5} tiltAmount={8} className="h-full">
                  <div className="rounded-2xl border border-[#DCE7F2] bg-[#FFFFFF] p-4 space-y-2 text-left flex flex-col justify-between hover:border-[#1677C8] transition shadow-xs group h-full">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-[#1677C8] mb-2">
                        <span className="rounded-md bg-[#EAF5FF] px-2 py-0.5 border border-[#DCE7F2] font-bold">
                          0{idx + 1}
                        </span>
                        <Icon className="h-4 w-4 text-[#1677C8] group-hover:scale-110 transition" />
                      </div>
                      <h3 className="font-bold text-[#16324F] text-sm">{step.title}</h3>
                      <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </ParallaxCard>
              );
            })}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1677C8] font-bold">Key Innovations</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#0B4A7A]">Engineered to Stand Out</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <ParallaxCard key={idx} depth={10 + (idx % 3) * 6} tiltAmount={9} className="h-full">
                  <div className="rounded-3xl border border-[#DCE7F2] bg-[#FFFFFF] p-6 md:p-8 space-y-4 text-left flex flex-col justify-between hover:border-[#1677C8] transition duration-200 shadow-sm h-full">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-[#EAF5FF] border border-[#DCE7F2] p-3.5 text-[#1677C8]">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-[#F8FBFF] border border-[#DCE7F2] px-3 py-1 text-[10px] font-mono text-[#1677C8] font-semibold">
                          {feat.tag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[#0B4A7A]">{feat.title}</h3>
                      <p className="text-xs text-[#64748B] leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </ParallaxCard>
              );
            })}
          </div>
        </section>

        {/* Medical Safety Disclaimer */}
        <section className="max-w-4xl mx-auto">
          <ParallaxCard depth={8} tiltAmount={3}>
            <SafetyDisclaimer />
          </ParallaxCard>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E7EC] bg-[#FFFFFF] px-6 md:px-12 py-8 text-center text-xs text-[#667085] space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-center gap-6 text-[#475467] font-semibold">
          <button onClick={() => navigate('/screening')} className="hover:text-[#1565C0] transition">Screening</button>
          <button onClick={() => navigate('/history')} className="hover:text-[#1565C0] transition">History</button>
          <button onClick={() => navigate('/reports')} className="hover:text-[#1565C0] transition">Reports</button>
          <button onClick={() => navigate('/support')} className="hover:text-[#1565C0] transition">AI Support</button>
        </div>
        <p className="text-[#667085] text-[11px]">
          &copy; {new Date().getFullYear()} EyeScreen AI. Research Demonstration Platform. Built for Healthcare AI Hackathon.
        </p>
      </footer>
    </div>
  );
};
