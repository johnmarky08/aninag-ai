const BACKEND_URL = "http://localhost:3001";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "ANINAG_ANALYZE_POST") {
    return false;
  }

  const text = typeof message.text === "string" ? message.text.trim() : "";
  if (!text) {
    sendResponse({ ok: false, error: "Text is empty" });
    return false;
  }

  (async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => "");
        sendResponse({
          ok: false,
          error: `Backend returned ${response.status}${body ? `: ${body}` : ""}`,
        });
        return;
      }

      const data = await response.json();
      sendResponse({ ok: true, data });
    } catch (error) {
      sendResponse({
        ok: false,
        error:
          error instanceof Error ? error.message : "Failed to reach backend",
      });
    }
  })();

  // Keep message channel open for async response.
  return true;
});
