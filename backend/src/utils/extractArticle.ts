import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

/**
 * Extract readable article text from HTML using Readability.
 *
 * @param html Raw HTML string
 * @param url Source URL for parsing context
 * @returns Extracted plain text or null if unavailable
 */
export function extractArticle(html: string, url: string): string | null {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  return article ? article.textContent || null : null;
}
