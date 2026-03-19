/**
 *
 * @param ttlMs The time-to-live (TTL) for cache entries, specified in milliseconds. This determines how long a cached value is considered valid before it expires and is removed from the cache. When a value is set in the cache, it will be associated with an expiration time calculated as the current time plus the TTL. When retrieving a value from the cache, the function will check if the current time has exceeded the expiration time, and if so, it will treat the entry as expired and return undefined.
 * @returns An object with two methods: `get` and `set`. The `get` method takes a string key and returns the cached value of type T if it exists and has not expired, or undefined if the key is not found or the entry has expired. The `set` method takes a string key and a value of type T, and stores it in the cache with an associated expiration time based on the provided TTL.
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
