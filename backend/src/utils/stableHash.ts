import { createHash } from "node:crypto";

/**
 *
 * @param text The input text for which we want to generate a stable hash. This is typically the cleaned text of a social media post or comment that we want to analyze. The function will produce the same hash for the same input text, allowing us to use it as a cache key for storing analysis results.
 * @returns A stable hash string derived from the input text. The function uses the SHA-256 hashing algorithm to generate a hash of the input text, and then takes the first 32 characters of the hexadecimal representation of that hash. This provides a consistent and unique identifier for the given input text, which can be used for caching analysis results or other purposes where a stable identifier is needed.
 */
export function stableHash(text: string) {
  return createHash("sha256").update(text, "utf8").digest("hex").slice(0, 32);
}
