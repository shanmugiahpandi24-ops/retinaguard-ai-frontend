import React, { useState, useRef } from 'react';
import { useMouseParallax } from '../hooks/useMouseParallax';

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;         // Pixel parallax displacement (e.g. 10 to 30)
  tiltAmount?: number;    // Degree tilt angle on card hover (e.g. 5 to 15)
  enableGlobalParallax?: boolean; // Follow global screen mouse
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = '',
  depth = 12,
  tiltAmount = 8,
  enableGlobalParallax = true,
  style = {},
  onClick,
}) => {
  const globalParallax = useMouseParallax();
  const cardRef = useRef<HTMLDivElement>(null);
  const [localTransform, setLocalTransform] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt math: rotating around Y axis moves X, rotating around X axis moves Y (inverted)
    const rotateY = ((x - centerX) / centerX) * tiltAmount;
    const rotateX = -((y - centerY) / centerY) * tiltAmount;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setLocalTransform({ rotateX, rotateY, glowX, glowY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setLocalTransform((prev) => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  };

  // Calculate combined global + local translation
  const globalX = enableGlobalParallax ? globalParallax.normX * depth : 0;
  const globalY = enableGlobalParallax ? globalParallax.normY * depth : 0;

  const combinedTransform = `
    perspective(1000px)
    translate3d(${globalX.toFixed(2)}px, ${globalY.toFixed(2)}px, 0px)
    rotateX(${localTransform.rotateX.toFixed(2)}deg)
    rotateY(${localTransform.rotateY.toFixed(2)}deg)
    scale3d(${localTransform.isHovered ? 1.02 : 1}, ${localTransform.isHovered ? 1.02 : 1}, 1)
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: combinedTransform,
        transformStyle: 'preserve-3d',
        ...style,
      }}
    >
      {/* Specular Light Sheen Highlight on Hover */}
      {localTransform.isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 opacity-40 z-20"
          style={{
            background: `radial-gradient(circle at ${localTransform.glowX}% ${localTransform.glowY}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};
