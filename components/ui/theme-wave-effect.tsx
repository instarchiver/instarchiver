'use client';

import * as React from 'react';
import { animate, type JSAnimation } from 'animejs';

interface ThemeWaveEffectProps {
  triggerWave: boolean;
  originX: number;
  originY: number;
  isDarkMode: boolean;
  onComplete?: () => void;
}

export function ThemeWaveEffect({
  triggerWave,
  originX,
  originY,
  isDarkMode,
  onComplete,
}: ThemeWaveEffectProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<JSAnimation | null>(null);

  React.useEffect(() => {
    if (!triggerWave || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Calculate max radius needed to cover entire screen from origin point
    const maxRadius = Math.hypot(
      Math.max(originX, canvas.width - originX),
      Math.max(originY, canvas.height - originY)
    );

    // Animation properties
    const waveProps = {
      radius: 0,
      opacity: 1,
    };

    // Clear any existing animation
    if (animationRef.current) {
      animationRef.current.pause();
    }

    // Create the wave animation
    animationRef.current = animate(waveProps, {
      radius: maxRadius * 1.5,
      opacity: [1, 0.8, 0],
      duration: 1000,
      ease: 'out(3)',
      onUpdate: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw multiple wave circles for water drop effect
        const waves = 3;
        for (let i = 0; i < waves; i++) {
          const delay = i * 0.15;
          const waveRadius = Math.max(0, waveProps.radius - delay * maxRadius * 0.3);
          const waveOpacity = waveProps.opacity * (1 - i * 0.2);

          if (waveRadius > 0) {
            // Create gradient for the wave
            const gradient = ctx.createRadialGradient(
              originX,
              originY,
              waveRadius * 0.8,
              originX,
              originY,
              waveRadius
            );

            const color = isDarkMode
              ? `rgba(15, 23, 42, ${waveOpacity})`
              : `rgba(255, 255, 255, ${waveOpacity})`;
            const colorTransparent = isDarkMode ? `rgba(15, 23, 42, 0)` : `rgba(255, 255, 255, 0)`;

            gradient.addColorStop(0, colorTransparent);
            gradient.addColorStop(0.7, color);
            gradient.addColorStop(1, colorTransparent);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(originX, originY, waveRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      },
      onComplete: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onComplete) onComplete();
      },
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [triggerWave, originX, originY, isDarkMode, onComplete]);

  if (!triggerWave) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
