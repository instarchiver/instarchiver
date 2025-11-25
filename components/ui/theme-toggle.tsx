'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { animate } from 'animejs';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

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

    // Create ripple effect
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = document.createElement('div');
      ripple.style.position = 'fixed';
      ripple.style.left = `${rect.left + rect.width / 2}px`;
      ripple.style.top = `${rect.top + rect.height / 2}px`;
      ripple.style.width = '20px';
      ripple.style.height = '20px';
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor =
        theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      ripple.style.pointerEvents = 'none';
      ripple.style.zIndex = '9999';
      ripple.style.transform = 'translate(-50%, -50%)';
      document.body.appendChild(ripple);

      animate(ripple, {
        scale: [0, 100],
        opacity: [0.6, 0],
        duration: 800,
        ease: 'out(4)',
        onComplete: () => {
          document.body.removeChild(ripple);
        },
      });
    }

    // Animate the background transition
    animate('body', {
      duration: 400,
      ease: 'inOut(2)',
    });

    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
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
  );
}
