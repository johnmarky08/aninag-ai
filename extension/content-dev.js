const ROOT_ID = "aninag-ai-root";
const DEV_SERVER = "http://localhost:5173";
const FB_POST_SELECTOR = '[role="article"]';
const FB_MESSAGE_SELECTOR = '[data-ad-preview="message"]';
const FB_BADGE_MOUNT_MARKER = "data-aninag-post-badge-mounted";

function cleanText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function collectFacebookPost(article, index) {
  const textCandidates = [
    ...article.querySelectorAll('[data-ad-preview="message"]'),
    ...article.querySelectorAll('[dir="auto"]'),
  ]
    .map((node) => cleanText(node.textContent))
    .filter((text) => text.length > 10);

  const fullText = cleanText(article.innerText);
  const text = textCandidates[0] || fullText;

  const postId = article.getAttribute("data-ft") || `fb-post-${index}`;

  return {
    id: postId,
    text,
    collectedAt: new Date().toISOString(),
    url: location.href,
  };
}

function buildFacebookReferences(posts) {
  const byId = {};
  const textRefs = [];

  posts.forEach((post, index) => {
    byId[post.id] = post;

    textRefs.push({ id: post.id, index, text: post.text });
  });

  return {
    posts,
    byId,
    textRefs,
    totalPosts: posts.length,
  };
}

function scanFacebookPosts() {
  if (!location.hostname.includes("facebook.com")) {
    return [];
  }

  const posts = Array.from(document.querySelectorAll(FB_POST_SELECTOR));
  const result = posts
    .map((article, index) => collectFacebookPost(article, index))
    .filter((post) => post.text);

  window.__ANINAG_FB_POSTS__ = result;
  window.__ANINAG_FB_REFERENCES__ = buildFacebookReferences(result);
  return result;
}

function exportFacebookPostsToJsFile() {
  const posts = window.__ANINAG_FB_POSTS__ || scanFacebookPosts();
  const payload = `window.__ANINAG_FB_POSTS__ = ${JSON.stringify(posts, null, 2)};\n`;
  const blob = new Blob([payload], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "facebook-posts-data.js";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

function initFacebookCollector() {
  if (!location.hostname.includes("facebook.com")) {
    return;
  }

  scanFacebookPosts();
  window.aninagScanFacebookPosts = scanFacebookPosts;
  window.aninagExportFacebookPosts = exportFacebookPostsToJsFile;
  window.aninagGetFacebookTextReferences = () =>
    window.__ANINAG_FB_REFERENCES__?.textRefs || [];
  window.aninagGetFacebookPostById = (id) =>
    window.__ANINAG_FB_REFERENCES__?.byId?.[id] || null;

  const observer = new MutationObserver(() => {
    scanFacebookPosts();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log(
    "ANINAG-AI Facebook collector ready. Run aninagExportFacebookPosts() to download JS file.",
  );
}

function mountBadgesOnFacebookMessages(mountApp) {
  if (!location.hostname.includes("facebook.com")) {
    return;
  }

  document.querySelectorAll(FB_MESSAGE_SELECTOR).forEach((messageEl) => {
    if (!(messageEl instanceof HTMLElement)) return;

    const mountScope = messageEl.closest(FB_POST_SELECTOR) || messageEl;
    if (!(mountScope instanceof HTMLElement)) return;
    if (mountScope.getAttribute(FB_BADGE_MOUNT_MARKER) === "true") return;
    mountScope.setAttribute(FB_BADGE_MOUNT_MARKER, "true");

    const mountWrapper = document.createElement("div");
    mountWrapper.setAttribute("data-aninag-badge-wrapper", "true");
    mountWrapper.style.cssText =
      "display:flex;justify-content:flex-end;width:100%;overflow:visible;margin:6px 0;position:relative;z-index:2147483647;isolation:isolate;";

    const mountTarget = document.createElement("div");
    mountWrapper.appendChild(mountTarget);

    mountScope.prepend(mountWrapper);
    mountApp(mountTarget, { embedded: true });
  });
}

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
    const appModule = await import(`${DEV_SERVER}/src/main.js`);
    const mountApp = appModule.mountApp || appModule.default;

    if (typeof mountApp === "function") {
      mountApp(ensureRoot(), { embedded: false });
      mountBadgesOnFacebookMessages(mountApp);
    }

    // Expose analyze function globally for post analysis
    if (appModule.analyzePost) {
      window.aninagAnalyzePost = appModule.analyzePost;
    }

    initFacebookCollector();

    const badgeObserver = new MutationObserver(() => {
      if (typeof mountApp === "function") {
        mountBadgesOnFacebookMessages(mountApp);
      }
    });
    badgeObserver.observe(document.body, { childList: true, subtree: true });

    console.log("ANINAG-AI content script loaded (DEV MODE)");
    console.log("Connected to dev server at http://localhost:5173");
  } catch (error) {
    console.error(
      "Failed to load from dev server. Make sure to run 'npm run dev' in frontend",
      error,
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapDev, { once: true });
} else {
  bootstrapDev();
}
