import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface IntroVideoSplashScreenProps {
  onComplete?: () => void;
  videoSrc?: string;
  durationSeconds?: number;
}

export const IntroVideoSplashScreen: React.FC<IntroVideoSplashScreenProps> = ({
  onComplete,
  videoSrc = '/intro_video.mp4',
  durationSeconds = 4,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashFading, setFlashFading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    if (isFadingOut || isFlashing) return;

    // Trigger high-tech camera shutter / optical white flash
    setIsFlashing(true);
    if (onComplete) onComplete();

    // Fade out the white flash overlay seamlessly
    setTimeout(() => {
      setFlashFading(true);
      setIsFadingOut(true);
    }, 60);

    // Complete transition and unmount splash
    setTimeout(() => {
      setIsVisible(false);
    }, 700);
  };

  useEffect(() => {
    // 4-Second strict countdown progress bar
    const intervalMs = 40;
    const totalSteps = (durationSeconds * 1000) / intervalMs;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const currentPct = Math.min((currentStep / totalSteps) * 100, 100);
      setProgress(currentPct);

      if (currentStep >= totalSteps) {
        clearInterval(timer);
        handleFinish();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [durationSeconds]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. White Optical Flash Transition Overlay */}
      {isFlashing && (
        <div
          className={`fixed inset-0 z-[100000] bg-white transition-opacity duration-700 ease-out pointer-events-none ${
            flashFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* Radial light flare glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1)_0%,_rgba(234,245,255,0.8)_60%,_rgba(255,255,255,0)_100%)] animate-pulse" />
        </div>
      )}

      {/* 2. Main Intro Video Overlay */}
      <div
        className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071321] text-white transition-opacity duration-500 ease-out ${
          isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Background Video Player */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            onEnded={handleFinish}
            className="absolute inset-0 h-full w-full object-cover opacity-85"
          />
        ) : (
          /* High-Tech Animated Fallback (When video file is missing or loading) */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0B4A7A] via-[#071728] to-[#040C16] p-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-[#1677C8]/30 blur-3xl animate-pulse" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#38BDF8]/40 bg-[#071728]/80 backdrop-blur-md shadow-[0_0_50px_rgba(56,189,248,0.3)]">
                <Eye className="h-14 w-14 text-[#38BDF8] animate-pulse" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[#38BDF8] animate-spin" />
              </div>
            </div>
            <span className="text-3xl font-black tracking-widest text-[#EAF5FF] uppercase font-mono drop-shadow-md">
              EYE SCREEN AI
            </span>
            <span className="mt-2 text-xs font-mono tracking-widest text-[#38BDF8] uppercase font-bold">
              Initializing Clinical Neural Engine &bull; 4.0s Ingestion
            </span>
          </div>
        )}

        {/* Futuristic Cyber Overlay Grid */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#071321]/40 to-[#071321]/90" />

        {/* Top Bar Header */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-mono font-bold text-[#EAF5FF] backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-[#38BDF8] animate-pulse" />
            <span>EYE SCREEN AI &bull; CLINICAL INTRO</span>
          </div>

          <div className="flex items-center gap-3">
            {!videoError && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md hover:bg-white/10 transition"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="h-4 w-4 text-[#38BDF8]" /> : <Volume2 className="h-4 w-4 text-[#38BDF8]" />}
              </button>
            )}

            <button
              onClick={handleFinish}
              className="flex items-center gap-2 rounded-full border border-[#38BDF8]/40 bg-[#0B4A7A]/80 hover:bg-[#1677C8] px-5 py-2 text-xs font-black text-white shadow-lg backdrop-blur-md transition group"
            >
              <span>Skip Intro</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition duration-200" />
            </button>
          </div>
        </div>

        {/* Bottom Progress Bar (Exact 4.0 Seconds) */}
        <div className="absolute bottom-8 left-8 right-8 z-10 max-w-xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono font-bold text-[#38BDF8] tracking-wider">
            <span>STARTING PLATFORM</span>
            <span>{Math.round((progress / 100) * durationSeconds * 10) / 10}s / {durationSeconds}.0s</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 backdrop-blur">
            <div
              className="h-full bg-gradient-to-r from-[#1677C8] via-[#38BDF8] to-[#A7F3D0] transition-all duration-75 ease-linear shadow-[0_0_12px_#38BDF8]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
