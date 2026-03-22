import { get, writable } from "svelte/store";
import { verificationLevel } from "../Utilities.js";
import { analysis, analysisConfidence } from "../State.js";
import { analyzePost as analyzePostApi } from "../services/analyzeService.js";

const badgeStoreMap = new Map();

function normalizeVerdict(verdict) {
  if (
    verdict === "Verified" ||
    verdict === "Likely Misleading" ||
    verdict === "Fake" ||
    verdict === "Unknown"
  ) {
    return verdict;
  }
  return "Unknown";
}

function normalizeConfidence(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  const percent = value <= 1 ? Math.round(value * 100) : Math.round(value);
  return Math.max(0, Math.min(100, percent));
}

function createInitialBadgeState(postText = "") {
  return {
    verdict: "Unknown",
    confidence: 0,
    isAnalyzing: false,
    analysis: null,
    validatedSummary: postText
      ? "Hover to analyze this post"
      : "Analyzing Post...",
    claimSummary: "",
    error: null,
    postText,
  };
}

function createBadgeStore(postText = "") {
  const store = writable(createInitialBadgeState(postText));

  return {
    subscribe: store.subscribe,
    setPostText: (text) => {
      const nextText = typeof text === "string" ? text : "";
      store.update((state) => ({
        ...state,
        postText: nextText,
      }));
    },
    setAnalyzing: () => {
      store.update((state) => ({
        ...state,
        isAnalyzing: true,
        error: null,
        validatedSummary:
          state.validatedSummary &&
          state.validatedSummary !== "Hover to analyze this post"
            ? state.validatedSummary
            : "Analyzing Post...",
      }));
    },
    setResult: (result) => {
      const normalizedVerdict = normalizeVerdict(result?.verdict);
      const normalizedConfidence = normalizeConfidence(result?.confidence);

      store.update((state) => ({
        ...state,
        isAnalyzing: false,
        verdict: normalizedVerdict,
        confidence: normalizedConfidence,
        analysis: result ?? null,
        validatedSummary:
          result?.validated_summary ||
          state.validatedSummary ||
          "No analysis summary available.",
        claimSummary: result?.claim_summary || state.claimSummary || "",
        error: null,
      }));
    },
    setError: (message) => {
      store.update((state) => ({
        ...state,
        isAnalyzing: false,
        error: message,
        verdict: state.verdict === "Unknown" ? "Unknown" : state.verdict,
        validatedSummary: message || "Unable to analyze this post right now.",
      }));
    },
  };
}

export function getBadgeStateStore(postId, postText = "") {
  const id = postId || "badge-global";
  if (!badgeStoreMap.has(id)) {
    badgeStoreMap.set(id, createBadgeStore(postText));
  }

  const store = badgeStoreMap.get(id);
  if (postText) {
    store.setPostText(postText);
  }

  return store;
}

export async function analyzeBadgePost(postId, postText) {
  const store = getBadgeStateStore(postId, postText);
  const text = (postText || get(store).postText || "").trim();

  if (!text) {
    store.setError("No post text found for analysis.");
    return null;
  }

  store.setAnalyzing();

  const runtimeAnalyze =
    typeof window !== "undefined" ? window["aninagAnalyzePost"] : null;
  const analyzer =
    typeof runtimeAnalyze === "function" ? runtimeAnalyze : analyzePostApi;

  try {
    const result = await analyzer(text);
    if (!result) {
      store.setError("Unable to analyze this post right now.");
      return null;
    }

    store.setResult(result);
    return result;
  } catch (error) {
    store.setError("Analysis failed. Please try again.");
    return null;
  }
}

export function syncBadgeToGlobal(postId) {
  const store = getBadgeStateStore(postId);
  const state = get(store);

  verificationLevel.set(state.verdict);
  analysisConfidence.set(state.confidence);
  analysis.set(state.analysis);
}
