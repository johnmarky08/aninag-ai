const ROOT_ID = "aninag-ai-root";
const FB_POST_SELECTOR = '[role="article"]';
const FB_MESSAGE_SELECTOR = '[data-ad-preview="message"]';
const FB_BADGE_MOUNT_MARKER = "data-aninag-post-badge-mounted";
const X_TWEET_SELECTOR = "article";
const X_TEXT_SELECTOR = '[data-testid="tweetText"]';
const X_BADGE_MOUNT_MARKER = "data-aninag-tweet-badge-mounted";

function upsertPostReference(key, post) {
  if (!post?.id) return;

  const postsKey =
    key === "facebook" ? "__ANINAG_FB_POSTS__" : "__ANINAG_X_POSTS__";
  const refsKey =
    key === "facebook" ? "__ANINAG_FB_REFERENCES__" : "__ANINAG_X_REFERENCES__";

  const posts = Array.isArray(window[postsKey]) ? window[postsKey] : [];
  const existingIndex = posts.findIndex((item) => item?.id === post.id);
  if (existingIndex >= 0) {
    posts[existingIndex] = post;
  } else {
    posts.push(post);
  }

  window[postsKey] = posts;
  window[refsKey] =
    key === "facebook"
      ? buildFacebookReferences(posts)
      : buildTwitterReferences(posts);
}

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

  const messageCandidates = document.querySelectorAll(FB_MESSAGE_SELECTOR);
  const mountCandidates =
    messageCandidates.length > 0
      ? messageCandidates
      : document.querySelectorAll(FB_POST_SELECTOR);

  mountCandidates.forEach((messageEl, index) => {
    if (!(messageEl instanceof HTMLElement)) return;

    const mountScope = messageEl.closest(FB_POST_SELECTOR) || messageEl;
    if (!(mountScope instanceof HTMLElement)) return;
    if (mountScope.getAttribute(FB_BADGE_MOUNT_MARKER) === "true") return;
    mountScope.setAttribute(FB_BADGE_MOUNT_MARKER, "true");

    const post = collectFacebookPost(mountScope, index);
    if (post?.text) {
      upsertPostReference("facebook", post);
    }

    const mountWrapper = document.createElement("div");
    mountWrapper.setAttribute("data-aninag-badge-wrapper", "true");
    mountWrapper.style.cssText =
      "display:flex;justify-content:flex-end;width:100%;overflow:visible;margin:6px 0;position:relative;z-index:2147483647;isolation:isolate;";

    const mountTarget = document.createElement("div");
    mountWrapper.appendChild(mountTarget);

    mountScope.prepend(mountWrapper);
    mountApp(mountTarget, {
      embedded: true,
      postId: post?.id || `fb-post-${index}`,
      postText: post?.text || "",
    });
  });
}

function mountBadgesOnTwitterPosts(mountApp) {
  if (
    !location.hostname.includes("twitter.com") &&
    !location.hostname.includes("x.com")
  ) {
    return;
  }

  document.querySelectorAll(X_TWEET_SELECTOR).forEach((article, index) => {
    if (!(article instanceof HTMLElement)) return;

    // Skip replies in conversation threads, but do not skip all feed tweets.
    if (article.closest('[data-testid="conversation"]')) return;

    if (article.getAttribute(X_BADGE_MOUNT_MARKER) === "true") return;
    article.setAttribute(X_BADGE_MOUNT_MARKER, "true");

    const post = collectTwitterPost(article, index);
    if (post?.text) {
      upsertPostReference("x", post);
    }

    const mountWrapper = document.createElement("div");
    mountWrapper.setAttribute("data-aninag-badge-wrapper", "true");
    mountWrapper.style.cssText =
      "position:absolute;top:0;right:0;z-index:2147483647;isolation:isolate;overflow:visible;";

    const mountTarget = document.createElement("div");
    mountWrapper.appendChild(mountTarget);

    article.style.position = "relative";
    article.prepend(mountWrapper);
    mountApp(mountTarget, {
      embedded: true,
      postId: post?.id || `x-tweet-${index}`,
      postText: post?.text || "",
    });
  });
}

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
    const appModule = await import(
      chrome.runtime.getURL("dist/assets/index.js")
    );
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
