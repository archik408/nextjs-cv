'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL = 'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/bubble.js';

const bubbleSortCode = `// Проходим все элементы массива и меняем соседей местами,
// если хоть одна смена за цикл произошла, то запускаем еще одну итерацию по флагу.
// Каждая новая итерация меньше предыдущей на один.
// O(n^2)

function bubbleSort (arr) {
 let swapped = false;
 let count = 0;
 do {
   swapped = false;
   for (let i = 0; i < arr.length - 1 - count; i++) {
     if (arr[i+1] < arr[i]) {
       const tmp = arr[i+1];
       arr[i+1] = arr[i];
       arr[i] = tmp;
       swapped = true;
     }
   }
   count++;
 } while (swapped === true)
 return arr;
}`;

function buildBubbleSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  for (let i = 0; i < arr.length - 1; i += 1) {
    let swapped = false;
    const sortedIndices = Array.from({ length: i }, (_, index) => arr.length - 1 - index);

    for (let j = 0; j < arr.length - i - 1; j += 1) {
      steps.push({
        values: [...arr],
        activeIndices: [j, j + 1],
        sortedIndices,
        pivotIndex: null,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          values: [...arr],
          activeIndices: [j, j + 1],
          sortedIndices,
          pivotIndex: null,
        });
      }
    }

    if (!swapped) {
      break;
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

export function BubbleSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsBubbleSortTitle || 'Bubble Sort'}
      description={
        t.algorithmsBubbleSortDescription ||
        'Bubble Sort repeatedly compares neighboring elements and swaps them whenever they are in the wrong order.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsBubbleSortConcept ||
          'The algorithm walks through the array many times. On each pass, it compares adjacent values and swaps them if the left value is greater than the right one.',
        t.algorithmsBubbleSortHowItWorks ||
          'Large values gradually “bubble” to the right edge, so after every pass the last unsorted position becomes fixed.',
        t.algorithmsBubbleSortWhySlow ||
          'Bubble Sort is easy to understand, but inefficient on large inputs, which makes it a good teaching example rather than a practical production sort.',
      ]}
      implementationDescription={
        t.algorithmsImplementationDescription ||
        'A concise implementation that matches the behavior shown in the interactive demo.'
      }
      visualizationDescription={
        t.algorithmsBubbleSortVisualizationDescription ||
        'Shuffle the bars, then watch Bubble Sort compare adjacent values and move the largest items to the end.'
      }
      code={bubbleSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildBubbleSortSteps}
    />
  );
}
