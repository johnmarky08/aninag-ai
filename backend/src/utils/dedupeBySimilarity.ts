/**
 * Filter out indices that are duplicates based on a pairwise similarity matrix.
 *
 * @param sortedIdx Array of indices ordered by priority
 * @param simsMatrix Pairwise similarity scores matrix
 * @param threshold Similarity cutoff above which items are considered duplicates
 * @returns Array of indices with near-duplicates removed
 */
export function dedupeBySimilarity(
  sortedIdx: number[],
  simsMatrix: number[][],
  threshold = 0.92,
) {
  const final: number[] = [];
  for (const idx of sortedIdx) {
    let isDup = false;
    for (const kept of final) {
      const sim = simsMatrix[idx]?.[kept] ?? simsMatrix[kept]?.[idx] ?? 0;
      if (sim > threshold) {
        isDup = true;
        break;
      }
    }
    if (!isDup) final.push(idx);
  }
  return final;
}
