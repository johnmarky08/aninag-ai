const ROOT_ID = "aninag-ai-root";
const DEV_SERVER = "http://localhost:5173";

function ensureRoot() {
  // Content scripts can run multiple times on SPA navigations, so reuse the root if it exists.
  let root = document.getElementById(ROOT_ID);
  if (root) {
    return root;
  }

  root = document.createElement("div");
  root.id = ROOT_ID;
  document.body.appendChild(root);
  return root;
}

async function bootstrapDev() {
  // Prevent duplicate bootstraps on the same page.
  if (window.__ANINAG_AI_LOADED__) {
    return;
  }
  window.__ANINAG_AI_LOADED__ = true;

  ensureRoot();

  try {
    // Import via content-script context to avoid page CSP blocking injected script tags.
    await import(`${DEV_SERVER}/@vite/client`);
    await import(`${DEV_SERVER}/src/main.js`);
    console.log("ANINAG-AI content script loaded (DEV MODE)");
    console.log("Connected to dev server at http://localhost:5173");
  } catch (error) {
    console.error(
      "Failed to load from dev server. Make sure to run 'npm run dev' in extension/frontend",
      error,
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapDev, { once: true });
} else {
  bootstrapDev();
}
