/**
 * Safely parse a string into JSON, attempting direct parse or extracting the first {...} object.
 *
 * @param s Input string potentially containing JSON
 * @returns Parsed value or null if input is empty or unparsable
 */
export function safeJsonParse(s: string): unknown {
  const trimmed = s.trim();
  if (!trimmed) return null;

  // Fast path: direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  // Attempt to extract the first {...} JSON object.
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const candidate = trimmed.slice(start, end + 1);
    return JSON.parse(candidate);
  }

  return JSON.parse(trimmed);
}
