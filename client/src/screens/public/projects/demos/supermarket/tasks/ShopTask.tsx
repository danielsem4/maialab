import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { TaskLayout } from "../../components/TaskLayout";
import { LATE_REQUEST, PRODUCTS_BY_ID } from "../catalog";
import { ProductGrid } from "../components/ProductGrid";
import { ShopDialog } from "../components/ShopDialog";
import { ShoppingPanel } from "../components/ShoppingPanel";
import { useShop } from "../hooks/useShop";

const K = "demos.supermarket.tasks.shop";

export function ShopTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const shop = useShop(onComplete);
  const requestItem = t(PRODUCTS_BY_ID[LATE_REQUEST].nameKey).toLocaleLowerCase();

  return (
    <TaskLayout instruction={t(`${K}.instruction`)}>
      <div className="flex size-full gap-6 px-6 pb-6">
        <ProductGrid category={shop.category} cart={shop.cart} onCategory={shop.setCategory} onToggle={shop.toggle} />
        <ShoppingPanel
          entries={shop.entries}
          total={shop.total}
          budget={shop.budget}
          overBudget={shop.overBudget}
          onCheckout={shop.checkout}
        />
      </div>
      {shop.requestOpen && (
        <ShopDialog
          icon="📱"
          title={t(`${K}.requestTitle`)}
          text={t(`${K}.requestText`, { item: requestItem })}
          buttonLabel={t(`${K}.requestOk`)}
          onClose={shop.closeRequest}
        />
      )}
      {shop.adOpen && (
        <ShopDialog
          icon="🍫"
          title={t(`${K}.adTitle`)}
          text={t(`${K}.adText`)}
          buttonLabel={t(`${K}.adClose`)}
          onClose={shop.closeAd}
        />
      )}
    </TaskLayout>
  );
}
