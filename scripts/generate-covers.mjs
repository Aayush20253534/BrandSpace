/**
 * Generates editorial cover art for blog articles (1600×900 WebP) from
 * code-drawn SVG compositions in the BrandSpace palette. Covers are
 * abstract on purpose — relevant to each topic without generic stock.
 *
 * Usage: node scripts/generate-covers.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const W = 1600;
const H = 900;
const G = "#5bd17b";
const INK = "#070908";
const PAPER = "#f3f4ef";

const frame = (inner, { glowX = 1100, glowY = 380, hue = G } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="bg" cx="${glowX / W}" cy="${glowY / H}" r="0.9">
      <stop offset="0" stop-color="#15291d"/>
      <stop offset="0.45" stop-color="#0b120e"/>
      <stop offset="1" stop-color="${INK}"/>
    </radialGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${hue}" stop-opacity="0.35"/>
      <stop offset="1" stop-color="${hue}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="${PAPER}" stroke-opacity="0.045"/>
    </pattern>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/></filter>
    <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${G}"/><stop offset="1" stop-color="#1f8f47"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <circle cx="${glowX}" cy="${glowY}" r="520" fill="url(#glow)"/>
  ${inner}
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;

const star = (x, y, r, fill) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`;
};

const covers = {
  "google-business-profile-optimization-checklist": frame(`
    <g fill="none" stroke="${PAPER}" stroke-opacity="0.1" stroke-width="26" stroke-linecap="round">
      <path d="M-40 640 C300 560 520 720 820 610 S1300 470 1680 560"/>
      <path d="M560 -40 C600 260 480 520 640 940"/>
      <path d="M1180 -40 L1120 940" stroke-width="16"/>
      <path d="M-40 260 L1680 330" stroke-width="12"/>
    </g>
    <g transform="translate(1040 430)">
      <ellipse rx="190" ry="54" fill="none" stroke="${G}" stroke-opacity="0.25" stroke-width="2"/>
      <ellipse rx="110" ry="30" fill="none" stroke="${G}" stroke-opacity="0.45" stroke-width="2"/>
      <path d="M0 0 C-14 -36 -86 -96 -86 -176 a86 86 0 0 1 172 0 C86 -96 14 -36 0 0Z" fill="url(#gg)"/>
      <circle cy="-176" r="32" fill="${INK}"/>
    </g>
    <g transform="translate(150 150)">
      <rect width="420" height="190" rx="18" fill="#0f1511" stroke="${G}" stroke-opacity="0.35"/>
      <rect x="36" y="38" width="220" height="22" rx="5" fill="${PAPER}" fill-opacity="0.85"/>
      <rect x="36" y="76" width="150" height="12" rx="4" fill="${PAPER}" fill-opacity="0.3"/>
      ${[0, 1, 2, 3, 4].map((i) => star(52 + i * 44, 136, 17, "#f5c451")).join("")}
      <rect x="290" y="118" width="92" height="36" rx="18" fill="${G}"/>
    </g>`),

  "why-your-website-loses-customers-in-3-seconds": frame(`
    <g transform="translate(170 150)">
      <rect width="900" height="600" rx="22" fill="#0e1410" stroke="${G}" stroke-opacity="0.4" stroke-width="2"/>
      <rect width="900" height="56" rx="22" fill="${G}" fill-opacity="0.1"/>
      <circle cx="38" cy="28" r="8" fill="${PAPER}" fill-opacity="0.4"/><circle cx="66" cy="28" r="8" fill="${PAPER}" fill-opacity="0.4"/><circle cx="94" cy="28" r="8" fill="${PAPER}" fill-opacity="0.4"/>
      <rect x="60" y="120" width="420" height="40" rx="6" fill="${PAPER}" fill-opacity="0.88"/>
      <rect x="60" y="176" width="300" height="40" rx="6" fill="${PAPER}" fill-opacity="0.88"/>
      <rect x="60" y="246" width="360" height="14" rx="5" fill="${PAPER}" fill-opacity="0.3"/>
      <rect x="60" y="272" width="280" height="14" rx="5" fill="${PAPER}" fill-opacity="0.3"/>
      <rect x="60" y="320" width="170" height="52" rx="26" fill="${G}"/>
      <rect x="540" y="110" width="300" height="270" rx="12" fill="url(#gg)" fill-opacity="0.6"/>
      <rect x="60" y="430" width="240" height="120" rx="10" fill="${PAPER}" fill-opacity="0.06"/>
      <rect x="330" y="430" width="240" height="120" rx="10" fill="${PAPER}" fill-opacity="0.06"/>
      <rect x="600" y="430" width="240" height="120" rx="10" fill="${PAPER}" fill-opacity="0.06"/>
    </g>
    <g transform="translate(1230 560)">
      <circle r="190" fill="${INK}" stroke="${PAPER}" stroke-opacity="0.12" stroke-width="22"/>
      <circle r="190" fill="none" stroke="${G}" stroke-width="22" stroke-linecap="round" stroke-dasharray="1100 1194" transform="rotate(-90)"/>
      <path d="M0 0 L108 -92" stroke="${PAPER}" stroke-width="8" stroke-linecap="round"/>
      <circle r="18" fill="${G}"/>
    </g>`, { glowX: 1230, glowY: 560 }),

  "local-seo-guide-for-small-businesses": frame(`
    <g transform="translate(260 120)">
      <rect width="1080" height="110" rx="55" fill="#0f1511" stroke="${G}" stroke-opacity="0.55" stroke-width="2"/>
      <circle cx="72" cy="52" r="22" fill="none" stroke="${G}" stroke-width="7"/>
      <path d="M88 70 L108 90" stroke="${G}" stroke-width="7" stroke-linecap="round"/>
      <rect x="150" y="44" width="520" height="20" rx="6" fill="${PAPER}" fill-opacity="0.75"/>
      <rect x="682" y="32" width="4" height="46" fill="${G}"/>
    </g>
    <g transform="translate(300 820)">
      ${[140, 200, 170, 260, 320, 300, 420, 540]
        .map((h, i) => `<rect x="${i * 132}" y="${-h}" width="84" height="${h}" rx="8" fill="${i === 7 ? G : PAPER}" fill-opacity="${i === 7 ? 1 : 0.12 + i * 0.03}"/>`)
        .join("")}
      <path d="M42 -170 L174 -230 L306 -200 L438 -290 L570 -350 L702 -330 L834 -450 L966 -570" fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="966" cy="-570" r="16" fill="${G}"/>
    </g>`, { glowX: 1266, glowY: 330 }),

  "meta-ads-for-local-businesses": frame(`
    <g transform="translate(980 450)">
      ${[360, 280, 200, 120].map((r, i) => `<circle r="${r}" fill="none" stroke="${G}" stroke-opacity="${0.12 + i * 0.16}" stroke-width="${i === 3 ? 4 : 2}"/>`).join("")}
      <circle r="44" fill="url(#gg)"/>
      <path d="M70 60 l0 130 l34 -34 l40 70 l26 -14 l-40 -70 l48 -8 Z" fill="${PAPER}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
    </g>
    <g fill="${PAPER}">
      ${Array.from({ length: 70 }, (_, i) => {
        const a = i * 2.39996;
        const r = 120 + ((i * 53) % 330);
        const x = 380 + Math.cos(a) * r * 0.9;
        const y = 450 + Math.sin(a) * r * 0.75;
        const hot = i % 7 === 0;
        return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${hot ? 9 : 6}" fill="${hot ? G : PAPER}" fill-opacity="${hot ? 0.95 : 0.22}"/>`;
      }).join("")}
    </g>`, { glowX: 980, glowY: 450 }),

  "what-a-brand-identity-really-includes": frame(`
    <g transform="translate(800 450)" fill="none">
      <g stroke="${PAPER}" stroke-opacity="0.12" stroke-width="2">
        <line x1="-800" y1="0" x2="800" y2="0"/><line x1="0" y1="-450" x2="0" y2="450"/>
        <line x1="-700" y1="-350" x2="700" y2="350" stroke-dasharray="8 12"/>
      </g>
      <circle r="330" stroke="${G}" stroke-opacity="0.3" stroke-width="2"/>
      <circle r="210" stroke="${G}" stroke-opacity="0.5" stroke-width="2"/>
      <circle cx="210" cy="-130" r="84" stroke="${PAPER}" stroke-opacity="0.35" stroke-width="2"/>
      <path d="M-120 -150 L160 0 L-120 150 Z" fill="url(#gg)" stroke="${G}" stroke-width="30" stroke-linejoin="round"/>
      <path d="M-50 -58 L50 0 L-50 58 Z" fill="${INK}"/>
    </g>
    <g transform="translate(150 700)">
      <rect width="90" height="90" rx="10" fill="${G}"/>
      <rect x="110" width="90" height="90" rx="10" fill="#0d2a17" stroke="${G}" stroke-opacity="0.5"/>
      <rect x="220" width="90" height="90" rx="10" fill="${PAPER}"/>
      <rect x="330" width="90" height="90" rx="10" fill="${INK}" stroke="${PAPER}" stroke-opacity="0.3"/>
    </g>
    <text x="1250" y="790" fill="${PAPER}" fill-opacity="0.85" font-size="150" font-family="Georgia, serif" font-style="italic">Aa</text>`, { glowX: 800, glowY: 450 }),

  "social-media-content-system": frame(`
    <g transform="translate(470 110) skewY(-6)">
      ${Array.from({ length: 9 }, (_, i) => {
        const x = (i % 3) * 230;
        const y = Math.floor(i / 3) * 230;
        const fills = [G, "#2b3a31", "#f2a65a", "#1d2a23", "#7cc6ff", G, "#26332b", "#ff7a9c", "#e8e1c6"];
        const hi = i === 4;
        return `<rect x="${x}" y="${y}" width="210" height="210" rx="14" fill="${fills[i]}" fill-opacity="${hi ? 1 : 0.5}" ${hi ? `stroke="${PAPER}" stroke-width="4"` : ""}/>`;
      }).join("")}
      <path transform="translate(335 350) scale(4)" d="M0 12C-16 2-10-12 0-5c10-7 16 7 0 17Z" fill="${INK}"/>
    </g>
    <g transform="translate(1170 150)">
      <rect width="260" height="88" rx="44" fill="${INK}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>
      <path transform="translate(60 48) scale(2.2)" d="M0 8C-11 1-7-8 0-3c7-5 11 5 0 11Z" fill="#ff7a9c"/>
      <rect x="110" y="36" width="110" height="16" rx="6" fill="${PAPER}" fill-opacity="0.8"/>
    </g>`, { glowX: 800, glowY: 440 }),

  "digital-marketing-funnel-that-converts": frame(`
    <g transform="translate(800 150)">
      ${[
        [560, 0.14],
        [440, 0.24],
        [320, 0.38],
        [200, 0.62],
      ]
        .map(([w, o], i) => {
          const y = i * 150;
          const next = [440, 320, 200, 90][i];
          return `<path d="M${-w} ${y} L${w} ${y} L${next} ${y + 130} L${-next} ${y + 130} Z" fill="${G}" fill-opacity="${o}" stroke="${G}" stroke-opacity="0.6" stroke-width="2"/>`;
        })
        .join("")}
      <circle cx="0" cy="680" r="34" fill="${G}"/>
      ${Array.from({ length: 34 }, (_, i) => {
        const x = ((i * 97) % 1000) - 500;
        const y = -60 + ((i * 41) % 80);
        return `<circle cx="${x}" cy="${y}" r="7" fill="${PAPER}" fill-opacity="0.35"/>`;
      }).join("")}
    </g>`, { glowX: 800, glowY: 700 }),

  "digital-growth-flywheel": frame(`
    <g transform="translate(620 460)" fill="none" stroke-linecap="round">
      <circle r="300" stroke="${PAPER}" stroke-opacity="0.08" stroke-width="40"/>
      <path d="M300 0 A300 300 0 0 1 -150 259.8" stroke="${G}" stroke-width="40"/>
      <path d="M-150 259.8 A300 300 0 0 1 -150 -259.8" stroke="${G}" stroke-opacity="0.55" stroke-width="40"/>
      <path d="M-150 -259.8 A300 300 0 0 1 300 0" stroke="${G}" stroke-opacity="0.3" stroke-width="40"/>
      <circle r="170" stroke="${PAPER}" stroke-opacity="0.15" stroke-width="2"/>
      <circle r="70" fill="url(#gg)" stroke="none"/>
      ${[0, 120, 240].map((a) => `<circle cx="${(300 * Math.cos((a * Math.PI) / 180)).toFixed(1)}" cy="${(300 * Math.sin((a * Math.PI) / 180)).toFixed(1)}" r="26" fill="${INK}" stroke="${PAPER}" stroke-width="4"/>`).join("")}
    </g>
    <path d="M980 760 C1100 740 1140 660 1220 620 S1360 420 1480 250" fill="none" stroke="${G}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="1480" cy="250" r="18" fill="${G}"/>`, { glowX: 620, glowY: 460 }),
};

await mkdir("public/blog", { recursive: true });
for (const [slug, svg] of Object.entries(covers)) {
  await sharp(Buffer.from(svg)).webp({ quality: 86, effort: 6 }).toFile(`public/blog/${slug}.webp`);
  console.log("cover:", slug);
}
