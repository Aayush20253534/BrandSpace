/**
 * Renders the default Open Graph / social share image (1200×630) from an
 * HTML template with the brand fonts (embedded from @fontsource), using a
 * local Chromium.
 *
 * Usage: node scripts/generate-og.mjs
 * (Set CHROMIUM_PATH if Chromium isn't at the Playwright default location.)
 */
import { chromium } from "playwright-core";
import { readFile, mkdir } from "node:fs/promises";

const logo = (await readFile("public/brand/brandspace-logo.png")).toString("base64");
const font = async (pkg, file) => (await readFile(`node_modules/@fontsource/${pkg}/files/${file}`)).toString("base64");
const fonts = {
  display: await font("bricolage-grotesque", "bricolage-grotesque-latin-600-normal.woff2"),
  serif: await font("instrument-serif", "instrument-serif-latin-400-italic.woff2"),
  sans: await font("geist", "geist-latin-400-normal.woff2"),
};
const executablePath = process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const html = `<!doctype html><html><head>
<style>
  @font-face{font-family:'Bricolage Grotesque';font-weight:600;src:url(data:font/woff2;base64,${fonts.display}) format('woff2')}
  @font-face{font-family:'Instrument Serif';font-style:italic;src:url(data:font/woff2;base64,${fonts.serif}) format('woff2')}
  @font-face{font-family:'Geist';font-weight:400;src:url(data:font/woff2;base64,${fonts.sans}) format('woff2')}
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#070908;color:#f3f4ef;font-family:Geist,sans-serif;position:relative;overflow:hidden}
  .grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(243,244,239,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(243,244,239,.05) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse at 30% 50%,#000,transparent 75%)}
  .glow{position:absolute;left:-120px;top:40px;width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(91,209,123,.28),transparent 65%)}
  .wrap{position:absolute;inset:0;display:flex;align-items:center;gap:56px;padding:0 84px}
  img{width:300px;height:300px;filter:drop-shadow(0 0 1px rgba(255,255,255,.5)) drop-shadow(0 20px 60px rgba(91,209,123,.25))}
  .eyebrow{font-size:15px;letter-spacing:.28em;text-transform:uppercase;color:rgba(243,244,239,.55);display:flex;align-items:center;gap:12px}
  .dot{width:8px;height:8px;border-radius:50%;background:#5bd17b}
  h1{font-family:'Bricolage Grotesque';font-weight:600;font-size:104px;letter-spacing:-.04em;line-height:.95;margin-top:22px}
  .tag{font-family:'Instrument Serif';font-style:italic;font-size:54px;color:#5bd17b;margin-top:14px}
  .services{margin-top:34px;font-size:18px;color:rgba(243,244,239,.6);line-height:1.5;max-width:560px}
  .bar{position:absolute;left:0;right:0;bottom:0;height:8px;background:#5bd17b}
</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="wrap">
  <img src="data:image/png;base64,${logo}" alt="">
  <div>
    <p class="eyebrow"><span class="dot"></span>Digital Growth Agency · Prayagraj</p>
    <h1>BrandSpace</h1>
    <p class="tag">Future of Business Growth.</p>
    <p class="services">Web Development + SEO · Social Media · Meta Ads · Google Business Profile · Digital Branding</p>
  </div>
</div>
<div class="bar"></div>
</body></html>`;

const browser = await chromium.launch({ executablePath });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await mkdir("public/og", { recursive: true });
await page.screenshot({ path: "public/og/brandspace-og.jpg", type: "jpeg", quality: 88 });
await browser.close();
console.log("wrote public/og/brandspace-og.jpg");
