import { cn } from "@/lib/utils";

export type ShapeKind = "triangle" | "square" | "circle" | "star" | "diamond" | "asterisk";

interface ShapeIconProps {
  kind: ShapeKind;
  /** Fill/stroke classes for the shape itself, e.g. "fill-primary" or "stroke-primary". */
  shapeClassName: string;
  className?: string;
  /** Outline only (dashed when `dashed`), used for empty targets and the orientation shapes. */
  outline?: boolean;
  dashed?: boolean;
}

const STAR_POINTS = "50,2 61,36 98,36 68,58 79,94 50,72 21,94 32,58 2,36 39,36";

/** A basic shape that stretches to fill its box (so a triangle can be wide and flat, like a roof). */
export function ShapeIcon({ kind, shapeClassName, className, outline, dashed }: ShapeIconProps) {
  const shapeProps = {
    className: cn(outline && "fill-none", shapeClassName),
    strokeWidth: outline ? 4 : 0,
    strokeDasharray: dashed ? "10 8" : undefined,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    vectorEffect: "non-scaling-stroke" as const,
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={cn("size-full overflow-visible", className)} aria-hidden>
      {kind === "triangle" && <polygon points="50,2 98,98 2,98" {...shapeProps} />}
      {kind === "square" && <rect x={2} y={2} width={96} height={96} {...shapeProps} />}
      {kind === "circle" && <ellipse cx={50} cy={50} rx={48} ry={48} {...shapeProps} />}
      {kind === "star" && <polygon points={STAR_POINTS} {...shapeProps} />}
      {kind === "diamond" && <polygon points="50,2 98,50 50,98 2,50" {...shapeProps} />}
      {kind === "asterisk" && (
        <g {...shapeProps} strokeWidth={4} className={cn("fill-none", shapeClassName)}>
          <line x1={50} y1={2} x2={50} y2={98} />
          <line x1={8} y1={26} x2={92} y2={74} />
          <line x1={8} y1={74} x2={92} y2={26} />
        </g>
      )}
    </svg>
  );
}
