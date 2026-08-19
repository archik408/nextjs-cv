'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL =
  'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/heapsort.js';

const heapSortCode = `// Логически делим массив на тройки (корень - левый лист и правый лист)
// Выясняем кто из тройки наибольший и помещаем его в корень
// O(nlog(n))

function heapSort (arr) {
 const n = arr.length;

 for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
   heapify(arr, i, n);
 }

 for (let i = n - 1; i > 0; i--) {
   const temp = arr[i];
   arr[i] = arr[0];
   arr[0] = temp;
   heapify(arr, 0, i);
 }

 return arr;
}`;

function buildHeapSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  const sortedIndices = new Set<number>();

  function record(activeIndices: number[] = [], pivotIndex: number | null = null) {
    steps.push({
      values: [...arr],
      activeIndices: [...new Set(activeIndices)],
      sortedIndices: Array.from(sortedIndices).sort((a, b) => a - b),
      pivotIndex,
    });
  }

  function heapify(root: number, size: number): void {
    let maxIndex = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      record([root, left], root);
      if (arr[maxIndex] < arr[left]) {
        maxIndex = left;
      }
    }

    if (right < size) {
      record([maxIndex, right], root);
      if (arr[maxIndex] < arr[right]) {
        maxIndex = right;
      }
    }

    if (maxIndex !== root) {
      [arr[root], arr[maxIndex]] = [arr[maxIndex], arr[root]];
      record([root, maxIndex], maxIndex);
      heapify(maxIndex, size);
    }
  }

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i -= 1) {
    heapify(i, arr.length);
  }

  for (let end = arr.length - 1; end > 0; end -= 1) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    sortedIndices.add(end);
    record([0, end], 0);
    heapify(0, end);
  }

  if (arr.length > 0) {
    sortedIndices.add(0);
  }

  steps.push({
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, index) => index),
    pivotIndex: null,
  });

  return steps;
}

export function HeapSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsHeapSortTitle || 'Heap Sort'}
      description={
        t.algorithmsHeapSortDescription ||
        'Heap Sort builds a max-heap, repeatedly moves the largest value to the end, and restores the heap for the remaining items.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsHeapSortConcept ||
          'Heap Sort first arranges the array into a binary heap where the maximum value sits at the root.',
        t.algorithmsHeapSortHowItWorks ||
          'It then swaps that root with the last unsorted element, shrinks the heap, and heapifies again.',
        t.algorithmsHeapSortWhyUseful ||
          'It guarantees O(n log n) time and is a good way to understand the connection between arrays and tree-shaped data.',
      ]}
      implementationDescription={
        t.algorithmsHeapSortImplementationDescription ||
        'This implementation builds a max-heap in place and repeatedly restores heap order after moving the maximum to the end.'
      }
      visualizationDescription={
        t.algorithmsHeapSortVisualizationDescription ||
        'Shuffle the bars and watch Heap Sort build a heap, extract the maximum, and grow a sorted suffix on the right.'
      }
      code={heapSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildHeapSortSteps}
    />
  );
}
