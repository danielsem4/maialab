import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCTS_BY_ID } from "../catalog";
import type { IListEntry } from "../hooks/useShop";
import { useFormatPrice } from "../hooks/useFormatPrice";

interface ShoppingPanelProps {
  entries: IListEntry[];
  total: number;
  budget: number;
  overBudget: boolean;
  onCheckout: () => void;
}

const K = "demos.supermarket.tasks.shop";

/** Side panel: the shopping list with ticks, the budget, the running total and the checkout button. */
export function ShoppingPanel({ entries, total, budget, overBudget, onCheckout }: ShoppingPanelProps) {
  const { t } = useTranslation();
  const format = useFormatPrice();

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-3 rounded-2xl border-2 bg-card p-4">
      <h3 className="font-display text-xl font-bold">{t(`${K}.list`)}</h3>
      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className={cn("flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-1.5 text-lg", entry.isNew && "ring-2 ring-primary")}
          >
            <span aria-hidden>{PRODUCTS_BY_ID[entry.id].emoji}</span>
            <span className="min-w-0 flex-1">
              <span className={cn(entry.outOfStock && "line-through opacity-60")}>{t(PRODUCTS_BY_ID[entry.id].nameKey)}</span>
              {entry.outOfStock && <span className="block text-sm text-destructive">{t(`${K}.replace`)}</span>}
              {entry.isNew && <span className="block text-sm text-primary">{t(`${K}.newItem`)}</span>}
            </span>
            {entry.done && <Check className="size-6 shrink-0 text-primary" aria-label={t(`${K}.inCart`)} />}
          </li>
        ))}
      </ul>
      <dl className="space-y-1 border-t pt-3 text-lg">
        <div className="flex justify-between">
          <dt>{t(`${K}.budget`)}</dt>
          <dd className="font-semibold">{format(budget)}</dd>
        </div>
        <div className={cn("flex justify-between", overBudget && "text-destructive")}>
          <dt>{t(`${K}.total`)}</dt>
          <dd className="font-semibold">{format(total)}</dd>
        </div>
        {overBudget && <p className="text-sm text-destructive">{t(`${K}.overBudget`)}</p>}
      </dl>
      <Button size="lg" className="h-14 text-xl" onClick={onCheckout}>
        {t(`${K}.checkout`)}
      </Button>
    </aside>
  );
}
