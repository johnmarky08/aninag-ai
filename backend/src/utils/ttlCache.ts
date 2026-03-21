/**
 * Create a simple TTL in-memory cache with `get` and `set` methods.
 *
 * @param ttlMs Entry time-to-live in milliseconds
 * @returns Object with `get(key)` and `set(key, value)` functions
 */
export function ttlCache<T>(ttlMs: number) {
  const map = new Map<string, { v: T; exp: number }>();

  function get(k: string): T | undefined {
    const hit = map.get(k);
    if (!hit) return undefined;
    if (Date.now() > hit.exp) {
      map.delete(k);
      return undefined;
    }
    return hit.v;
  }

  function set(k: string, v: T) {
    map.set(k, { v, exp: Date.now() + ttlMs });
  }

  return { get, set };
}
