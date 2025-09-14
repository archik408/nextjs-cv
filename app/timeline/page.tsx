import { Metadata } from 'next';
import { TimelineClient } from './page-client';

export const metadata: Metadata = {
  title: 'Timeline - Artur Basak',
  description: 'Timeline развития карьеры и веб-технологий',
  openGraph: {
    title: 'Timeline - Artur Basak',
    description: 'Timeline развития карьеры и веб-технологий',
    type: 'website',
  },
};

export default function TimelinePage() {
  return <TimelineClient />;
}
