import { createHash } from "node:crypto";

/**
 * Compute a stable 32-character SHA-256 hex hash for the given text.
 *
 * @param text Input string to hash
 * @returns 32-character hex digest
 */
export function stableHash(text: string) {
  return createHash("sha256").update(text, "utf8").digest("hex").slice(0, 32);
}
