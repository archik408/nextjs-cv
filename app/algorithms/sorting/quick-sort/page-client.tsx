'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL =
  'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/quicksort.js';

const quickSortCode = `// Выбираем опорный элемент и делим массив на 2 части,
// первая часть - это элементы меньше опорного, вторая - больше опорного
// лучший случай O(n*log(n))
// O(n^2)

function quickSort (arr) {
 if (arr.length <= 1) {
   return arr;
 }

 const pivot = arr[arr.length - 1];
 const left = [];
 const right = [];

 for (let i = 0; i < arr.length - 1; i++) {
   if (arr[i] < pivot) {
     left.push(arr[i]);
   } else {
     right.push(arr[i]);
   }
 }

 return [...quickSort(left), pivot, ...quickSort(right)];
}`;

function buildQuickSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const sorted = new Set<number>();
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  const recordStep = (activeIndices: number[] = [], pivotIndex: number | null = null) => {
    steps.push({
      values: [...arr],
      activeIndices: [...new Set(activeIndices)],
      sortedIndices: Array.from(sorted).sort((a, b) => a - b),
      pivotIndex,
    });
  };

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low;

    for (let j = low; j < high; j += 1) {
      recordStep([j, high], high);

      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        recordStep([i, j], high);
        i += 1;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];
    sorted.add(i);
    recordStep([i, high], i);
    return i;
  }

  function sort(low: number, high: number): void {
    if (low > high) {
      return;
    }

    if (low === high) {
      sorted.add(low);
      recordStep([], null);
      return;
    }

    const pivotIndex = partition(low, high);
    sort(low, pivotIndex - 1);
    sort(pivotIndex + 1, high);
  }

  sort(0, arr.length - 1);

  steps.push({
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, index) => index),
    pivotIndex: null,
  });

  return steps;
}

export function QuickSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsQuickSortTitle || 'Quick Sort'}
      description={
        t.algorithmsQuickSortDescription ||
        'Quick Sort picks a pivot, partitions the array around it, and then recursively sorts the left and right parts.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsQuickSortConcept ||
          'Quick Sort chooses a pivot element and rearranges the array so that smaller values go to the left and larger values go to the right.',
        t.algorithmsQuickSortHowItWorks ||
          'After partitioning, it repeats the same process recursively for both halves, which makes the algorithm dramatically faster than Bubble Sort on average.',
        t.algorithmsQuickSortWhyUseful ||
          'It is one of the classic divide-and-conquer algorithms: elegant, fast in practice, and useful for understanding recursion and partitioning.',
      ]}
      implementationDescription={
        t.algorithmsQuickSortImplementationDescription ||
        'This implementation uses the last element as a pivot and recursively sorts the subarrays around it.'
      }
      visualizationDescription={
        t.algorithmsQuickSortVisualizationDescription ||
        'Shuffle the bars and watch how Quick Sort partitions the array around a pivot before recursively sorting both sides.'
      }
      code={quickSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildQuickSortSteps}
    />
  );
}
