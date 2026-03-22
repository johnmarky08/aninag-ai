import { claimsCheckedToday } from "../State.js";

const BACKEND_URL = "http://localhost:3001";

function canUseExtensionBridge() {
  const extensionApi = globalThis?.["chrome"];
  return Boolean(extensionApi?.runtime?.id);
}

function analyzeViaExtensionBridge(text) {
  const extensionApi = globalThis?.["chrome"];

  return new Promise((resolve, reject) => {
    extensionApi.runtime.sendMessage(
      {
        type: "ANINAG_ANALYZE_POST",
        text,
      },
      (response) => {
        if (extensionApi.runtime.lastError) {
          reject(new Error(extensionApi.runtime.lastError.message));
          return;
        }

        if (!response?.ok) {
          reject(new Error(response?.error || "Background analyze failed"));
          return;
        }

        resolve(response.data);
      },
    );
  });
}

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

export async function analyzePost(text) {
  if (!text || text.trim().length === 0) {
    console.warn("analyzePost: Text is empty");
    return null;
  }

  try {
    let data;

    if (canUseExtensionBridge()) {
      data = await analyzeViaExtensionBridge(text);
    } else {
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error(`analyzePost: Backend returned ${response.status}`);
        return null;
      }

      data = await response.json();
    }

    const normalized = {
      ...data,
      verdict: normalizeVerdict(data?.verdict),
      confidence: normalizeConfidence(data?.confidence),
    };

    // Increment the claims checked counter
    claimsCheckedToday.increment();

    return normalized;
  } catch (error) {
    console.error("analyzePost: Error calling backend", error);
    return null;
  }
}
