import { z } from "zod";
import type { AnalyzeResponse, RawSource } from "../types.ts";
import { buildAnalyzePrompt } from "../utils/promptTemplates.ts";
import { safeJsonParse } from "../utils/safeJsonParse.ts";

const ResponseSchema = z.object({
  verdict: z.enum(["Verified", "Likely Misleading", "Fake", "Unknown"]),
  confidence: z.number().min(0).max(1),
  validated_summary: z.string().min(1),
  claim_summary: z.string().min(1),
  sources: z.array(z.any()).optional().default([]),
  tip: z.string().optional(),
});

type HuggingFaceResponse =
  | {
      output_text?: string;
      error?: { message?: string } | string;
    }
  | { error?: string };

export async function llmAnalyze(
  text: string,
  sources: RawSource[],
): Promise<AnalyzeResponse> {
  const baseUrl = (
    process.env.HF_BASE_URL ?? "https://router.huggingface.co/v1"
  ).replace(/\/$/, "");
  // NOTE: Hugging Face Router requires a chat-capable model supported by an enabled provider.
  // This default is chosen to be broadly available; you can override via HF_MODEL.
  const model = process.env.HF_MODEL ?? "Qwen/Qwen2.5-7B-Instruct";
  const apiKey = process.env.HF_API_KEY ?? "";
  if (!apiKey.trim()) {
    throw new Error("HF_API_KEY is missing.");
  }

  const prompt = buildAnalyzePrompt(text, sources);

  // Working example POST request to Hugging Face Router (Responses API):
  // POST ${HF_BASE_URL}/responses   (HF_BASE_URL default: https://router.huggingface.co/v1)
  // Headers: Authorization: Bearer ${HF_API_KEY}
  // Body: { model, instructions, input, response_format: { type: "json_schema", json_schema: ... } }
  const url = `${baseUrl}/responses`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      instructions:
        "Return ONLY valid JSON that matches the provided JSON Schema. Do not wrap JSON in markdown fences. DO NOT FORGE OR CREATE CONTENT, EVERYTHING SHOULD BE BASED ON THE INPUT AND TRUSTED SOURCES.",
      input: prompt,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "AninagAnalyze",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              verdict: {
                type: "string",
                enum: ["Verified", "Likely Misleading", "Fake", "Unknown"],
              },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              validated_summary: { type: "string" },
              claim_summary: { type: "string" },
              sources: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string" },
                    url: { type: "string" },
                    bias: { type: "string" },
                    contradictory: { type: "boolean" },
                  },
                  required: ["name", "url", "bias", "contradictory"],
                },
              },
              tip: { type: "string" },
            },
            required: [
              "verdict",
              "confidence",
              "validated_summary",
              "claim_summary",
              "sources",
              "tip",
            ],
          },
          strict: true,
        },
      },
    }),
  });

  if (!resp.ok) {
    const textBody = await resp.text().catch(() => "");
    throw new Error(
      `Hugging Face request failed (${resp.status}). ${textBody.slice(0, 800)}`,
    );
  }

  const data = (await resp.json()) as HuggingFaceResponse;

  const content = extractGeneratedText(data).trim();
  if (!content) {
    throw new Error(
      `Hugging Face returned empty text. Raw: ${JSON.stringify(data).slice(0, 800)}`,
    );
  }

  const parsed = safeJsonParse(content);
  const validated = ResponseSchema.safeParse(parsed);

  if (!validated.success) {
    // Try a second pass: some models wrap JSON in ```json fences.
    const deFenced = content
      .replace(/```(?:json)?/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed2 = safeJsonParse(deFenced);
    const validated2 = ResponseSchema.safeParse(parsed2);
    if (!validated2.success) {
      throw new Error(
        `LLM returned invalid shape. Raw: ${content.slice(0, 800)}`,
      );
    }

    const withOriginalData = {
      ...validated2.data,
      sources: addOriginalSourceData(validated2.data.sources, sources),
    };
    return withOriginalData;
  }

  const withOriginalData = {
    ...validated.data,
    sources: addOriginalSourceData(validated.data.sources, sources),
  };
  return withOriginalData;
}

// This function is used to merge the LLM's enriched source data (id, bias, contradictory) back with the original source details (title, link, etc.) for the final AnalyzeResponse.
function addOriginalSourceData(
  llmSources: any[],
  originalSources: RawSource[],
): any[] {
  const originalById = new Map(originalSources.map((s) => [s.id, s]));
  return llmSources.map((s) => {
    const original = originalById.get(s.id);
    return {
      ...s,
      title: original?.title,
      link: original?.link,
      favicon: original?.favicon,
      snippet: original?.snippet,
      source: original?.source,
    };
  });
}

function extractGeneratedText(data: HuggingFaceResponse) {
  if (typeof data !== "object" || !data) return "";
  const any = data as any;
  if (typeof any.output_text === "string") return any.output_text;
  // Responses API shape: output: [{ content: [{ type: "output_text", text: "..." }, ...] }, ...]
  if (Array.isArray(any.output)) {
    const parts: string[] = [];
    for (const item of any.output) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;
      for (const c of content) {
        if (!c) continue;
        if (c.type === "output_text" && typeof c.text === "string")
          parts.push(c.text);
        if (typeof c.text === "string" && !c.type) parts.push(c.text);
      }
    }
    if (parts.length) return parts.join("\n");
  }
  if (any.error) {
    const msg = typeof any.error === "string" ? any.error : any.error?.message;
    throw new Error(`Hugging Face error: ${String(msg || any.error)}`);
  }
  return "";
}
