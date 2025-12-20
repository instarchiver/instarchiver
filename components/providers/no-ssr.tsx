'use client';

import { useState } from 'react';

interface NoSSRProps {
  children: React.ReactNode;
}

export function NoSSR({ children }: NoSSRProps) {
  // Initialize hasMounted based on whether we're on the client
  const [hasMounted] = useState(() => typeof window !== 'undefined');

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
