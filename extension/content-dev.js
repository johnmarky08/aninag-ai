const ROOT_ID = "aninag-ai-root";
const DEV_SERVERS = [
  "http://localhost:5173",
  "http://[::1]:5173",
  "http://127.0.0.1:5173",
];
const FB_POST_SELECTOR = '[role="article"]';
const FB_MESSAGE_SELECTOR = '[data-ad-preview="message"]';
const FB_BADGE_MOUNT_MARKER = "data-aninag-post-badge-mounted";
const X_TWEET_SELECTOR = "article";
const X_TEXT_SELECTOR = '[data-testid="tweetText"]';
const X_BADGE_MOUNT_MARKER = "data-aninag-tweet-badge-mounted";

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

function collectTwitterPost(article, index) {
  const textElement = article.querySelector(X_TEXT_SELECTOR);
  const text = textElement ? cleanText(textElement.textContent) : "";

  const tweetId = article.getAttribute("data-testid") || `x-tweet-${index}`;

  return {
    id: tweetId,
    text,
    platform: "x",
    collectedAt: new Date().toISOString(),
    url: location.href,
  };
}

function buildTwitterReferences(posts) {
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

function scanTwitterPosts() {
  if (
    !location.hostname.includes("twitter.com") &&
    !location.hostname.includes("x.com")
  ) {
    return [];
  }

  const tweets = Array.from(document.querySelectorAll(X_TWEET_SELECTOR));
  const result = tweets
    .map((article, index) => collectTwitterPost(article, index))
    .filter((post) => post.text);

  window.__ANINAG_X_POSTS__ = result;
  window.__ANINAG_X_REFERENCES__ = buildTwitterReferences(result);
  return result;
}

function initTwitterCollector() {
  if (
    !location.hostname.includes("twitter.com") &&
    !location.hostname.includes("x.com")
  ) {
    return;
  }

  scanTwitterPosts();
  window.aninagScanTwitterPosts = scanTwitterPosts;
  window.aninagGetTwitterTextReferences = () =>
    window.__ANINAG_X_REFERENCES__?.textRefs || [];
  window.aninagGetTwitterPostById = (id) =>
    window.__ANINAG_X_REFERENCES__?.byId?.[id] || null;

  const observer = new MutationObserver(() => {
    scanTwitterPosts();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  console.log("ANINAG-AI X/Twitter collector ready.");
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

function mountBadgesOnTwitterPosts(mountApp) {
  if (
    !location.hostname.includes("twitter.com") &&
    !location.hostname.includes("x.com")
  ) {
    return;
  }

  document.querySelectorAll(X_TWEET_SELECTOR).forEach((article) => {
    if (!(article instanceof HTMLElement)) return;

    // Skip comment tweets - check if article is inside a conversation/detail view
    const mainFeed = article.closest('[role="main"]');
    if (!mainFeed || mainFeed.querySelector('[data-testid="conversation"]')) {
      return; // Skip if it's in a conversation thread (likely a comment)
    }

    if (article.getAttribute(X_BADGE_MOUNT_MARKER) === "true") return;
    article.setAttribute(X_BADGE_MOUNT_MARKER, "true");

    const mountWrapper = document.createElement("div");
    mountWrapper.setAttribute("data-aninag-badge-wrapper", "true");
    mountWrapper.style.cssText =
      "position:absolute;top:0;right:0;z-index:2147483647;isolation:isolate;overflow:visible;";

    const mountTarget = document.createElement("div");
    mountWrapper.appendChild(mountTarget);

    article.style.position = "relative";
    article.prepend(mountWrapper);
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

function ensureStylesheet() {
  const href = chrome.runtime.getURL("dist/assets/index.css");
  const existing = Array.from(
    document.querySelectorAll("link[rel='stylesheet']"),
  ).find((node) => node.href === href);

  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function showBootErrorMarker(message) {
  const markerId = "aninag-ai-boot-error-marker";
  if (document.getElementById(markerId)) return;

  const marker = document.createElement("div");
  marker.id = markerId;
  marker.textContent = message;
  marker.style.cssText =
    "position:fixed;top:8px;left:8px;z-index:2147483647;background:#b91c1c;color:#fff;padding:8px 10px;border-radius:8px;font:12px/1.3 Arial,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.35);";
  document.body.appendChild(marker);
}

function showDevInjectedPing() {
  const markerId = "aninag-ai-dev-injected-marker";
  if (document.getElementById(markerId)) return;

  const marker = document.createElement("div");
  marker.id = markerId;
  marker.textContent = "ANINAG DEV injected";
  marker.style.cssText =
    "position:fixed;top:8px;left:8px;z-index:2147483647;background:#166534;color:#fff;padding:6px 9px;border-radius:999px;font:11px/1 Arial,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.28);opacity:.95;";
  document.body.appendChild(marker);

  setTimeout(() => {
    marker.remove();
  }, 4000);
}

async function bootstrapDev() {
  // Prevent duplicate bootstraps on the same page.
  if (window.__ANINAG_AI_LOADED__) {
    return;
  }
  window.__ANINAG_AI_LOADED__ = true;

  showDevInjectedPing();

  ensureRoot();

  try {
    let appModule = null;
    let usedBundle = false;
    const isSecurePage = location.protocol === "https:";

    // HTTPS pages (like Facebook) can block HTTP module imports from localhost.
    // Prefer extension bundle there, then try dev servers as fallback.
    if (isSecurePage) {
      appModule = await import(chrome.runtime.getURL("dist/assets/index.js"));
      usedBundle = true;
      console.log(
        "ANINAG-AI HTTPS page detected. Using bundled app for reliable injection.",
      );
    }

    // Try live dev server for non-HTTPS pages (or as fallback).
    if (!appModule) {
      for (const server of DEV_SERVERS) {
        try {
          await import(`${server}/@vite/client`);
          appModule = await import(`${server}/src/main.js`);
          console.log(`ANINAG-AI connected to dev server at ${server}`);
          break;
        } catch {
          // Continue to next candidate.
        }
      }
    }

    // Final fallback if dev server is unavailable.
    if (!appModule) {
      appModule = await import(chrome.runtime.getURL("dist/assets/index.js"));
      usedBundle = true;
      console.warn(
        "ANINAG-AI dev server unavailable, using production bundle fallback.",
      );
    }

    if (usedBundle) {
      ensureStylesheet();
    }

    const mountApp = appModule.mountApp || appModule.default;

    if (typeof mountApp === "function") {
      mountApp(ensureRoot(), { embedded: false });
      mountBadgesOnFacebookMessages(mountApp);
      mountBadgesOnTwitterPosts(mountApp);
    }

    // Expose analyze function globally for post analysis
    if (appModule.analyzePost) {
      window.aninagAnalyzePost = appModule.analyzePost;
    }

    initFacebookCollector();
    initTwitterCollector();

    const badgeObserver = new MutationObserver(() => {
      if (typeof mountApp === "function") {
        mountBadgesOnFacebookMessages(mountApp);
        mountBadgesOnTwitterPosts(mountApp);
      }
    });
    badgeObserver.observe(document.body, { childList: true, subtree: true });

    console.log("ANINAG-AI content script loaded (DEV MODE)");
  } catch (error) {
    console.error(
      "Failed to load from dev server. Make sure to run 'npm run dev' in frontend",
      error,
    );
    showBootErrorMarker(
      "ANINAG failed to load. Reload extension and rebuild frontend.",
    );
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrapDev, { once: true });
} else {
  bootstrapDev();
}
