/**
 * Run an async worker over items with a fixed concurrency limit.
 *
 * @param items Array of input items
 * @param worker Async function processing an item and its index
 * @param concurrency Maximum number of concurrent workers
 * @returns Promise resolving to an array of results in input order
 */
export async function runWithConcurrency<T, R>(
  items: T[],
  worker: (item: T, index: number) => Promise<R>,
  concurrency = 6,
): Promise<R[]> {
  const results: R[] = [];
  let i = 0;
  const workers: Promise<void>[] = [];

  async function next() {
    while (i < items.length) {
      const current = i++;
      try {
        const r = await worker(items[current], current);
        results[current] = r;
      } catch (err) {
        // store undefined or throw depending on preference
        results[current] = undefined as unknown as R;
      }
    }
  }

  for (let w = 0; w < Math.min(concurrency, items.length); w++) {
    workers.push(next());
  }
  await Promise.all(workers);
  return results;
}
