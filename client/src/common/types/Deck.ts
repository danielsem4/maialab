export interface IDeckTheme {
  colors: Record<string, string>;
  fontHeading: string;
  fontBody: string;
}

export interface IDeckElement<P = Record<string, unknown>> {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  props: P;
}

export interface ISlide {
  id: string;
  background?: string;
  transition: "none" | "fade" | "slide";
  /** Array order is layer order: the last element is on top. */
  elements: IDeckElement[];
}

export interface IDeckDoc {
  version: 1;
  theme: IDeckTheme;
  slides: ISlide[];
}

export interface IDeckSummary {
  id: number;
  title: string;
  isTemplate: boolean;
  slideCount: number;
  updatedAt: string;
}

export interface IDeck extends IDeckSummary {
  doc: IDeckDoc;
}

export interface ITextProps {
  /** Tiptap JSON document. */
  content: unknown;
  dir: "auto" | "ltr" | "rtl";
  verticalAlign: "top" | "middle" | "bottom";
  fontSize: number;
}

export interface IImageProps {
  mediaId: number;
  url: string;
  alt: string;
  fit: "cover" | "contain";
  radius: number;
}

export interface IShapeProps {
  shape: "rect" | "ellipse" | "line";
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
}
