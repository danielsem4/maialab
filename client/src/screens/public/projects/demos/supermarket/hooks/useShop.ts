import { useEffect, useState } from "react";
import type { ProductCategory } from "@/common/types/Supermarket";
import { cartTotal, isWithinBudget, matchesShoppingList } from "@/common/utils/supermarketUtils";
import { BUDGET, CATEGORIES, LATE_REQUEST, OUT_OF_STOCK, PRODUCTS_BY_ID, SHOPPING_LIST } from "../catalog";

const AD_AFTER_MS = 3000;
/** The last-minute request arrives once this many products are in the cart. */
const REQUEST_AT_CART_SIZE = 2;

export interface IListEntry {
  id: string;
  done: boolean;
  outOfStock: boolean;
  isNew: boolean;
}

/** Shopping task: cart, category tabs, a pop-up ad, a last-minute request and the checkout check. */
export function useShop(onComplete: (passed: boolean) => void) {
  const [cart, setCart] = useState<string[]>([]);
  const [category, setCategory] = useState<ProductCategory>(CATEGORIES[0]);
  const [adOpen, setAdOpen] = useState(false);
  const [requestShown, setRequestShown] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const list = requestShown ? [...SHOPPING_LIST, LATE_REQUEST] : SHOPPING_LIST;
  const total = cartTotal(cart, PRODUCTS_BY_ID);

  useEffect(() => {
    const timer = setTimeout(() => setAdOpen(true), AD_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  function isDone(id: string) {
    if (!OUT_OF_STOCK.includes(id)) return cart.includes(id);
    const { category: wanted } = PRODUCTS_BY_ID[id];
    return cart.some((other) => !list.includes(other) && PRODUCTS_BY_ID[other].category === wanted);
  }

  const entries: IListEntry[] = list.map((id) => ({
    id,
    done: isDone(id),
    outOfStock: OUT_OF_STOCK.includes(id),
    isNew: id === LATE_REQUEST && requestShown,
  }));

  function toggle(id: string) {
    if (OUT_OF_STOCK.includes(id)) return;
    if (cart.includes(id)) {
      setCart(cart.filter((item) => item !== id));
      return;
    }
    const next = [...cart, id];
    setCart(next);
    if (!requestShown && next.length >= REQUEST_AT_CART_SIZE) {
      setRequestShown(true);
      setRequestOpen(true);
    }
  }

  function closeAd() {
    setAdOpen(false);
  }

  function closeRequest() {
    setRequestOpen(false);
  }

  function checkout() {
    onComplete(matchesShoppingList(cart, list, OUT_OF_STOCK, PRODUCTS_BY_ID) && isWithinBudget(total, BUDGET));
  }

  return {
    cart,
    category,
    setCategory,
    entries,
    total,
    budget: BUDGET,
    overBudget: !isWithinBudget(total, BUDGET),
    adOpen,
    requestOpen,
    toggle,
    closeAd,
    closeRequest,
    checkout,
  };
}
