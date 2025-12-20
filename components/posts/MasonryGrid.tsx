'use client';

import { ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
  columns?: number; // Number of columns for large screens
}

export function MasonryGrid({ children, className = '', columns = 5 }: MasonryGridProps) {
  const breakpointColumns = {
    default: columns, // Customizable columns on extra large screens
    1280: columns, // Customizable columns on large screens (xl)
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
