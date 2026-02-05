'use client';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-gray-500 dark:border-gray-700 dark:border-t-gray-300"
          aria-hidden="true"
        />
        <p className="text-sm text-gray-600 dark:text-gray-300" aria-live="polite">
          Loading content…
        </p>
      </div>
    </div>
  );
}
