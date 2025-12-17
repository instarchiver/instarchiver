'use client';

import { ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

export function MasonryGrid({ children, className = '' }: MasonryGridProps) {
  const breakpointColumns = {
    default: 4, // 4 columns on extra large screens
    1280: 4, // 4 columns on large screens (xl)
    1024: 3, // 3 columns on medium-large screens (lg)
    768: 2, // 2 columns on tablets (md)
    640: 1, // 1 column on mobile (sm and below)
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={`masonry-grid ${className}`}
      columnClassName="masonry-grid-column"
    >
      {children}
    </Masonry>
  );
}
