'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL =
  'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/insertion.js';

const insertionSortCode = `// Проходим все элементы и на каждой итерации
// сравниваем текущий элемент с предыдущими и так до самого начала,
// если текущий меньше предыдущего в паре, то меняем их местами.
// O(n^2)

function insertionSort (arr) {
 for (let i = 0; i < arr.length; i++) {
   let j = i;
   while (j > 0 && arr[j-1] > arr[j]) {
     const tmp = arr[j];
     arr[j] = arr[j - 1];
     arr[j - 1] = tmp;
     j = j - 1;
   }
 }
 return arr;
}`;

function buildInsertionSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: arr.length > 0 ? [0] : [],
      pivotIndex: null,
    },
  ];

  for (let i = 1; i < arr.length; i += 1) {
    let j = i;

    steps.push({
      values: [...arr],
      activeIndices: [j],
      sortedIndices: Array.from({ length: i }, (_, index) => index),
      pivotIndex: j,
    });

    while (j > 0 && arr[j - 1] > arr[j]) {
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      j -= 1;

      steps.push({
        values: [...arr],
        activeIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i + 1 }, (_, index) => index),
        pivotIndex: j,
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

export function InsertionSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsInsertionSortTitle || 'Insertion Sort'}
      description={
        t.algorithmsInsertionSortDescription ||
        'Insertion Sort grows a sorted prefix and inserts each new element into its correct position.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsInsertionSortConcept ||
          'The algorithm moves from left to right and treats the beginning of the array as an already sorted segment.',
        t.algorithmsInsertionSortHowItWorks ||
          'Each new element is compared with previous values and shifted left until it reaches the correct insertion point.',
        t.algorithmsInsertionSortWhyUseful ||
          'It is simple, stable, and especially effective on nearly sorted or very small inputs.',
      ]}
      implementationDescription={
        t.algorithmsInsertionSortImplementationDescription ||
        'This implementation swaps the current value backward until it lands in the correct place inside the sorted prefix.'
      }
      visualizationDescription={
        t.algorithmsInsertionSortVisualizationDescription ||
        'Shuffle the bars and watch each new element move left until the sorted prefix is restored.'
      }
      code={insertionSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildInsertionSortSteps}
    />
  );
}
