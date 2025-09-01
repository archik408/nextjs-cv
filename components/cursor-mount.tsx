'use client';

import { useEffect, useState } from 'react';
import { CursorFollower } from '@/components/cursor-follower';

export function CursorMount() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setEnabled(isDesktopPointer);
    } catch {
      setEnabled(false);
    }
  }, []);

  if (!enabled) return null;
  return <CursorFollower />;
}
