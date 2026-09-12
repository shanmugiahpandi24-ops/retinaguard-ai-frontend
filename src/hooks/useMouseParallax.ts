import { useState, useEffect, useRef } from 'react';

interface MouseParallaxState {
  normX: number; // Normalized -1 to 1 from screen center
  normY: number; // Normalized -1 to 1 from screen center
  pxX: number;   // Raw pixel delta from center
  pxY: number;   // Raw pixel delta from center
}

export function useMouseParallax(sensitivity: number = 1): MouseParallaxState {
  const [coords, setCoords] = useState<MouseParallaxState>({
    normX: 0,
    normY: 0,
    pxX: 0,
    pxY: 0,
  });

  const targetRef = useRef({ normX: 0, normY: 0, pxX: 0, pxY: 0 });
  const currentRef = useRef({ normX: 0, normY: 0, pxX: 0, pxY: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const pxX = (e.clientX - centerX) * sensitivity;
      const pxY = (e.clientY - centerY) * sensitivity;
      const normX = (pxX / (centerX || 1));
      const normY = (pxY / (centerY || 1));

      targetRef.current = { normX, normY, pxX, pxY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth LERP animation loop
    const animate = () => {
      const lerp = 0.08;
      const cur = currentRef.current;
      const tgt = targetRef.current;

      cur.normX += (tgt.normX - cur.normX) * lerp;
      cur.normY += (tgt.normY - cur.normY) * lerp;
      cur.pxX += (tgt.pxX - cur.pxX) * lerp;
      cur.pxY += (tgt.pxY - cur.pxY) * lerp;

      if (
        Math.abs(cur.normX - tgt.normX) > 0.0001 ||
        Math.abs(cur.normY - tgt.normY) > 0.0001
      ) {
        setCoords({
          normX: Number(cur.normX.toFixed(4)),
          normY: Number(cur.normY.toFixed(4)),
          pxX: Number(cur.pxX.toFixed(1)),
          pxY: Number(cur.pxY.toFixed(1)),
        });
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [sensitivity]);

  return coords;
}
