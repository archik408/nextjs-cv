'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL =
  'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/selection.js';

const selectionSortCode = `// Проходим все элементы и на каждой итерации ищем минимальное значение
// если нашли меньше, чем текущее, то меняем местами.
// O(n^2)

function selectionSort (arr) {
 for (let i = 0; i < arr.length; i++) {
   let min = i;
   for (let j = i + 1; j < arr.length; j++) {
     if (arr[min] > arr[j]) {
       min = j;
     }
   }

   if (min !== i) {
     const tmp = arr[i];
     arr[i] = arr[min];
     arr[min] = tmp;
   }
 }
 return arr;
}`;

function buildSelectionSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  for (let i = 0; i < arr.length; i += 1) {
    let minIndex = i;

    for (let j = i + 1; j < arr.length; j += 1) {
      steps.push({
        values: [...arr],
        activeIndices: [minIndex, j],
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        pivotIndex: minIndex,
      });

      if (arr[minIndex] > arr[j]) {
        minIndex = j;
        steps.push({
          values: [...arr],
          activeIndices: [i, minIndex],
          sortedIndices: Array.from({ length: i }, (_, index) => index),
          pivotIndex: minIndex,
        });
      }
    }

    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({
        values: [...arr],
        activeIndices: [i, minIndex],
        sortedIndices: Array.from({ length: i + 1 }, (_, index) => index),
        pivotIndex: i,
      });
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

export function SelectionSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsSelectionSortTitle || 'Selection Sort'}
      description={
        t.algorithmsSelectionSortDescription ||
        'Selection Sort repeatedly searches for the smallest remaining value and places it at the next sorted position.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsSelectionSortConcept ||
          'The algorithm divides the array into a sorted prefix and an unsorted suffix.',
        t.algorithmsSelectionSortHowItWorks ||
          'On every pass, it scans the unsorted part, finds the minimum element, and swaps it into the next position of the sorted prefix.',
        t.algorithmsSelectionSortWhyUseful ||
          'It is easy to reason about and performs a predictable number of comparisons, which makes it a useful teaching algorithm.',
      ]}
      implementationDescription={
        t.algorithmsSelectionSortImplementationDescription ||
        'This implementation tracks the current minimum index and swaps once at the end of each pass.'
      }
      visualizationDescription={
        t.algorithmsSelectionSortVisualizationDescription ||
        'Shuffle the bars and watch Selection Sort scan the unsorted area to pull the next minimum into place.'
      }
      code={selectionSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildSelectionSortSteps}
    />
  );
}
