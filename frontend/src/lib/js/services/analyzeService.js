import { verificationLevel } from "../Utilities.js";
import { claimsCheckedToday, analysisConfidence, analysis } from "../State.js";

const BACKEND_URL = "http://localhost:3001";

export async function analyzePost(text) {
  if (!text || text.trim().length === 0) {
    console.warn("analyzePost: Text is empty");
    return null;
  }

  try {
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

    const data = await response.json();

    // Update verification level based on analysis (map backend response to UI level)
    // This assumes backend returns a confidence or status field
    if (data.confidence !== undefined) {
      // Set confidence percentage (0-100)
      analysisConfidence.set(data.confidence);
      verificationLevel.set((data.verdict * 100).toString());
      analysis.set(data); // Store full analysis result for UI display
    }

    // Increment the claims checked counter
    claimsCheckedToday.increment();

    return data;
  } catch (error) {
    console.error("analyzePost: Error calling backend", error);
    return null;
  }
}
