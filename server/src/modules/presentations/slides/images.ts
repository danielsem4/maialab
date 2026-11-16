import type PptxGenJS from 'pptxgenjs';
import type { DeckImage } from './types';

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Largest box with the image's aspect ratio that fits inside `box`, centered. */
export function containBox(image: DeckImage, box: Box): Box {
  const ratio = image.width / image.height;
  const w = Math.min(box.w, box.h * ratio);
  const h = w / ratio;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

/** Places the image inside `box`, letterboxed so nothing is cropped. */
export function addContainedImage(slide: PptxGenJS.Slide, image: DeckImage, box: Box): void {
  slide.addImage({ path: image.path, altText: image.alt, ...containBox(image, box) });
}

/**
 * Fills `box` with the image, cropping the overflow.
 * pptxgenjs derives the crop from the ratio of w/h, so w/h carry the real aspect ratio.
 */
export function addCoverImage(slide: PptxGenJS.Slide, image: DeckImage, box: Box, rounding = false): void {
  slide.addImage({
    path: image.path,
    altText: image.alt,
    x: box.x,
    y: box.y,
    w: box.w,
    h: (box.w * image.height) / image.width,
    sizing: { type: 'cover', w: box.w, h: box.h },
    rounding,
  });
}
