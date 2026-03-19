/**
 *
 * @param s A string that may contain JSON, possibly with extra text around it.
 * @returns The parsed JSON object if successful, or throws an error if parsing fails.
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
