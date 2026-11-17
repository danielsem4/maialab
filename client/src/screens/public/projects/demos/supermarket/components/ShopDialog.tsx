import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ShopDialogProps {
  title: string;
  text: string;
  icon: ReactNode;
  buttonLabel: string;
  onClose: () => void;
}

/** A modal card over the shop — used for the pop-up ad and the last-minute message. */
export function ShopDialog({ title, text, icon, buttonLabel, onClose }: ShopDialogProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex w-96 flex-col items-center gap-4 rounded-2xl border-2 bg-background p-8 text-center shadow-xl">
        <span className="text-6xl" aria-hidden>
          {icon}
        </span>
        <h3 className="font-display text-2xl font-bold">{title}</h3>
        <p className="text-xl">{text}</p>
        <Button size="lg" className="h-14 w-full text-xl" onClick={onClose}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
