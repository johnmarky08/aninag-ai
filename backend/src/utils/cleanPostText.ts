/**
 * Clean and URL-encode post text by replacing non‑breaking spaces, collapsing whitespace,
 * removing zero‑width characters, trimming, and encoding the result.
 *
 * @param input Raw post text
 * @returns URL-encoded cleaned string
 */
export function cleanPostText(input: string) {
  return encodeURIComponent(
    input
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim(),
  );
}
