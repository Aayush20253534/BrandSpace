import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const failures = [];
const textExtensions = new Set([
  ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".yml", ".yaml", ".md", ".txt", ".env",
]);

const innerHtmlToken = "dangerously" + "SetInnerHTML";
const allowedInnerHtml = new Set([
  "src/app/blog/[slug]/page.tsx",
  "src/components/seo/JsonLd.tsx",
]);

for (const file of tracked) {
  const normalized = file.replaceAll("\\", "/");
  const base = path.basename(file);

  if ((base === ".env" || base.startsWith(".env.")) && base !== ".env.example") {
    failures.push(`${normalized}: environment file is tracked; only .env.example may be committed`);
  }

  const ext = path.extname(file);
  if (!textExtensions.has(ext) && base !== ".env.example") continue;

  let content;
  try {
    content = readFileSync(path.join(root, file), "utf8");
  } catch {
    continue;
  }

  if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) {
    failures.push(`${normalized}: private key material detected`);
  }

  if (/\b(?:re_|sk_live_|sk_test_)[A-Za-z0-9_-]{20,}\b/.test(content)) {
    failures.push(`${normalized}: probable hard-coded API secret detected`);
  }

  if (/process\.env\.NEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|TOKEN|PASSWORD|PRIVATE)/.test(content)) {
    failures.push(`${normalized}: secret-like environment variable is exposed with NEXT_PUBLIC_`);
  }

  if (content.includes(innerHtmlToken) && !allowedInnerHtml.has(normalized)) {
    failures.push(`${normalized}: unapproved raw HTML injection sink`);
  }
}

const blogRenderer = readFileSync(path.join(root, "src/lib/blog.ts"), "utf8");
if (!blogRenderer.includes("safeHref") || !blogRenderer.includes("html(token)")) {
  failures.push("src/lib/blog.ts: Markdown safety hooks are missing");
}

const contactRoute = readFileSync(path.join(root, "src/app/api/contact/route.ts"), "utf8");
for (const marker of ["BODY_LIMIT_BYTES", "originAllowed", "verifyTurnstile", "rateLimited"]) {
  if (!contactRoute.includes(marker)) failures.push(`src/app/api/contact/route.ts: missing ${marker} security control`);
}

if (failures.length) {
  console.error("Security source check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[security] scanned ${tracked.length} tracked files`);
console.log("[security] source security checks passed.");
