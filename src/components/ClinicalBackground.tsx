import React from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';

export const ClinicalBackground: React.FC = () => {
  const { normX, normY } = useMouseParallax(1);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Base Light Atmospheric Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F8FBFF] via-[#F4F9FE] to-[#EAF5FF]" />

      {/* 2. Soft Multi-Spectral Breathing Atmospheric Glow Orbs (Deep Layer Parallax) */}
      <div
        className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#DDF4FF]/60 blur-3xl animate-pulse-glow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 20).toFixed(1)}px, ${(normY * 20).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute top-1/4 -right-20 h-[34rem] w-[34rem] rounded-full bg-[#E0F2FE]/70 blur-3xl animate-pulse-glow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -25).toFixed(1)}px, ${(normY * -25).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute bottom-10 left-1/4 h-96 w-96 rounded-full bg-[#FF8A7A]/10 blur-3xl animate-pulse-glow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 15).toFixed(1)}px, ${(normY * 15).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute -bottom-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-[#FFB45C]/12 blur-3xl animate-pulse-glow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -18).toFixed(1)}px, ${(normY * -18).toFixed(1)}px, 0)` }}
      />

      {/* 3. Subtle Dot-Matrix Tech Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#0B4A7A_1px,transparent_1px)] [background-size:32px_32px] transition-transform duration-200 ease-out"
        style={{ transform: `translate3d(${(normX * 8).toFixed(1)}px, ${(normY * 8).toFixed(1)}px, 0)` }}
      />

      {/* 4. Top-Left Flowing Cyan-Blue & Coral Wave Contours */}
      <svg
        className="absolute -top-12 -left-12 w-[36rem] h-[36rem] opacity-30 animate-float-slow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 14).toFixed(1)}px, ${(normY * 14).toFixed(1)}px, 0)` }}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradTL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B5E8E" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#1677C8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FF8A7A" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M-50,200 C150,120 250,300 450,150 C550,75 580,-50 600,-100 L-100,-100 Z"
          fill="url(#waveGradTL)"
        />
        <path
          d="M-80,260 C120,180 280,340 500,200 C580,140 620,20 650,-40 L-100,-100 Z"
          fill="url(#waveGradTL)"
          opacity="0.6"
        />
      </svg>

      {/* 5. Bottom-Right Flowing Orange/Coral & Blue Wave Contours */}
      <svg
        className="absolute -bottom-16 -right-16 w-[38rem] h-[38rem] opacity-25 animate-float-delayed transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -16).toFixed(1)}px, ${(normY * -16).toFixed(1)}px, 0)` }}
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradBR" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FFB45C" stopOpacity="0.35" />
            <stop offset="40%" stopColor="#FF8A7A" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0B5E8E" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <path
          d="M650,400 C450,480 350,300 150,450 C50,525 20,650 0,700 L700,700 Z"
          fill="url(#waveGradBR)"
        />
        <path
          d="M680,340 C480,420 320,260 100,400 C20,460 -20,580 -50,640 L750,750 Z"
          fill="url(#waveGradBR)"
          opacity="0.5"
        />
      </svg>

      {/* 6. TOP-RIGHT ULTIMATE ANIMATED RETINAL HUD & FLOWING VASCULAR SYSTEM (Dynamic Mouse Responsive) */}
      <div
        className="absolute top-0 right-0 w-[42rem] h-[42rem] opacity-25 md:opacity-30 flex items-center justify-center overflow-hidden transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -30).toFixed(1)}px, ${(normY * -30).toFixed(1)}px, 0)` }}
      >
        {/* Soft radial backdrop mask */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#F8FBFF] pointer-events-none" />

        {/* Retinal Fundus Structure SVG with FLOWING BLOOD VESSEL PULSES */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-[#0B4A7A]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="opticGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1677C8" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#0B4A7A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0B4A7A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Retinal Boundary Rim with rotating tick marks */}
          <circle cx="250" cy="250" r="210" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.5" className="animate-spin-slow" />
          <circle cx="250" cy="250" r="235" stroke="currentColor" strokeWidth="1" opacity="0.3" className="animate-spin-reverse" />

          {/* Optic Disc Center Glow */}
          <circle cx="210" cy="230" r="50" fill="url(#opticGlow)" className="animate-pulse-halo" />
          <circle cx="210" cy="230" r="24" fill="#FFFFFF" opacity="0.6" />
          <circle cx="210" cy="230" r="14" fill="#0B4A7A" opacity="0.35" />

          {/* Major Retinal Vessel Arcs */}
          <g stroke="currentColor" strokeLinecap="round" opacity="0.8">
            {/* Superior Temporal Branch (Base) */}
            <path d="M210,208 C220,160 270,110 350,90 C390,80 430,85 450,95" strokeWidth="3" />
            <path d="M270,140 C300,120 340,115 380,120" strokeWidth="1.8" />
            
            {/* Superior Temporal Branch (ANIMATED FLOWING SIGNAL PULSE) */}
            <path d="M210,208 C220,160 270,110 350,90 C390,80 430,85 450,95" stroke="#38BDF8" strokeWidth="3.5" className="animate-vessel-flow" />

            {/* Inferior Temporal Branch (Base) */}
            <path d="M210,252 C225,300 280,350 360,370 C400,380 440,370 460,355" strokeWidth="3" />
            <path d="M275,320 C310,340 350,345 390,340" strokeWidth="1.8" />
            
            {/* Inferior Temporal Branch (ANIMATED FLOWING SIGNAL PULSE) */}
            <path d="M210,252 C225,300 280,350 360,370 C400,380 440,370 460,355" stroke="#FF8A7A" strokeWidth="3.5" className="animate-vessel-flow" />

            {/* Superior Nasal Branch */}
            <path d="M195,215 C170,170 120,130 60,110 C30,100 10,105 0,110" strokeWidth="2.5" />
            <path d="M195,215 C170,170 120,130 60,110 C30,100 10,105 0,110" stroke="#38BDF8" strokeWidth="2.8" className="animate-vessel-flow" />

            {/* Inferior Nasal Branch */}
            <path d="M195,245 C170,290 120,330 60,350 C30,360 10,355 0,350" strokeWidth="2.5" />

            {/* Macular Foveal Zone Target */}
            <circle cx="310" cy="230" r="20" stroke="#1677C8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" className="animate-spin-slow" />
            <circle cx="310" cy="230" r="5" fill="#1677C8" opacity="0.7" className="animate-ping" />
          </g>

          {/* Futuristic HUD Crosshairs & Angular Degrees */}
          <g stroke="currentColor" opacity="0.35" strokeWidth="1">
            <line x1="250" y1="15" x2="250" y2="485" strokeDasharray="4 4" />
            <line x1="15" y1="250" x2="485" y2="250" strokeDasharray="4 4" />
            <text x="255" y="30" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold">0° N</text>
            <text x="455" y="245" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold">90° E</text>
            <text x="255" y="475" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold">180° S</text>
            <text x="25" y="245" fill="currentColor" fontSize="10" fontFamily="monospace" fontWeight="bold">270° W</text>
          </g>
        </svg>

        {/* Animated Concentric Retinal Radar Scope Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-80 w-80 rounded-full border-2 border-[#1677C8]/35 animate-pulse" />
          <div className="absolute h-[26rem] w-[26rem] rounded-full border border-dashed border-[#0B4A7A]/30 animate-spin-slow" />
          <div className="absolute h-[30rem] w-[30rem] rounded-full border border-[#FF8A7A]/25 animate-spin-reverse" />
        </div>

        {/* 360° Rotating Radar Sweep Blade */}
        <div className="absolute w-[40rem] h-[40rem] rounded-full animate-radar-sweep opacity-30 pointer-events-none bg-conic from-[#38BDF8]/40 via-transparent to-transparent" />

        {/* Vertical Laser Beam Sweep */}
        <div className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent shadow-[0_0_20px_#38BDF8] animate-scan-sweep" />
      </div>

      {/* 7. BOTTOM-LEFT ANIMATED RETINAL VESSEL & NEURAL NETWORK MESH */}
      <div
        className="absolute bottom-0 left-0 w-[28rem] h-[28rem] opacity-20 md:opacity-25 pointer-events-none animate-float-slow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 22).toFixed(1)}px, ${(normY * 22).toFixed(1)}px, 0)` }}
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full text-[#0B4A7A]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g stroke="currentColor" strokeLinecap="round" opacity="0.85">
            <path d="M0,400 C80,320 160,280 240,220 C300,175 350,120 400,80" strokeWidth="3" />
            <path d="M0,400 C80,320 160,280 240,220 C300,175 350,120 400,80" stroke="#38BDF8" strokeWidth="3" className="animate-vessel-flow" />
            <path d="M120,300 C180,260 220,240 280,210" strokeWidth="1.8" />
            <path d="M200,235 C240,190 290,160 340,140" strokeWidth="1.5" />
            
            {/* Synapse Nodes */}
            <circle cx="240" cy="220" r="7" fill="#1677C8" opacity="0.7" className="animate-ping" />
            <circle cx="120" cy="300" r="5" fill="#0B4A7A" opacity="0.6" className="animate-pulse" />
            <circle cx="280" cy="210" r="5" fill="#FF8A7A" opacity="0.6" className="animate-pulse" />
          </g>
        </svg>
      </div>

      {/* 8. FLOATING HIGH-TECH MEDTECH DATA BADGES & NEURAL PARTICLES */}
      {/* Top-Left Floating Badge */}
      <div
        className="absolute top-20 left-12 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 border border-[#BAE6FD] text-[10px] font-mono font-extrabold text-[#0B4A7A] shadow-md animate-float-slow backdrop-blur-xs transition-transform duration-200 ease-out"
        style={{ transform: `translate3d(${(normX * 16).toFixed(1)}px, ${(normY * 16).toFixed(1)}px, 0)` }}
      >
        <span className="h-2 w-2 rounded-full bg-[#249B68] animate-ping" />
        AI CLINICAL MESH ACTIVE
      </div>

      {/* Middle-Left Floating Badge */}
      <div
        className="absolute top-1/2 left-8 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 border border-[#BAE6FD] text-[10px] font-mono font-extrabold text-[#1677C8] shadow-md animate-float-delayed backdrop-blur-xs transition-transform duration-200 ease-out"
        style={{ transform: `translate3d(${(normX * 24).toFixed(1)}px, ${(normY * 24).toFixed(1)}px, 0)` }}
      >
        <span className="h-2 w-2 rounded-full bg-[#1677C8] animate-pulse" />
        GRAD-CAM OPTICAL HEATMAP · 512×512
      </div>

      {/* Bottom-Right Floating Badge */}
      <div
        className="absolute bottom-24 right-1/4 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/85 border border-[#FED7AA] text-[10px] font-mono font-extrabold text-[#D97706] shadow-md animate-float-slow backdrop-blur-xs transition-transform duration-200 ease-out"
        style={{ transform: `translate3d(${(normX * -20).toFixed(1)}px, ${(normY * -20).toFixed(1)}px, 0)` }}
      >
        <span className="h-2 w-2 rounded-full bg-[#F4A340] animate-ping" />
        MULTI-SPECTRAL CLAHE
      </div>

      {/* Neural Node Particles Drifting Across Viewport */}
      <div
        className="absolute top-28 left-1/3 h-3 w-3 rounded-full bg-[#1677C8]/40 animate-ping transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 12).toFixed(1)}px, ${(normY * 12).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute top-2/5 left-1/6 h-2.5 w-2.5 rounded-full bg-[#0B4A7A]/50 animate-pulse-glow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 18).toFixed(1)}px, ${(normY * 18).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute bottom-40 right-1/3 h-3 w-3 rounded-full bg-[#FF8A7A]/45 animate-float-slow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -15).toFixed(1)}px, ${(normY * -15).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute top-1/2 right-1/5 h-2.5 w-2.5 rounded-full bg-[#249B68]/40 animate-pulse transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * -22).toFixed(1)}px, ${(normY * -22).toFixed(1)}px, 0)` }}
      />
      <div
        className="absolute bottom-1/4 left-1/2 h-2 w-2 rounded-full bg-[#6366F1]/40 animate-ping transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${(normX * 10).toFixed(1)}px, ${(normY * 10).toFixed(1)}px, 0)` }}
      />

      {/* Hexagon motif top-center */}
      <svg
        className="absolute top-14 left-1/2 -translate-x-1/2 w-20 h-20 opacity-25 text-[#0B4A7A] animate-spin-slow transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(calc(-50% + ${(normX * 15).toFixed(1)}px), ${(normY * 15).toFixed(1)}px, 0)` }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <polygon points="50,5 90,27 90,73 50,95 10,73 10,27" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="10" fill="currentColor" opacity="0.2" className="animate-ping" />
      </svg>
    </div>
  );
};
