'use client';

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { useTiltCard } from '@/lib/hooks/use-tilt-card';

type TiltCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const baseClassName =
  'group relative z-10 transform-gpu will-change-transform transition-shadow duration-500 ease-out hover:shadow-2xl [--glare-o:0] [--glare-rot:0deg]';

export function TiltCard<T extends ElementType = 'div'>({
  as,
  children,
  className = '',
  ...rest
}: TiltCardProps<T>) {
  const Component = as ?? 'div';
  const tilt = useTiltCard();

  return (
    <Component
      className={`${baseClassName} ${className}`.trim()}
      onMouseMove={tilt.onMouseMove}
      onMouseEnter={tilt.onMouseEnter}
      onMouseLeave={tilt.onMouseLeave}
      {...rest}
    >
      {children}
      <div
        className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
    </Component>
  );
}
