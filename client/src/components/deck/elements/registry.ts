import { Image, Square, Type } from "lucide-react";
import type { IDeckElement, IImageProps, IShapeProps, ITextProps } from "@/common/types/Deck";
import type { IMedia } from "@/common/types/Media";
import type { IPoint } from "@/common/utils/geometry";
import i18n from "@/i18n";
import { themeColorVar } from "@/lib/deck/colors";
import { newId } from "@/lib/deck/deckDoc";
import { emptyTextContent } from "@/lib/deck/richText";
import { centeredBox, imageBoxSize } from "@/lib/deck/stageGeometry";
import { ImageInspector } from "./image/ImageInspector";
import { ImageRender } from "./image/ImageRender";
import { ShapeInspector } from "./shape/ShapeInspector";
import { ShapeRender } from "./shape/ShapeRender";
import { TextInspector } from "./text/TextInspector";
import { TextRender } from "./text/TextRender";
import type { IElementDefinition } from "./types";

export const IMAGE_TYPE = "image";
export const TEXT_TYPE = "text";

const text: IElementDefinition<ITextProps> = {
  type: TEXT_TYPE,
  labelKey: "decks.elements.text",
  icon: Type,
  defaultSize: { w: 800, h: 200 },
  createProps: () => ({
    content: emptyTextContent(i18n.t("decks.elements.textPlaceholder")),
    dir: "auto",
    verticalAlign: "top",
    fontSize: 40,
  }),
  Render: TextRender,
  Inspector: TextInspector,
};

const shape: IElementDefinition<IShapeProps> = {
  type: "shape",
  labelKey: "decks.elements.shape",
  icon: Square,
  defaultSize: { w: 400, h: 300 },
  createProps: () => ({ shape: "rect", fill: themeColorVar("accent"), stroke: "transparent", strokeWidth: 0, radius: 0 }),
  Render: ShapeRender,
  Inspector: ShapeInspector,
};

const image: IElementDefinition<IImageProps> = {
  type: IMAGE_TYPE,
  labelKey: "decks.elements.image",
  icon: Image,
  defaultSize: { w: 600, h: 400 },
  // Images are created from a picked media file (createImageElement); this is only the empty shape.
  createProps: () => ({ mediaId: 0, url: "", alt: "", fit: "cover", radius: 0 }),
  Render: ImageRender,
  Inspector: ImageInspector,
  keepRatio: true,
};

export const elementRegistry: Record<string, IElementDefinition> = { text, shape, image };

/** Order of the items in the palette. */
export const paletteOrder: string[] = [TEXT_TYPE, "shape", IMAGE_TYPE];

export function getElementDefinition(type: string): IElementDefinition | null {
  return Object.hasOwn(elementRegistry, type) ? elementRegistry[type] : null;
}

/** A new element of a registered type, centred on `center` (default: the slide centre). */
export function createElementOfType(type: string, center?: IPoint): IDeckElement | null {
  const definition = getElementDefinition(type);
  if (!definition) return null;
  const { w, h } = definition.defaultSize;
  return { id: newId(), type, ...centeredBox(w, h, center), rotation: 0, props: definition.createProps() };
}

export function createImageElement(media: IMedia, center?: IPoint): IDeckElement {
  const { w, h } = imageBoxSize(media.width, media.height);
  const props: IImageProps = { mediaId: media.id, url: media.url, alt: media.alt, fit: "cover", radius: 0 };
  return { id: newId(), type: IMAGE_TYPE, ...centeredBox(w, h, center), rotation: 0, props: { ...props } };
}
