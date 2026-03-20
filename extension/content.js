const ROOT_ID = "aninag-ai-root";

function ensureRoot() {
  // Reuse existing mount root if the content script runs more than once.
  let root = document.getElementById(ROOT_ID);
  if (root) {
    return root;
  }

  root = document.createElement("div");
  root.id = ROOT_ID;
  document.body.appendChild(root);
  return root;
}

function ensureStylesheet() {
  // Load compiled frontend styles exactly once.
  const href = chrome.runtime.getURL("dist/assets/index.css");
  const existing = Array.from(
    document.querySelectorAll("link[rel='stylesheet']"),
  ).find((node) => node.href === href);

  if (existing) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

async function bootstrapProd() {
  // Prevent duplicate app mounts in the same tab context.
  if (window.__ANINAG_AI_LOADED__) {
    return;
  }
  window.__ANINAG_AI_LOADED__ = true;

  ensureRoot();
  ensureStylesheet();

  try {
    // Import from extension URL in content-script context to avoid site CSP issues.
    await import(chrome.runtime.getURL("dist/assets/index.js"));
    console.log("ANINAG-AI content script loaded (PROD MODE)");
  } catch (error) {
    console.error("ANINAG-AI failed to load production bundle", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapProd, { once: true });
} else {
  bootstrapProd();
}
