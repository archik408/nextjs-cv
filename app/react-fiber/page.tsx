import { Metadata } from 'next';
import { ReactFiberClient } from './page-client';
import { generateMetadata } from '@/lib/seo';

const seoConfig = {
  title: 'React Fiber & JSX Parser - Interactive Visualization',
  description:
    'Interactive visualization of JSX parsing and React Fiber reconciliation process with animated data flow. Learn how React transforms JSX code through the Fiber algorithm.',
  keywords:
    'React, Fiber, JSX, Parser, Visualization, Animation, Reconciliation, Virtual DOM, JavaScript, Frontend',
  url: 'https://arturbasak.dev/react-fiber',
  image: 'https://arturbasak.dev/og-react-fiber.png',
  type: 'website' as const,
  locale: 'en' as const,
};

export const metadata: Metadata = generateMetadata(seoConfig);

export default function ReactFiberPage() {
  return <ReactFiberClient />;
}
