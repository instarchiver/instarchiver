'use client';

import { DiscussionEmbed } from 'disqus-react';

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
 */
export function DisqusWrapper({ shortname, config }: DisqusWrapperProps) {
  return (
    <div
      style={
        {
          // Override CSS variables with hex colors for Disqus compatibility
          '--background': '#ffffff',
          '--foreground': '#000000',
          '--border': '#000000',
          color: '#000000',
          backgroundColor: '#ffffff',
        } as React.CSSProperties
      }
      className="dark:!bg-[#1a1a1a] dark:!text-[#ffffff]"
    >
      <DiscussionEmbed shortname={shortname} config={config} />
    </div>
  );
}
