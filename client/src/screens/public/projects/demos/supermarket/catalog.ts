import type { IProduct, IRecipe, ProductCategory } from "@/common/types/Supermarket";

const P = "demos.supermarket.products";

function product(id: string, emoji: string, price: number, category: ProductCategory): IProduct {
  return { id, emoji, nameKey: `${P}.${id}`, price, category };
}

export const CATEGORIES: ProductCategory[] = ["vegetables", "fruit", "dairy", "bakery", "pantry"];

export const PRODUCTS: IProduct[] = [
  product("tomato", "🍅", 7, "vegetables"),
  product("cucumber", "🥒", 5, "vegetables"),
  product("pepper", "🫑", 6, "vegetables"),
  product("onion", "🧅", 4, "vegetables"),
  product("carrot", "🥕", 4, "vegetables"),
  product("banana", "🍌", 9, "fruit"),
  product("apple", "🍎", 8, "fruit"),
  product("grapes", "🍇", 14, "fruit"),
  product("lemon", "🍋", 3, "fruit"),
  product("milk", "🥛", 6, "dairy"),
  product("cheese", "🧀", 22, "dairy"),
  product("eggs", "🥚", 12, "dairy"),
  product("butter", "🧈", 12, "dairy"),
  product("yogurt", "🥣", 5, "dairy"),
  product("bread", "🍞", 8, "bakery"),
  product("baguette", "🥖", 10, "bakery"),
  product("croissant", "🥐", 7, "bakery"),
  product("pita", "🫓", 5, "bakery"),
  product("flour", "🌾", 6, "pantry"),
  product("rice", "🍚", 9, "pantry"),
  product("pasta", "🍝", 8, "pantry"),
  product("chocolate", "🍫", 9, "pantry"),
  product("fish", "🐟", 30, "pantry"),
];

export const PRODUCTS_BY_ID: Record<string, IProduct> = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

export const RECIPES: IRecipe[] = [
  { id: "salad", emoji: "🥗", nameKey: "demos.supermarket.recipes.salad", ingredients: ["tomato", "cucumber", "pepper", "onion"] },
  { id: "omelette", emoji: "🍳", nameKey: "demos.supermarket.recipes.omelette", ingredients: ["eggs", "milk", "cheese", "onion"] },
  { id: "pancakes", emoji: "🥞", nameKey: "demos.supermarket.recipes.pancakes", ingredients: ["flour", "eggs", "milk", "butter"] },
];

/** Products that pass on the conveyor but belong to none of the recipes. */
export const BELT_DISTRACTORS = ["banana", "bread", "carrot", "chocolate", "apple", "fish"];

/** Task 3: the shopping list, the item that is out of stock, the last-minute request and the budget. */
export const SHOPPING_LIST = ["bread", "tomato", "cheese", "banana"];
export const OUT_OF_STOCK = ["cheese"];
export const LATE_REQUEST = "milk";
export const BUDGET = 40;
