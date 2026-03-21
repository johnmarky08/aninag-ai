import { RawSource } from "../types.ts";

/**
 * Build a JSON-constrained verifier prompt that instructs a model to analyze a claim using only the provided sources.
 *
 * @param text Claim text to analyze
 * @param sources Array of RawSource objects to use as evidence
 * @returns Prompt string ready to send to the verifier model
 */
export function buildAnalyzePrompt(text: string, sources: RawSource[]) {
  return `
You are an evidence-focused verifier. Your task is to analyze the given text using ONLY the provided sources. For each source, use its description to check if the content supports, contradicts, or is unrelated to the claim, and then enrich the sources with additional metadata.

CRITICAL RULES:
- Step 1: Use the provided sources array. Do not invent or fabricate URLs. Do not add or remove entries.
- Step 2: For each source, determine its bias (e.g., "News", "Fact-check", "Education") and whether it contradicts the claim (true/false) based on the description.
- Step 3: Summarize the claim and the validated evidence from the sources.
- Step 4: Fill out the JSON schema exactly as specified below.
- If the text is in Tagalog, translate it to English and include that translation in claim_summary.
- Output MUST be valid JSON only, matching the schema described below. Do not include any extra text, headings, or commentary outside the JSON.
- The "sources" array is REQUIRED and must contain the same entries as the input RawSource[], but reduced to { id, bias, contradictory }.

INPUT TEXT:
"""${text}"""

INPUT SOURCES:
${JSON.stringify(sources, null, 2)}

OUTPUT SCHEMA (must follow exactly):
{
  "verdict": "Verified" | "Likely Misleading" | "Fake" | "Unknown",
  "confidence": number, // between 0 and 1 (inclusive)
  "validated_summary": string, // 1-2 sentence summary of what the evidence shows
  "claim_summary": string, // 1-2 sentence concise summary of the claim
  "sources": [
    {
      "id": string,
      "bias": string, // tag such as "News", "Fact-check", "Education", etc.
      "contradictory": boolean // true if the source contradicts the claim
    }
  ], // must contain the same entries as the input RawSource[], reduced to id + enriched fields
  "tip": string // optional: one concise tip to help spot similar fake news
}

GUIDANCE:
- verdict must reflect the evidence:
  - "Verified": claim is supported by sources
  - "Fake": claim is contradicted by sources
  - "Likely Misleading": claim mixes true and false elements or lacks context
  - "Unknown": claim is opinion, anecdote, or unverifiable
- confidence: high if multiple sources agree, lower if mixed or weak evidence.
- validated_summary: 1-2 sentences describing what the sources show (e.g., confirming or disproving the claim).
- claim_summary: 1-2 sentences summarizing the claim itself; if Tagalog input, start with a short English translation then the summary.
- sources: return only { id, bias, contradictory } for each source.
- tip: one short actionable tip to help spot similar fake news.
`.trim();
}
