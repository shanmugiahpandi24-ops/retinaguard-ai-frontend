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
  depth = 0,
  tiltAmount = 0,
  enableGlobalParallax = false,
  style = {},
  onClick,
}) => {
  const globalParallax = useMouseParallax();
  const cardRef = useRef<HTMLDivElement>(null);
  const [localTransform, setLocalTransform] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50, isHovered: false });

  const isStatic = depth === 0 && tiltAmount === 0 && !enableGlobalParallax;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isStatic || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * tiltAmount;
    const rotateX = -((y - centerY) / centerY) * tiltAmount;

    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setLocalTransform({ rotateX, rotateY, glowX, glowY, isHovered: true });
  };

  const handleMouseLeave = () => {
    if (isStatic) return;
    setLocalTransform((prev) => ({ ...prev, rotateX: 0, rotateY: 0, isHovered: false }));
  };

  if (isStatic) {
    return (
      <div ref={cardRef} onClick={onClick} className={className} style={style}>
        {children}
      </div>
    );
  }

  const globalX = enableGlobalParallax ? globalParallax.normX * depth : 0;
  const globalY = enableGlobalParallax ? globalParallax.normY * depth : 0;

  const combinedTransform = `
    perspective(1000px)
    translate3d(${globalX.toFixed(2)}px, ${globalY.toFixed(2)}px, 0px)
    rotateX(${localTransform.rotateX.toFixed(2)}deg)
    rotateY(${localTransform.rotateY.toFixed(2)}deg)
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
      {children}
    </div>
  );
};
