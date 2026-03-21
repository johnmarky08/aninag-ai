import axios from "axios";
import { stableHash, ttlCache } from "../utils/index.ts";
import type { AnalyzeResponse, RawSource } from "../types.ts";
import { llmAnalyze } from "./llmAnalyze.ts";
import { analyzeSources } from "./analyzeSource.ts";

const cacheTtlMs = Number(process.env.CACHE_TTL_MS ?? 15 * 60_000);
const cache = ttlCache<AnalyzeResponse>(cacheTtlMs);

export async function analyzeText(text: string): Promise<AnalyzeResponse> {
  const key = stableHash(text);
  const cached = cache.get(key);
  if (cached) return cached;

  const { data } = await axios.get(process.env.SERP_API_BASE_URL!, {
    params: {
      q: text,
      api_key: process.env.SERP_API_KEY!,
      engine: "google",
      google_domain: "google.com",
      hl: "en",
      gl: "ph",
    },
  });
  const sources: RawSource[] = await Promise.all(
    (data?.organic_results ?? []).map(async (r: any): Promise<RawSource> => {
      const description = await analyzeSources(r?.link, 1);

      return {
        id: crypto.randomUUID(),
        title: r?.title,
        description: description?.summary[0].text,
        link: r?.link,
        favicon: r?.favicon,
        snippet: r?.snippet,
        source: r?.source,
      } as RawSource;
    }),
  );

  const llm = await llmAnalyze(text, sources);
  cache.set(key, llm);
  return llm;
}
