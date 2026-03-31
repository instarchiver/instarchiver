'use client';

import { useEffect } from 'react';
import Clarity from '@microsoft/clarity';

export function ClarityProvider() {
  useEffect(() => {
    Clarity.init('w3nco65w4u');
  }, []);

  return null;
}
