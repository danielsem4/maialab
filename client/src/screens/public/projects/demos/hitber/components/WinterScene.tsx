const SNOWFLAKES = [
  [40, 40], [110, 80], [180, 30], [250, 70], [330, 35], [420, 60], [460, 120], [70, 140], [300, 120], [380, 150],
];
const BRANCHES = ["M95 150 L60 110", "M95 165 L130 120", "M95 130 L75 95", "M95 135 L118 98", "M60 110 L48 90", "M130 120 L145 102"];

/** A simple snowy scene: bare tree, snowy house, snowman and falling snow. */
export function WinterScene({ label }: { label: string }) {
  return (
    <svg viewBox="0 0 480 300" className="h-full w-auto rounded-2xl border-2 shadow-sm" role="img" aria-label={label}>
      <rect width={480} height={300} className="fill-sky-100 dark:fill-sky-950" />
      <path d="M0 220 Q120 195 240 215 T480 210 V300 H0 Z" className="fill-white dark:fill-slate-200" />
      {/* Bare tree */}
      <path d="M95 225 L95 120" className="stroke-amber-900" strokeWidth={10} strokeLinecap="round" />
      {BRANCHES.map((d) => (
        <path key={d} d={d} className="fill-none stroke-amber-900" strokeWidth={5} strokeLinecap="round" />
      ))}
      {/* House with a snowy roof */}
      <rect x={190} y={140} width={110} height={85} className="fill-orange-300" />
      <rect x={232} y={180} width={26} height={45} className="fill-amber-800" />
      <rect x={203} y={158} width={22} height={22} className="fill-sky-300" />
      <rect x={265} y={158} width={22} height={22} className="fill-sky-300" />
      <polygon points="180,145 245,95 310,145" className="fill-red-700" />
      <path d="M180 145 L245 95 L310 145 L300 150 L245 110 L190 150 Z" className="fill-white" />
      {/* Snowman */}
      <circle cx={390} cy={215} r={38} className="fill-white stroke-slate-300" strokeWidth={2} />
      <circle cx={390} cy={157} r={27} className="fill-white stroke-slate-300" strokeWidth={2} />
      <circle cx={381} cy={152} r={3} className="fill-slate-800" />
      <circle cx={399} cy={152} r={3} className="fill-slate-800" />
      <polygon points="390,159 410,163 390,165" className="fill-orange-500" />
      <rect x={370} y={118} width={40} height={14} className="fill-slate-800" />
      <rect x={378} y={98} width={24} height={22} className="fill-slate-800" />
      <path d="M362 170 Q390 182 418 170" className="fill-none stroke-red-500" strokeWidth={6} strokeLinecap="round" />
      {SNOWFLAKES.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={5} className="fill-white stroke-sky-200" strokeWidth={1} />
      ))}
    </svg>
  );
}
