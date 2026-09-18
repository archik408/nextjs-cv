'use client';

import dynamic from 'next/dynamic';

export const SkeletonDetectionPageDynamic = dynamic(
  () =>
    import('./page-client').then((m) => ({
      default: m.SkeletonDetectionPageClient,
    })),
  {
    ssr: false,
    loading: () => (
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground"
        aria-busy="true"
      >
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
          <div className="mt-10 aspect-video w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </main>
    ),
  }
);
