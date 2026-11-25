import type { BodySide } from "@/common/types/Tens";
import { BODY_HEIGHT, BODY_WIDTH } from "../tensData";

/** The viewer-left half of the outline, neck to crotch; the other half is its mirror image. */
const HALF_OUTLINE =
  "M92 54 L92 64 C88 72 70 74 60 80 C50 84 46 96 46 110 C45 130 42 145 40 160 C38 178 34 195 32 210 " +
  "C28 220 28 236 36 240 C44 240 46 228 46 214 C50 198 54 180 56 164 C58 146 62 128 66 112 " +
  "C66 135 70 155 70 175 C68 190 62 205 62 225 C62 260 66 290 68 312 C66 330 66 350 70 372 " +
  "C72 390 74 400 74 410 C70 418 60 426 62 432 L90 432 C92 424 88 414 88 406 " +
  "C90 380 92 350 90 318 C92 290 96 255 100 228";

/** Inner detail lines of one half, per side. */
const HALF_DETAILS: Record<BodySide, string> = {
  front: "M70 122 Q86 132 100 122 M92 70 Q96 75 100 75 M76 196 Q84 212 96 220 M72 306 Q78 300 84 306",
  back: "M76 100 Q80 122 92 124 M74 226 Q88 238 100 226 M72 312 Q78 316 84 312 M60 158 Q54 162 50 158",
};

const MIRROR = `translate(${BODY_WIDTH} 0) scale(-1 1)`;

interface BodyFigureProps {
  side: BodySide;
}

/** A line drawing of the body, front or back, in the current text colour. */
export function BodyFigure({ side }: BodyFigureProps) {
  return (
    <svg
      viewBox={`0 0 ${BODY_WIDTH} ${BODY_HEIGHT}`}
      className="size-full"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <ellipse cx={100} cy={32} rx={19} ry={24} />
      <path d={HALF_OUTLINE} />
      <path d={HALF_OUTLINE} transform={MIRROR} />
      <g strokeWidth={1.5} opacity={0.7}>
        <path d={HALF_DETAILS[side]} />
        <path d={HALF_DETAILS[side]} transform={MIRROR} />
        {side === "back" && <path d="M100 72 L100 204" />}
        {side === "front" && <path d="M100 172 L100 176" />}
      </g>
    </svg>
  );
}
