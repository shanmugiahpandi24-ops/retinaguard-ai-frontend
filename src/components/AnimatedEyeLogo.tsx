import React from 'react';

interface AnimatedEyeLogoProps {
  className?: string;
  size?: number; // Size in px (default 24)
  cuteGlow?: boolean;
}

export const AnimatedEyeLogo: React.FC<AnimatedEyeLogoProps> = ({
  className = '',
  size = 24,
  cuteGlow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {cuteGlow && (
        <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-sm animate-pulse" />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible relative z-10"
      >
        {/* Outer Eye Outline with Natural Double Eyelid Blink */}
        <g className="animate-eye-blink">
          {/* Outer Eyelid Curve with Soft Rounded Ends */}
          <path
            d="M2 12C2 12 5.5 4.5 12 4.5C18.5 4.5 22 12 22 12C22 12 18.5 19.5 12 19.5C5.5 19.5 2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Cute Upper Lash Accent Line */}
          <path
            d="M5 8.5C7.5 6.5 9.8 5.8 12 5.8C14.2 5.8 16.5 6.5 19 8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Animated Gaze Iris Group with Micro-Pulse */}
          <g className="animate-pupil-pulse">
            {/* Iris Outer Ring */}
            <circle
              cx="12"
              cy="12"
              r="4.2"
              stroke="currentColor"
              strokeWidth="1.8"
              opacity="0.9"
            />

            {/* Pupil Core */}
            <circle
              cx="12"
              cy="12"
              r="2.2"
              fill="currentColor"
            />

            {/* Main Cute Shiny Catchlight */}
            <circle
              cx="13.3"
              cy="10.4"
              r="1.0"
              fill="#FFFFFF"
              className="animate-pulse"
            />

            {/* Secondary Cute Mini Catchlight */}
            <circle
              cx="10.7"
              cy="13.3"
              r="0.6"
              fill="#FFFFFF"
              opacity="0.95"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
