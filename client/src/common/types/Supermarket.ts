export type ProductCategory = "vegetables" | "fruit" | "dairy" | "bakery" | "pantry";

/** A product in the demo supermarket. `nameKey` is an i18n key; `price` is in shekels. */
export interface IProduct {
  id: string;
  emoji: string;
  nameKey: string;
  price: number;
  category: ProductCategory;
}

export interface IRecipe {
  id: string;
  emoji: string;
  nameKey: string;
  /** Product ids of the ingredients. */
  ingredients: string[];
}
