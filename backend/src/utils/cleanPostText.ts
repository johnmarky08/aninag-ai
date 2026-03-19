export function cleanPostText(input: string) {
  return input
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
}
