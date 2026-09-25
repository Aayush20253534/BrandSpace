import { readFileSync } from "node:fs";
import path from "node:path";
import { Marked, type Tokens } from "marked";
import { blogPosts, type BlogPost } from "@/data/blog";

/** Server-only helpers: load and render article Markdown at build time. */

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

export type TocItem = { id: string; text: string; depth: number };

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

const escapeAttribute = (value: string) => escapeHtml(value).replace(/`/g, "&#96;");

const safeHref = (href: string) => {
  const value = href.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(?:mailto:|tel:)/i.test(value)) return value;
  if (/^#/.test(value)) return value;
  if (/^\/(?!\/)/.test(value)) return value;
  if (/^\.\.?\//.test(value)) return value;
  return null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 64);

function readRaw(slug: string) {
  return readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf8");
}

export function wordCount(slug: string) {
  return readRaw(slug)
    .replace(/[#>*_`|\-[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingTime(slug: string) {
  return Math.max(1, Math.ceil(wordCount(slug) / 220));
}

export function renderPost(post: BlogPost) {
  const toc: TocItem[] = [];
  const used = new Set<string>();
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Heading) {
        const html = this.parser.parseInline(token.tokens);
        let id = slugify(token.text);
        while (used.has(id)) id += "-x";
        used.add(id);
        if (token.depth <= 3) toc.push({ id, text: token.text.replace(/\*\*/g, ""), depth: token.depth });
        return `<h${token.depth} id="${id}">${html}</h${token.depth}>\n`;
      },
      html(token) {
        // Articles are authored in Markdown. Raw HTML is displayed as text,
        // never passed through as executable markup.
        return escapeHtml(token.text);
      },
      link(this: { parser: { parseInline: (t: Tokens.Generic[]) => string } }, token: Tokens.Link) {
        const text = this.parser.parseInline(token.tokens);
        const href = safeHref(token.href);
        if (!href) return text;

        const external = /^https?:\/\//i.test(href);
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
        const title = token.title ? ` title="${escapeAttribute(token.title)}"` : "";
        return `<a href="${escapeAttribute(href)}"${title}${attrs}>${text}</a>`;
      },
      image(token) {
        const href = safeHref(token.href);
        if (!href || /^(?:mailto:|tel:|#)/i.test(href)) return escapeHtml(token.text);
        const title = token.title ? ` title="${escapeAttribute(token.title)}"` : "";
        return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(token.text)}"${title}>`;
      },
    },
  });

  let html = marked.parse(readRaw(post.slug), { async: false }) as string;
  // Wide tables scroll horizontally on small screens instead of overflowing.
  html = html.replace(/<table>/g, '<div class="table-wrap" tabindex="0" role="region" aria-label="Table (scrolls horizontally)"><table>').replace(/<\/table>/g, "</table></div>");

  return { html, toc: toc.filter((t) => t.depth === 2), words: wordCount(post.slug) };
}

export function postsWithMeta() {
  return blogPosts.map((p) => ({ ...p, minutes: readingTime(p.slug) }));
}
