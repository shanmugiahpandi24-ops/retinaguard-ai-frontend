import React, { useState, useEffect, useRef } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { Sparkles, Eye, ShieldCheck, Activity, Cpu } from 'lucide-react';

const DESC_TEXT =
  'Upload a retinal fundus photograph and receive instant AI-assisted diabetic retinopathy screening with pre-inference quality gates, explainability heatmaps, and automated clinical documentation.';

interface MovableHeroTitleProps {
  onStart: () => void;
  onExplore: () => void;
}

export const MovableHeroTitle: React.FC<MovableHeroTitleProps> = ({ onStart, onExplore }) => {
  const { normX, normY } = useMouseParallax(1);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const [localHover, setLocalHover] = useState({ rotX: 0, rotY: 0, isHovered: false });

  // Hero Text Animation States
  const [titleAnimated, setTitleAnimated] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setPrefersReducedMotion(true);
      setTitleAnimated(true);
      setTypedText(DESC_TEXT);
      setIsTypingStarted(true);
      setIsTypingFinished(true);
      return;
    }

    // 0.0s -> Title center-out expansion begins
    const titleTimer = setTimeout(() => {
      setTitleAnimated(true);
    }, 60);

    // ~1.8s -> Description typewriter animation starts
    let typeInterval: ReturnType<typeof setInterval> | null = null;
    const descTimer = setTimeout(() => {
      setIsTypingStarted(true);
      let currentIdx = 0;
      typeInterval = setInterval(() => {
        currentIdx++;
        setTypedText(DESC_TEXT.slice(0, currentIdx));
        if (currentIdx >= DESC_TEXT.length) {
          if (typeInterval) clearInterval(typeInterval);
          setTimeout(() => {
            setIsTypingFinished(true);
          }, 500);
        }
      }, 28); // ~28ms per character
    }, 1800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(descTimer);
      if (typeInterval) clearInterval(typeInterval);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!titleContainerRef.current) return;
    const rect = titleContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Smooth local tilt angles
    const rotY = (x / (rect.width / 2)) * 12;
    const rotX = -(y / (rect.height / 2)) * 12;

    setLocalHover({ rotX, rotY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setLocalHover({ rotX: 0, rotY: 0, isHovered: false });
  };

  // Combined mouse parallax + local tilt transform
  const titleTransform = `
    perspective(1200px)
    translate3d(${(normX * 25).toFixed(1)}px, ${(normY * 25).toFixed(1)}px, 30px)
    rotateX(${(localHover.rotX || normY * -8).toFixed(2)}deg)
    rotateY(${(localHover.rotY || normX * 8).toFixed(2)}deg)
    scale3d(${localHover.isHovered ? 1.03 : 1}, ${localHover.isHovered ? 1.03 : 1}, 1)
  `;

  return (
    <div
      ref={titleContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-center space-y-8 max-w-4xl mx-auto py-4 select-none cursor-grab active:cursor-grabbing"
    >
      {/* Background Animated Retinal Halo Ring behind Topic Title */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] pointer-events-none opacity-20 -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(calc(-50% + ${(normX * -35).toFixed(1)}px), calc(-50% + ${(normY * -35).toFixed(1)}px), 0)`,
        }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full text-[#1677C8]" fill="none">
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 8" className="animate-spin-slow" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="animate-spin-reverse" />
          <circle cx="200" cy="200" r="90" stroke="#FF8A7A" strokeWidth="1.5" opacity="0.6" className="animate-pulse" />
        </svg>
      </div>

      {/* 1. TOP FLOATING BADGE */}
      <div
        className="inline-block transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) translate3d(${(normX * 15).toFixed(1)}px, ${(normY * 15).toFixed(1)}px, 15px)`,
        }}
      >
        <div className="inline-flex items-center gap-2.5 rounded-full border border-[#BAE6FD] bg-[#EAF5FF]/90 backdrop-blur-md px-5 py-2 text-xs font-black text-[#0B4A7A] shadow-sm hover:border-[#1677C8] transition duration-300">
          <Sparkles className="h-4 w-4 text-[#1677C8] animate-pulse" />
          <span className="tracking-wide">MULTIMODAL EXPLAINABLE RETINAL SCREENING PLATFORM</span>
        </div>
      </div>

      {/* 2. MAIN TOPIC TITLE - EYESCREEN AI (MOVABLE KINETIC 3D TYPOGRAPHY) */}
      <div
        className="relative transition-transform duration-300 ease-out will-change-transform py-2"
        style={{
          transform: titleTransform,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow halo behind title */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B4A7A]/20 via-[#1677C8]/30 to-[#38BDF8]/20 blur-2xl opacity-60 pointer-events-none rounded-full" />

        {/* High-Tech Animated Clinical Laser Scan Line */}
        <div className="absolute -inset-y-4 left-0 right-0 pointer-events-none overflow-hidden opacity-40">
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#1677C8] to-transparent animate-laser-scan shadow-[0_0_12px_#1677C8]" />
        </div>

        {/* Hero Title with Center-Origin Letter-Spacing Expansion Animation */}
        <h1 className="relative text-6xl sm:text-7xl md:text-9xl font-black tracking-tight text-[#0B4A7A] leading-none drop-shadow-md select-none overflow-hidden max-w-full px-2">
          <span className="inline-flex flex-wrap justify-center items-center bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] bg-clip-text text-transparent animate-gradient-text">
            {['E', 'Y', 'E', ' ', 'S', 'C', 'R', 'E', 'E', 'N', ' ', 'A', 'I'].map((char, i) => {
              const centerIdx = 6;
              const distFromCenter = Math.abs(i - centerIdx);
              const initialShiftX = (centerIdx - i) * 2.8; // Condense toward center initially

              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: prefersReducedMotion || titleAnimated ? 'translate3d(0px, 0px, 0px)' : `translate3d(${initialShiftX}px, 0px, 0px)`,
                    opacity: prefersReducedMotion || titleAnimated ? 1 : 0,
                    transition: prefersReducedMotion
                      ? 'none'
                      : `transform 1400ms cubic-bezier(0.22, 1, 0.36, 1) ${distFromCenter * 75}ms, opacity 1400ms cubic-bezier(0.22, 1, 0.36, 1) ${distFromCenter * 75}ms`,
                    willChange: 'transform, opacity',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </span>
        </h1>

        {/* Movable Subtitle */}
        <p className="text-2xl sm:text-4xl font-black text-[#1677C8] tracking-tight mt-3 drop-shadow-xs">
          AI-Assisted Retinal Screening & Diagnosis
        </p>

        {/* Description with Fast Seamless Typewriter Animation */}
        <p className="text-sm md:text-base text-[#475569] max-w-2xl mx-auto font-medium leading-relaxed mt-4 min-h-[4.5rem]">
          {typedText}
          {!isTypingFinished && (
            <span
              className={`inline-block w-[2px] h-[1.1em] bg-[#1677C8] ml-0.5 align-middle transition-opacity duration-500 ${
                isTypingStarted ? 'animate-pulse opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </p>
      </div>

      {/* 3. MOVABLE STAT COUNTER CARDS WITH GLOW ANIMATIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2 text-xs font-mono">
        <div
          className="rounded-2xl border border-[#DCE7F2] bg-white/95 backdrop-blur-sm p-4 shadow-sm text-center hover:border-[#1677C8] transition-all duration-300 hover:-translate-y-1 animate-glow-border"
          style={{ transform: `translate3d(${(normX * 18).toFixed(1)}px, ${(normY * 18).toFixed(1)}px, 0)` }}
        >
          <span className="text-[#1677C8] font-black text-xl block">0.924 QWK</span>
          <span className="text-[#64748B] text-[10px] font-semibold">Kaggle APTOS Benchmark</span>
        </div>

        <div
          className="rounded-2xl border border-[#DCE7F2] bg-white/95 backdrop-blur-sm p-4 shadow-sm text-center hover:border-[#1677C8] transition-all duration-300 hover:-translate-y-1 animate-glow-border"
          style={{ transform: `translate3d(${(normX * 24).toFixed(1)}px, ${(normY * 24).toFixed(1)}px, 0)` }}
        >
          <span className="text-[#1677C8] font-black text-xl block">4 LAYERS</span>
          <span className="text-[#64748B] text-[10px] font-semibold">Multi-Spectral Optics</span>
        </div>

        <div
          className="rounded-2xl border border-[#DCE7F2] bg-white/95 backdrop-blur-sm p-4 shadow-sm text-center hover:border-[#1677C8] transition-all duration-300 hover:-translate-y-1 animate-glow-border"
          style={{ transform: `translate3d(${(normX * 14).toFixed(1)}px, ${(normY * 14).toFixed(1)}px, 0)` }}
        >
          <span className="text-[#1677C8] font-black text-xl block">GPT-4o</span>
          <span className="text-[#64748B] text-[10px] font-semibold">LLM Vision Analysis</span>
        </div>

        <div
          className="rounded-2xl border border-[#DCE7F2] bg-white/95 backdrop-blur-sm p-4 shadow-sm text-center hover:border-[#249B68] transition-all duration-300 hover:-translate-y-1 animate-glow-border"
          style={{ transform: `translate3d(${(normX * 20).toFixed(1)}px, ${(normY * 20).toFixed(1)}px, 0)` }}
        >
          <span className="text-[#249B68] font-black text-xl block">T = 1.2</span>
          <span className="text-[#64748B] text-[10px] font-semibold">Calibrated Confidence</span>
        </div>
      </div>

      {/* 4. MOVABLE CTA BUTTONS */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 transition-transform duration-200 ease-out"
        style={{ transform: `translate3d(${(normX * 12).toFixed(1)}px, ${(normY * 12).toFixed(1)}px, 0)` }}
      >
        <button
          onClick={onStart}
          className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0B4A7A] via-[#1677C8] to-[#083B63] hover:from-[#083B63] hover:to-[#0B4A7A] px-10 py-4.5 text-sm font-black text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
        >
          <span>Start Screening</span>
          <Eye className="h-4.5 w-4.5 text-white group-hover:scale-110 transition duration-200" />
        </button>

        <button
          onClick={onExplore}
          className="w-full sm:w-auto rounded-2xl border border-[#CBD5E1] bg-white px-8 py-4.5 text-sm font-extrabold text-[#0B4A7A] hover:bg-[#EAF5FF] hover:border-[#1677C8] transition-all duration-300 shadow-xs hover:shadow-md"
        >
          Explore Platform Architecture
        </button>
      </div>
    </div>
  );
};
