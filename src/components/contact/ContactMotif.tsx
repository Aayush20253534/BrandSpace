/**
 * Quiet "communication network" for the contact hero: nodes, links and a few
 * signals travelling toward the green hub. Pure SVG + CSS; decorative.
 */
const NODES: [number, number][] = [
  [40, 70], [150, 34], [262, 92], [214, 196], [92, 176],
  [334, 214], [388, 76], [300, 306], [158, 290], [428, 172],
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 6], [3, 5], [5, 7], [7, 8], [8, 4], [6, 9], [9, 5], [1, 3],
];
/** Links that carry a travelling signal (all point toward the hub, node 3). */
const SIGNALS: [number, number, number][] = [
  [0, 3, 0], [6, 3, 1.1], [7, 3, 2.3], [9, 3, 0.6], [8, 3, 1.7],
];
const HUB = 3;

export function ContactMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 470 340" className={className} aria-hidden fill="none">
      <g stroke="#f3f4ef" strokeOpacity="0.1">
        {LINKS.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a]![0]} y1={NODES[a]![1]} x2={NODES[b]![0]} y2={NODES[b]![1]} />
        ))}
      </g>
      <g stroke="#5bd17b" strokeWidth="1.6" strokeLinecap="round">
        {SIGNALS.map(([a, b, delay]) => (
          <line
            key={`s-${a}`}
            x1={NODES[a]![0]}
            y1={NODES[a]![1]}
            x2={NODES[b]![0]}
            y2={NODES[b]![1]}
            pathLength={100}
            strokeDasharray="10 100"
            className="cm-signal"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </g>
      {NODES.map(([x, y], i) =>
        i === HUB ? (
          <g key={i}>
            <circle cx={x} cy={y} r="16" stroke="#5bd17b" strokeOpacity="0.45" className="cm-ring" />
            <circle cx={x} cy={y} r="7" fill="#5bd17b" />
          </g>
        ) : (
          <circle key={i} cx={x} cy={y} r="3.2" fill="#f3f4ef" fillOpacity="0.35" />
        ),
      )}
    </svg>
  );
}
