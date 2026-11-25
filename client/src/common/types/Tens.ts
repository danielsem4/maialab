export type BodySide = "front" | "back";

/** A tappable dot on the body figure and the finer areas it offers. Ids double as i18n key suffixes. */
export interface IBodyRegion {
  id: string;
  side: BodySide;
  /** Position in the figure's viewBox units. */
  x: number;
  y: number;
  areas: string[];
}

/** Chosen area ids by region id. */
export type BodySelection = Record<string, string[]>;
