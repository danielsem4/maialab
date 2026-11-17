import type { IProduct } from "@/common/types/Supermarket";

/** Formats a shekel amount in the given language, e.g. "₪8" or "₪7.50". */
export function formatPrice(amount: number, language: string): string {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Sums the prices of the products in the cart (unknown ids count as 0). */
export function cartTotal(cart: string[], products: Record<string, IProduct>): number {
  return cart.reduce((sum, id) => sum + (products[id]?.price ?? 0), 0);
}

export function isWithinBudget(total: number, budget: number): boolean {
  return total <= budget;
}

/**
 * Checks the cart against a shopping list: every in-stock list item must be there, each out-of-stock
 * item must be replaced by exactly one other product of the same category, and nothing else is allowed.
 */
export function matchesShoppingList(
  cart: string[],
  list: string[],
  outOfStock: string[],
  products: Record<string, IProduct>,
): boolean {
  const remaining = new Set(cart);
  if (cart.some((id) => outOfStock.includes(id))) return false;
  for (const id of list) {
    if (outOfStock.includes(id)) continue;
    if (!remaining.delete(id)) return false;
  }
  for (const id of list.filter((item) => outOfStock.includes(item))) {
    const category = products[id]?.category;
    const replacement = [...remaining].find((other) => products[other]?.category === category);
    if (!replacement) return false;
    remaining.delete(replacement);
  }
  return remaining.size === 0;
}

/** Interleaves the wanted items with distractors so they alternate on the belt. */
export function buildBelt(wanted: string[], distractors: string[]): string[] {
  const others = distractors.filter((id) => !wanted.includes(id));
  const length = Math.max(wanted.length, others.length);
  const belt: string[] = [];
  for (let i = 0; i < length; i++) {
    if (i < wanted.length) belt.push(wanted[i]);
    if (i < others.length) belt.push(others[i]);
  }
  return belt;
}

/** The conveyor task is passed when every ingredient was collected with at most `maxWrong` wrong taps. */
export function isConveyorPassed(collected: string[], ingredients: string[], wrongTaps: number, maxWrong = 1): boolean {
  return ingredients.every((id) => collected.includes(id)) && wrongTaps <= maxWrong;
}
