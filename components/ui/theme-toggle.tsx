'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { animate } from 'animejs';

import { Button } from '@/components/ui/button';
import { ThemeWaveEffect } from '@/components/ui/theme-wave-effect';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [waveState, setWaveState] = React.useState({
    trigger: false,
    originX: 0,
    originY: 0,
    isDark: false,
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="noShadow" size="icon" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    // Animate the icon
    if (iconRef.current) {
      animate(iconRef.current, {
        rotate: '+=360',
        scale: [1, 1.3, 1],
        duration: 600,
        ease: 'inOut(2)',
      });
    }

    // Trigger wave effect from button position
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Determine the target theme
      const willBeDark = theme !== 'dark';

      // Trigger the wave effect
      setWaveState({
        trigger: true,
        originX: centerX,
        originY: centerY,
        isDark: willBeDark,
      });

      // Create small ripple effect on the button
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${centerX}px`;
      ripple.style.top = `${centerY}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor =
        theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9997';
      ripple.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(ripple);

      animate(ripple, {
        scale: [0, 30],
        opacity: [0.6, 0],
        duration: 600,
        ease: 'out(3)',
        onComplete: () => {
          document.body.removeChild(ripple);
        },
      });
    }

    // Change theme
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleWaveComplete = () => {
    setWaveState(prev => ({ ...prev, trigger: false }));
  };

  return (
    <>
      <Button
        ref={buttonRef}
        variant="noShadow"
        size="icon"
        onClick={toggleTheme}
        className="hover:bg-secondary/80 transition-colors overflow-visible"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <div ref={iconRef}>
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-foreground" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </div>
      </Button>

      <ThemeWaveEffect
        triggerWave={waveState.trigger}
        originX={waveState.originX}
        originY={waveState.originY}
        isDarkMode={waveState.isDark}
        onComplete={handleWaveComplete}
      />
    </>
  );
}
