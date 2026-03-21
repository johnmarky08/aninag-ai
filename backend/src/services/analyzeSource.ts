import axios from "axios";
import _ from "lodash";
import {
  dedupeBySimilarity,
  extractArticle,
  getSentences,
  runWithConcurrency,
} from "../utils/index.ts";

/**
 * Fetch an article, extract and score sentences by similarity, and return the top representative sentences.
 *
 * @param url Article URL to analyze
 * @param top_n Number of top sentences to return
 * @param max_sentences Maximum sentences to extract and consider
 * @param concurrency Number of concurrent similarity requests
 * @returns Object with { url, top_n, summary: [{ text, score }] } or null on error
 */
export async function analyzeSources(
  url: string,
  top_n: number = 3,
  max_sentences: number = 30,
  concurrency: number = 6,
) {
  try {
    if (!url || typeof url !== "string")
      throw new Error("Missing or invalid 'url'.");

    const page = await axios.get(url, { timeout: 15000 });
    const text = extractArticle(page.data, url) || "";
    if (text.trim().length < 80)
      throw new Error("Could not extract article text.");

    const sentences = getSentences(text, max_sentences);
    if (sentences.length === 0) throw new Error("No suitable sentences found.");

    const n = sentences.length;
    const simsMatrix: number[][] = Array.from({ length: n }, () =>
      new Array(n).fill(0),
    );

    // Worker that calls the Router for a single source sentence
    const worker = async (_: string, idx: number) => {
      const payload = {
        inputs: {
          source_sentence: sentences[idx],
          sentences: sentences,
        },
      };
      const response = await fetch(process.env.HF_ST_ML_MODEL_URL!, {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`Router error ${response.status}: ${text}`);
      }
      const resp = await response.json();
      // Normalize response shapes to an array of numbers
      let sims: number[] = [];
      if (Array.isArray(resp)) {
        sims = resp.map((r: any) => {
          if (typeof r === "number") return r;
          if (r && typeof r.score === "number") return r.score;
          if (r && typeof r.similarity === "number") return r.similarity;
          return 0;
        });
      } else if (resp && Array.isArray((resp as any).scores)) {
        sims = (resp as any).scores;
      } else {
        // fallback: try to coerce if resp has nested structure
        sims = [];
      }
      for (let j = 0; j < Math.min(sims.length, n); j++)
        simsMatrix[idx][j] = sims[j];
      return true;
    };

    // Run calls with concurrency limit
    await runWithConcurrency(sentences, worker, concurrency);

    // Score each sentence by summing similarities (higher => more central)
    const scores = simsMatrix.map((row) => row.reduce((a, b) => a + b, 0));
    const idxSorted = _.range(n).sort((a, b) => scores[b] - scores[a]);

    // De-duplicate and pick top_n
    const deduped = dedupeBySimilarity(idxSorted, simsMatrix, 0.92);
    const selected = deduped.slice(0, top_n).sort((a, b) => a - b);

    const summary = selected.map((idx) => ({
      text: sentences[idx],
      score: Number(scores[idx].toFixed(4)),
    }));

    return { url, top_n: summary.length, summary };
  } catch (err: any) {
    if (process.env.DEBUG == "true")
      console.error("Summarize error:", err?.message || err);
    return null;
  }
}
