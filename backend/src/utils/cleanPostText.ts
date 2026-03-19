/**
 *
 * @param input The raw text of a social media post or comment, which may contain various types of whitespace, invisible characters, or other formatting issues.
 * @returns A cleaned version of the input text, with extraneous whitespace normalized, invisible characters removed, and leading/trailing whitespace trimmed. This helps ensure that the text is in a consistent format for analysis by the LLM.
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
