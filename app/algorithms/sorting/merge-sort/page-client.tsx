'use client';

import { SortingAlgorithmPage } from '@/components/algorithms/sorting-algorithm-page';
import { SortingStep } from '@/components/algorithms/sorting-visualizer';
import { useLanguage } from '@/lib/hooks/use-language';

const REPOSITORY_URL =
  'https://github.com/archik408/alg-and-ds-practise/blob/main/sorts/mergesort.js';

const mergeSortCode = `// Делим массив на 2 части пополам,
// рекурсивно применяем деление пополам и слияние для обеих частей
// O(n*log(n))

function mergeSort (arr) {
 if (arr.length <= 1) {
   return arr;
 }

 const mid = Math.floor(arr.length / 2);
 const left = arr.slice(0 , mid);
 const right = arr.slice(mid , arr.length);

 const sortedLeft = mergeSort(left);
 const sortedRight = mergeSort(right);

 return merge(sortedLeft, sortedRight);
}

function merge(left , right) {
 const result = [];
 let i = 0
 let j = 0;

 while (i < left.length && j < right.length) {
   if (left[i] < right[j]) {
     result.push(left[i]);
     i++;
   } else {
     result.push(right[j]);
     j++;
   }
 }

 while (i < left.length) result.push(left[i++]);
 while (j < right.length) result.push(right[j++]);
 return result;
}`;

function buildMergeSortSteps(source: number[]): SortingStep[] {
  const arr = [...source];
  const steps: SortingStep[] = [
    {
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      pivotIndex: null,
    },
  ];

  function mergeSortRange(start: number, end: number): void {
    if (end - start <= 1) {
      return;
    }

    const mid = Math.floor((start + end) / 2);
    mergeSortRange(start, mid);
    mergeSortRange(mid, end);

    const left = arr.slice(start, mid);
    const right = arr.slice(mid, end);
    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      steps.push({
        values: [...arr],
        activeIndices: [start + i, mid + j, k],
        sortedIndices: [],
        pivotIndex: null,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i += 1;
      } else {
        arr[k] = right[j];
        j += 1;
      }

      steps.push({
        values: [...arr],
        activeIndices: [k],
        sortedIndices: [],
        pivotIndex: null,
      });

      k += 1;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        values: [...arr],
        activeIndices: [k],
        sortedIndices: [],
        pivotIndex: null,
      });
      i += 1;
      k += 1;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        values: [...arr],
        activeIndices: [k],
        sortedIndices: [],
        pivotIndex: null,
      });
      j += 1;
      k += 1;
    }
  }

  mergeSortRange(0, arr.length);

  steps.push({
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, index) => index),
    pivotIndex: null,
  });

  return steps;
}

export function MergeSortPageClient() {
  const { t } = useLanguage();

  return (
    <SortingAlgorithmPage
      title={t.algorithmsMergeSortTitle || 'Merge Sort'}
      description={
        t.algorithmsMergeSortDescription ||
        'Merge Sort recursively splits the array into halves and then merges those halves back together in sorted order.'
      }
      conceptTitle={t.algorithmsBubbleSortConceptTitle || 'Core idea'}
      conceptParagraphs={[
        t.algorithmsMergeSortConcept ||
          'Merge Sort follows the divide-and-conquer pattern: split the problem into smaller parts, solve them, then combine the results.',
        t.algorithmsMergeSortHowItWorks ||
          'It repeatedly cuts the array into halves until single-element arrays remain, then merges them back while preserving order.',
        t.algorithmsMergeSortWhyUseful ||
          'It guarantees O(n log n) performance and is especially important for understanding recursion and stable sorting.',
      ]}
      implementationDescription={
        t.algorithmsMergeSortImplementationDescription ||
        'This implementation recursively splits the array and uses a dedicated merge function to combine sorted halves.'
      }
      visualizationDescription={
        t.algorithmsMergeSortVisualizationDescription ||
        'Shuffle the bars and watch Merge Sort rebuild the array by merging smaller sorted fragments into larger ones.'
      }
      code={mergeSortCode}
      repoUrl={REPOSITORY_URL}
      buildSteps={buildMergeSortSteps}
    />
  );
}
