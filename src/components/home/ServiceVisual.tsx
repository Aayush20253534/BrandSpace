import type { ServiceVisual as Kind } from "@/data/services";

/**
 * Small code-drawn illustrations for each service. Pure SVG + CSS
 * animation (disabled automatically for reduced motion).
 */
export function ServiceVisual({ kind, className }: { kind: Kind; className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={className} role="presentation" aria-hidden focusable="false">
      <defs>
        <linearGradient id={`sv-g-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5bd17b" stopOpacity="0.9" />
          <stop offset="1" stopColor="#1f8f47" stopOpacity="0.35" />
        </linearGradient>
        <pattern id={`sv-grid-${kind}`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#f3f4ef" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill={`url(#sv-grid-${kind})`} />
      {kind === "web" && <Web id={kind} />}
      {kind === "social" && <Social />}
      {kind === "ads" && <Ads />}
      {kind === "gbp" && <Gbp />}
      {kind === "brand" && <Brand />}
    </svg>
  );
}

function Web({ id }: { id: string }) {
  return (
    <g>
      <g className="sv-rise">
        <rect x="60" y="34" width="220" height="160" rx="6" fill="#0f1511" stroke="#5bd17b" strokeOpacity="0.5" />
        <rect x="60" y="34" width="220" height="16" rx="6" fill="#5bd17b" fillOpacity="0.12" />
        <circle cx="72" cy="42" r="2.5" fill="#f3f4ef" fillOpacity="0.5" />
        <circle cx="81" cy="42" r="2.5" fill="#f3f4ef" fillOpacity="0.5" />
        <circle cx="90" cy="42" r="2.5" fill="#f3f4ef" fillOpacity="0.5" />
        <rect className="sv-bar" x="76" y="66" width="96" height="10" rx="2" fill="#f3f4ef" fillOpacity="0.85" />
        <rect className="sv-bar sv-d1" x="76" y="82" width="70" height="10" rx="2" fill="#f3f4ef" fillOpacity="0.85" />
        <rect className="sv-bar sv-d2" x="76" y="100" width="84" height="4" rx="2" fill="#f3f4ef" fillOpacity="0.3" />
        <rect className="sv-bar sv-d2" x="76" y="108" width="60" height="4" rx="2" fill="#f3f4ef" fillOpacity="0.3" />
        <rect className="sv-bar sv-d3" x="76" y="122" width="38" height="12" rx="6" fill="#5bd17b" />
        <rect className="sv-fade sv-d2" x="186" y="64" width="80" height="72" rx="3" fill={`url(#sv-g-${id})`} />
        <rect className="sv-fade sv-d3" x="76" y="150" width="58" height="32" rx="3" fill="#f3f4ef" fillOpacity="0.07" />
        <rect className="sv-fade sv-d3" x="141" y="150" width="58" height="32" rx="3" fill="#f3f4ef" fillOpacity="0.07" />
        <rect className="sv-fade sv-d3" x="206" y="150" width="58" height="32" rx="3" fill="#f3f4ef" fillOpacity="0.07" />
      </g>
      {/* performance gauge */}
      <g transform="translate(318 170)">
        <circle r="40" fill="#0b100d" stroke="#f3f4ef" strokeOpacity="0.1" strokeWidth="6" />
        <circle
          className="sv-gauge"
          r="40"
          fill="none"
          stroke="#5bd17b"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="251"
          transform="rotate(-90)"
        />
        <text y="7" textAnchor="middle" fill="#f3f4ef" fontSize="20" fontWeight="600" fontFamily="var(--font-display)">
          100
        </text>
        <text y="58" textAnchor="middle" fill="#f3f4ef" fillOpacity="0.5" fontSize="9" letterSpacing="2">
          PERFORMANCE
        </text>
      </g>
    </g>
  );
}

function Social() {
  const tiles = Array.from({ length: 9 }, (_, i) => i);
  const fills = ["#5bd17b", "#2b3a31", "#f2a65a", "#1d2a23", "#7cc6ff", "#5bd17b", "#26332b", "#ff7a9c", "#e8e1c6"];
  return (
    <g transform="translate(92 22)">
      {tiles.map((i) => (
        <rect
          key={i}
          className="sv-pop"
          style={{ animationDelay: `${i * 90}ms` }}
          x={(i % 3) * 74}
          y={Math.floor(i / 3) * 74}
          width="68"
          height="68"
          rx="4"
          fill={fills[i]}
          fillOpacity={i === 4 ? 1 : 0.55}
        />
      ))}
      <g transform="translate(108 108)" className="sv-heart">
        <path d="M0 12C-16 2-10-12 0-5c10-7 16 7 0 17Z" fill="#070908" />
      </g>
      <g transform="translate(236 34)">
        <rect x="-4" y="-18" width="84" height="30" rx="15" fill="#070908" stroke="#5bd17b" strokeOpacity="0.6" />
        <path d="M10 -3c-5-3-3-8 0-5 3-3 5 2 0 5Z" fill="#ff7a9c" transform="scale(1.6) translate(-1 1)" />
        <text x="30" y="2" fill="#f3f4ef" fontSize="11" fontWeight="600">+ saves</text>
      </g>
    </g>
  );
}

function Ads() {
  return (
    <g>
      <g transform="translate(130 130)">
        {[92, 70, 48, 26].map((r, i) => (
          <circle key={r} r={r} fill="none" stroke="#5bd17b" strokeOpacity={0.15 + i * 0.18} strokeWidth={i === 3 ? 2 : 1} />
        ))}
        <circle r="8" fill="#5bd17b" />
        <circle className="sv-ripple" r="8" fill="none" stroke="#5bd17b" strokeWidth="2" />
        <path d="M18 14 l0 30 l8 -8 l10 16 l6 -3 l-10 -16 l12 -2 Z" fill="#f3f4ef" stroke="#070908" strokeWidth="2" />
      </g>
      <g transform="translate(262 206)">
        {[28, 44, 38, 62, 76, 96].map((h, i) => (
          <rect
            key={i}
            className="sv-grow"
            style={{ animationDelay: `${i * 110}ms` }}
            x={i * 20}
            y={-h}
            width="12"
            height={h}
            rx="2"
            fill={i === 5 ? "#5bd17b" : "#f3f4ef"}
            fillOpacity={i === 5 ? 1 : 0.18}
          />
        ))}
        <path d="M0 -40 L20 -52 L40 -48 L60 -72 L80 -84 L108 -110" fill="none" stroke="#5bd17b" strokeWidth="2" className="sv-draw" pathLength={1} />
      </g>
    </g>
  );
}

function Gbp() {
  return (
    <g>
      <g stroke="#f3f4ef" strokeOpacity="0.12" strokeWidth="10" fill="none">
        <path d="M0 170 C80 150 140 190 220 160 S340 120 400 140" />
        <path d="M150 0 C160 80 120 150 170 260" />
        <path d="M290 0 L270 260" strokeWidth="6" />
      </g>
      <g transform="translate(206 120)">
        <ellipse className="sv-ripple-ground" rx="46" ry="14" fill="none" stroke="#5bd17b" strokeWidth="2" />
        <g className="sv-drop">
          <path d="M0 0 C-4 -10 -22 -24 -22 -44 a22 22 0 0 1 44 0 C22 -24 4 -10 0 0Z" fill="#5bd17b" />
          <circle cy="-44" r="8" fill="#070908" />
        </g>
      </g>
      <g transform="translate(40 30)">
        <rect width="136" height="64" rx="6" fill="#0f1511" stroke="#5bd17b" strokeOpacity="0.35" />
        <rect x="12" y="12" width="70" height="8" rx="2" fill="#f3f4ef" fillOpacity="0.85" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="sv-pop"
            style={{ animationDelay: `${300 + i * 120}ms` }}
            transform={`translate(${18 + i * 16} 38)`}
            d="M0 -6 1.8 -1.9 6.3 -1.9 2.6 0.9 4 5.3 0 2.6 -4 5.3 -2.6 0.9 -6.3 -1.9 -1.8 -1.9Z"
            fill="#f5c451"
          />
        ))}
        <rect x="100" y="33" width="24" height="10" rx="2" fill="#f3f4ef" fillOpacity="0.3" />
      </g>
    </g>
  );
}

function Brand() {
  return (
    <g transform="translate(200 130)" fill="none">
      <g stroke="#f3f4ef" strokeOpacity="0.14">
        <line x1="-180" y1="0" x2="180" y2="0" />
        <line x1="0" y1="-120" x2="0" y2="120" />
        <line x1="-180" y1="-80" x2="180" y2="80" strokeDasharray="3 5" />
      </g>
      <circle className="sv-draw" pathLength={1} r="96" stroke="#5bd17b" strokeOpacity="0.35" />
      <circle className="sv-draw sv-d1" pathLength={1} r="60" stroke="#5bd17b" strokeOpacity="0.5" />
      <circle className="sv-draw sv-d2" pathLength={1} cx="60" cy="-36" r="24" stroke="#f3f4ef" strokeOpacity="0.4" />
      <path className="sv-fade sv-d2" d="M-34 -44 L42 0 L-34 44 Z" fill="#5bd17b" stroke="#5bd17b" strokeLinejoin="round" strokeWidth="8" />
      <path className="sv-fade sv-d3" d="M-14 -16 L14 0 L-14 16Z" fill="#070908" />
      <g className="sv-fade sv-d3" transform="translate(110 70)">
        <rect width="16" height="16" fill="#5bd17b" />
        <rect x="20" width="16" height="16" fill="#0d2a17" stroke="#5bd17b" strokeOpacity="0.5" />
        <rect x="40" width="16" height="16" fill="#f3f4ef" />
        <rect x="60" width="16" height="16" fill="#070908" stroke="#f3f4ef" strokeOpacity="0.3" />
      </g>
      <text className="sv-fade sv-d3" x="-178" y="92" fill="#f3f4ef" fillOpacity="0.8" fontSize="30" fontFamily="var(--font-serif)" fontStyle="italic">
        Aa
      </text>
    </g>
  );
}
