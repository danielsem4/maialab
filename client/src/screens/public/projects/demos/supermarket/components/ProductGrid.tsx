import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import type { ProductCategory } from "@/common/types/Supermarket";
import { ChoiceButton } from "../../components/ChoiceButton";
import { CATEGORIES, OUT_OF_STOCK, PRODUCTS } from "../catalog";
import { useFormatPrice } from "../hooks/useFormatPrice";

interface ProductGridProps {
  category: ProductCategory;
  cart: string[];
  onCategory: (category: ProductCategory) => void;
  onToggle: (id: string) => void;
}

/** Category tabs and the products of the selected category; tapping a product adds or removes it. */
export function ProductGrid({ category, cart, onCategory, onToggle }: ProductGridProps) {
  const { t } = useTranslation();
  const format = useFormatPrice();
  const products = PRODUCTS.filter((product) => product.category === category);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="flex gap-2" role="tablist">
        {CATEGORIES.map((c) => (
          <ChoiceButton
            key={c}
            value={c}
            onSelect={onCategory}
            aria-pressed={c === category}
            className="h-14 flex-1 px-2 text-lg"
          >
            {t(`demos.supermarket.categories.${c}`)}
          </ChoiceButton>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => {
          const outOfStock = OUT_OF_STOCK.includes(product.id);
          const inCart = cart.includes(product.id);
          return (
            <ChoiceButton
              key={product.id}
              value={product.id}
              onSelect={onToggle}
              disabled={outOfStock}
              aria-pressed={inCart}
              className="relative flex h-40 flex-col items-center justify-center gap-1 p-2"
            >
              <span className="text-5xl" aria-hidden>
                {product.emoji}
              </span>
              <span className="text-lg">{t(product.nameKey)}</span>
              <span className="text-base font-semibold text-muted-foreground">
                {outOfStock ? t("demos.supermarket.tasks.shop.outOfStock") : format(product.price)}
              </span>
              {inCart && <Check className="absolute top-2 end-2 size-7 rounded-full bg-primary p-1 text-primary-foreground" />}
            </ChoiceButton>
          );
        })}
      </div>
    </div>
  );
}
