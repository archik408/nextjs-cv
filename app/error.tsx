'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  console.error(error);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
          <div className="mx-4 max-w-md rounded-lg bg-white/80 p-6 shadow-lg dark:bg-gray-900/80">
            <h1 className="mb-2 text-lg font-semibold">Something went wrong</h1>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              An unexpected error occurred while rendering this page. You can try again.
            </p>
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-gray-300"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
