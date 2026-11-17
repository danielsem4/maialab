import { describe, expect, it } from "vitest";
import type { IProduct } from "@/common/types/Supermarket";
import { buildBelt, cartTotal, formatPrice, isConveyorPassed, isWithinBudget, matchesShoppingList } from "./supermarketUtils";

function p(id: string, price: number, category: IProduct["category"]): IProduct {
  return { id, emoji: "", nameKey: id, price, category };
}

const PRODUCTS: Record<string, IProduct> = {
  bread: p("bread", 8, "bakery"),
  pita: p("pita", 5, "bakery"),
  milk: p("milk", 6, "dairy"),
  cheese: p("cheese", 22, "dairy"),
  yogurt: p("yogurt", 5, "dairy"),
  tomato: p("tomato", 7, "vegetables"),
};

describe("formatPrice", () => {
  it("formats shekels without trailing zeros for whole amounts", () => {
    expect(formatPrice(8, "en")).toBe("₪8");
  });

  it("keeps agorot when present", () => {
    expect(formatPrice(7.5, "en")).toBe("₪7.50");
  });

  it("uses the shekel sign in other languages", () => {
    const he = formatPrice(12, "he");
    expect(he).toContain("₪");
    expect(he).toContain("12");
  });
});

describe("cartTotal", () => {
  it("sums product prices", () => {
    expect(cartTotal(["bread", "milk", "tomato"], PRODUCTS)).toBe(21);
  });

  it("is 0 for an empty cart and ignores unknown ids", () => {
    expect(cartTotal([], PRODUCTS)).toBe(0);
    expect(cartTotal(["unknown", "pita"], PRODUCTS)).toBe(5);
  });
});

describe("isWithinBudget", () => {
  it("allows spending exactly the budget", () => {
    expect(isWithinBudget(40, 40)).toBe(true);
    expect(isWithinBudget(41, 40)).toBe(false);
  });
});

describe("matchesShoppingList", () => {
  const list = ["bread", "cheese", "tomato"];
  const oos = ["cheese"];

  it("accepts the list with a same-category replacement", () => {
    expect(matchesShoppingList(["tomato", "yogurt", "bread"], list, oos, PRODUCTS)).toBe(true);
  });

  it("rejects a missing item", () => {
    expect(matchesShoppingList(["yogurt", "bread"], list, oos, PRODUCTS)).toBe(false);
  });

  it("rejects a replacement from another category", () => {
    expect(matchesShoppingList(["tomato", "pita", "bread"], list, oos, PRODUCTS)).toBe(false);
  });

  it("rejects extra items", () => {
    expect(matchesShoppingList(["tomato", "yogurt", "bread", "milk"], list, oos, PRODUCTS)).toBe(false);
  });

  it("rejects the out-of-stock item itself", () => {
    expect(matchesShoppingList(["tomato", "cheese", "bread"], list, oos, PRODUCTS)).toBe(false);
  });

  it("works with nothing out of stock", () => {
    expect(matchesShoppingList(["milk"], ["milk"], [], PRODUCTS)).toBe(true);
  });
});

describe("buildBelt", () => {
  it("alternates wanted items and distractors, skipping distractors that are wanted", () => {
    expect(buildBelt(["a", "b"], ["x", "a", "y", "z"])).toEqual(["a", "x", "b", "y", "z"]);
  });
});

describe("isConveyorPassed", () => {
  it("needs every ingredient and at most one wrong tap", () => {
    expect(isConveyorPassed(["a", "b"], ["a", "b"], 1)).toBe(true);
    expect(isConveyorPassed(["a", "b"], ["a", "b"], 2)).toBe(false);
    expect(isConveyorPassed(["a"], ["a", "b"], 0)).toBe(false);
  });
});
