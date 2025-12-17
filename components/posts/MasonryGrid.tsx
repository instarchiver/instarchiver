'use client';

import { ReactNode } from 'react';
import Masonry from 'react-masonry-css';

interface MasonryGridProps {
  children: ReactNode;
  className?: string;
}

export function MasonryGrid({ children, className = '' }: MasonryGridProps) {
  const breakpointColumns = {
    default: 4,
    1280: 4,
    1024: 3,
    640: 2,
    0: 1,
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
