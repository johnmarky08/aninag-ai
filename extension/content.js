// Create a container for the Svelte app
const container = document.createElement("div");
container.id = "aninag-ai-root";
document.body.appendChild(container);

// Load built CSS
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = chrome.runtime.getURL("dist/assets/index.css");
document.head.appendChild(link);

// Load built JS
const script = document.createElement("script");
script.type = "module";
script.src = chrome.runtime.getURL("dist/assets/index.js");
document.body.appendChild(script);

console.log("ANINAG-AI content script loaded");
