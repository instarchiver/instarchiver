'use client';

import { DiscussionEmbed } from 'disqus-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface DisqusWrapperProps {
  shortname: string;
  config: {
    url: string;
    identifier: string;
    title: string;
  };
}

/**
 * Wrapper component for Disqus that prevents CSS color parsing errors.
 *
 * Disqus embed script cannot parse OKLCH color values from CSS variables,
 * so we wrap it in a container with explicit color values to prevent
 * "parseColor received unparseable color" errors.
 *
 * The component reloads Disqus when theme changes to sync colors properly.
 */
export function DisqusWrapper({ shortname, config }: DisqusWrapperProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Force Disqus to reload when theme changes
  useEffect(() => {
    if (mounted) {
      // Reset Disqus by changing the key
      setKey(prev => prev + 1);
    }
  }, [resolvedTheme, mounted]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <span className="text-foreground opacity-50">Loading comments...</span>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      key={key}
      style={
        {
          // Override CSS variables with hex colors for Disqus compatibility
          '--background': isDark ? '#3d2f52' : '#ebe5f5',
          '--secondary-background': isDark ? '#3d3d3d' : '#ffffff',
          '--foreground': isDark ? '#ececec' : '#000000',
          '--main-foreground': '#000000',
          '--main': '#a985ff',
          '--border': '#000000',
          '--ring': isDark ? '#ffffff' : '#000000',
          '--overlay': 'rgba(0, 0, 0, 0.8)',
          color: isDark ? '#ececec' : '#000000',
          backgroundColor: isDark ? '#3d2f52' : '#ebe5f5',
        } as React.CSSProperties
      }
      className="w-full p-5"
    >
      <DiscussionEmbed shortname={shortname} config={config} />
    </div>
  );
}
