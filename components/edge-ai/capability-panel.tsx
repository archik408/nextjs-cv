'use client';

import type { EdgeAiCapabilities } from '@/lib/edge-ai/capabilities';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

type CapabilityKey = 'webgpu' | 'webnn' | 'camera' | 'microphone' | 'speechRecognition';

type Labels = {
  title: string;
  unsupported: string;
  webgpu: string;
  webnn: string;
  camera: string;
  microphone: string;
  speechRecognition: string;
};

type EdgeAiCapabilityPanelProps = {
  capabilities: EdgeAiCapabilities;
  labels: Labels;
  /** Which capability rows to show. */
  keys: CapabilityKey[];
  /** When false, show the blocking unsupported message. */
  canRun: boolean;
};

function StatusIcon({ ok }: { ok: boolean }) {
  return ok ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
  ) : (
    <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden />
  );
}

export function EdgeAiCapabilityPanel({
  capabilities,
  labels,
  keys,
  canRun,
}: EdgeAiCapabilityPanelProps) {
  return (
    <section
      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 md:p-5 mb-6"
      aria-labelledby="edge-ai-caps-title"
    >
      <h2
        id="edge-ai-caps-title"
        className="text-sm font-semibold mb-3 text-gray-900 dark:text-white"
      >
        {labels.title}
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {keys.map((key) => (
          <li key={key} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <StatusIcon ok={capabilities[key]} />
            <span>{labels[key]}</span>
          </li>
        ))}
      </ul>
      {!canRun && (
        <p
          className="mt-4 flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2"
          role="status"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden />
          <span>{labels.unsupported}</span>
        </p>
      )}
    </section>
  );
}
