'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL = 'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/shell.js';

const shellSortCode = `// Это улучшенная сортировка вставками
// Идея в том, чтобы сортировать вставками в определенных промежутках.
// лучший случай O(n*log(n))
// O(n^2)

function shellSort (arr) {
 for (let gap = Math.floor(arr.length/2); gap > 0; gap = Math.floor(gap/2)) {
   for (let i = gap; i < arr.length; i++) {
     let j = i;
     while (j >= gap && arr[j-gap] > arr[j]) {
       const tmp = arr[j];
       arr[j] = arr[j - gap];
       arr[j - gap] = tmp;
       j = j - gap;
     }
   }
 }

 return arr;
}`;

function buildShellSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < arr.length; i += 1) {
      let j = i;

      steps.push({
        values: [...arr],
        activeIndices: [j, j - gap],
        sortedIndices: [],
        pivotIndex: j,
      });

      while (j >= gap && arr[j - gap] > arr[j]) {
        [arr[j], arr[j - gap]] = [arr[j - gap], arr[j]];
        steps.push({
          values: [...arr],
          activeIndices: [j, j - gap],
          sortedIndices: gap === 1 ? Array.from({ length: i + 1 }, (_, index) => index) : [],
          pivotIndex: j - gap,
        });
        j -= gap;
      }
    }
  }

  steps.push({
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, index) => index),
    pivotIndex: null,
  });

  return steps;
}

export function ShellSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsShellSortTitle || 'Shell Sort'}
      description={
        t.algorithmsShellSortDescription ||
        'Shell Sort improves insertion sort by comparing elements that are far apart before finishing with local insertions.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsShellSortConcept ||
          'Shell Sort starts with large gaps between compared elements and gradually reduces those gaps to 1.',
        t.algorithmsShellSortHowItWorks ||
          'Each pass performs an insertion-like sort over elements that belong to the same gap sequence.',
        t.algorithmsShellSortWhyUseful ||
          'It is a classic optimization over insertion sort and a good example of how preprocessing can reduce later work.',
      ]}
      implementationDescription={
        t.algorithmsShellSortImplementationDescription ||
        'This implementation halves the gap on every pass and performs insertion-style swaps within each gap group.'
      }
      visualizationDescription={
        t.algorithmsShellSortVisualizationDescription ||
        'Shuffle the bars and watch Shell Sort first move distant elements, then refine the order with smaller and smaller gaps.'
      }
      code={shellSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildShellSortSteps}
    />
  );
}
