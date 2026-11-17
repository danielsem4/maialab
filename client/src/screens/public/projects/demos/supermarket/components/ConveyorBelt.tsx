import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChoiceButton } from "../../components/ChoiceButton";
import { PRODUCTS_BY_ID } from "../catalog";

interface ConveyorBeltProps {
  belt: string[];
  loopMs: number;
  collected: string[];
  wrong: string[];
  onTap: (id: string) => void;
}

/** A belt that scrolls its products endlessly (rendered twice so the loop is seamless). */
export function ConveyorBelt({ belt, loopMs, collected, wrong, onTap }: ConveyorBeltProps) {
  const { t } = useTranslation();
  const items = [...belt, ...belt];
  const style = { "--conveyor-duration": `${loopMs}ms` } as CSSProperties;

  return (
    <div dir="ltr" className="relative overflow-hidden border-y-8 border-border bg-muted py-6">
      <div className="demo-conveyor flex w-max" style={style}>
        {items.map((id, i) => {
          const product = PRODUCTS_BY_ID[id];
          const isCollected = collected.includes(id);
          return (
            <div key={`${i}-${id}`} className="flex w-40 shrink-0 justify-center">
              <ChoiceButton
                value={id}
                onSelect={onTap}
                aria-label={t(product.nameKey)}
                className={cn(
                  "relative flex size-28 items-center justify-center text-6xl",
                  isCollected && "opacity-40",
                  wrong.includes(id) && "border-destructive",
                )}
              >
                <span aria-hidden>{product.emoji}</span>
                {isCollected && (
                  <Check className="absolute -top-2 -end-2 size-8 rounded-full bg-primary p-1 text-primary-foreground" />
                )}
              </ChoiceButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
