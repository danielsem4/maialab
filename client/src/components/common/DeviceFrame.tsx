import type { ReactNode } from "react";
import type { DeviceType } from "@/common/types/Demo";
import { useFitScale } from "@/hooks/common/useFitScale";
import { cn } from "@/lib/utils";

/** Logical screen size the demo is laid out in (iPad in landscape), and the bezel around it. */
const DEVICES: Record<DeviceType, { width: number; height: number; bezel: number }> = {
  iphone: { width: 390, height: 844, bezel: 14 },
  ipad: { width: 1024, height: 768, bezel: 22 },
};

/** Bezel in compact mode: just enough to still read as a device. */
const COMPACT_BEZEL = 6;

interface DeviceFrameProps {
  device: DeviceType;
  /** Thin bezel and the whole viewport height, for showing the frame full-screen on a small display. */
  compact?: boolean;
  children: ReactNode;
}

/** A CSS iPhone/iPad mockup. The screen keeps its real pixel size and the whole frame scales to fit. */
export function DeviceFrame({ device, compact, children }: DeviceFrameProps) {
  const { width, height } = DEVICES[device];
  const bezel = compact ? COMPACT_BEZEL : DEVICES[device].bezel;
  const frameWidth = width + bezel * 2;
  const frameHeight = height + bezel * 2;
  const { containerRef, scale } = useFitScale<HTMLDivElement>(frameWidth, frameHeight, compact ? 1 : undefined);

  return (
    <div ref={containerRef} className="w-full">
      <div className="mx-auto" style={{ width: frameWidth * scale, height: frameHeight * scale }}>
        <div
          className={cn(
            "relative origin-top-left bg-neutral-900 rtl:origin-top-right shadow-2xl ring-1 ring-neutral-700",
            compact ? "rounded-2xl" : device === "iphone" ? "rounded-[3.5rem]" : "rounded-[2.5rem]",
          )}
          style={{ width: frameWidth, height: frameHeight, padding: bezel, transform: `scale(${scale})` }}
        >
          {device === "ipad" && !compact && (
            <span className="absolute top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-neutral-700" aria-hidden />
          )}
          <div
            data-device={device}
            className={cn(
              "group/device demo-theme relative size-full overflow-hidden bg-background text-foreground",
              compact ? "rounded-xl" : device === "iphone" ? "rounded-[2.75rem]" : "rounded-[1.25rem]",
            )}
          >
            {device === "iphone" && (
              <span className="absolute top-3 left-1/2 z-20 h-8 w-28 -translate-x-1/2 rounded-full bg-black" aria-hidden />
            )}
            {children}
            {device === "iphone" && (
              <span className="absolute bottom-2 left-1/2 z-20 h-1.5 w-32 -translate-x-1/2 rounded-full bg-foreground/40" aria-hidden />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
