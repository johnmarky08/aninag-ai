import sbd from "sbd";

/**
 * Split text into sanitized, trimmed sentences, filter out short fragments, and limit the result.
 *
 * @param text Input text to split
 * @param maxSentences Maximum number of sentences to return
 * @returns Array of cleaned sentences
 */
export function getSentences(text: string, maxSentences = 40): string[] {
  const opts = {
    sanitize: true,
    newline_boundaries: false,
    html_boundaries: false,
  };
  return sbd
    .sentences(text, opts)
    .map((s) => s.trim())
    .filter((s) => s.length > 30)
    .slice(0, maxSentences);
}
