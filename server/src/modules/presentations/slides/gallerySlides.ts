import type PptxGenJS from 'pptxgenjs';
import { addContainedImage, type Box } from './images';
import { LABELS } from './labels';
import { pagedTitle, textDir } from './text';
import { addHeading, COLORS, CONTENT_BOTTOM, CONTENT_TOP, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckImage } from './types';

const MAX_PER_SLIDE = 4;
const GAP = 0.3;
const CAPTION_H = 0.45;

/** Splits images evenly so no slide is left with a lone image (5 → 3+2, 9 → 3+3+3). */
export function groupImages(images: DeckImage[]): DeckImage[][] {
  if (images.length === 0) return [];
  const pages = Math.ceil(images.length / MAX_PER_SLIDE);
  const base = Math.floor(images.length / pages);
  const extra = images.length % pages;
  const groups: DeckImage[][] = [];
  let start = 0;
  for (let i = 0; i < pages; i++) {
    const size = base + (i < extra ? 1 : 0);
    groups.push(images.slice(start, start + size));
    start += size;
  }
  return groups;
}

/** Cells for 1–4 images: a row for up to three, a 2x2 grid for four. */
function gridCells(count: number): Box[] {
  const areaW = SLIDE.w - SLIDE.margin * 2;
  const areaH = CONTENT_BOTTOM - CONTENT_TOP;
  const cols = count === 4 ? 2 : count;
  const rows = count === 4 ? 2 : 1;
  const w = (areaW - GAP * (cols - 1)) / cols;
  const h = (areaH - GAP * (rows - 1)) / rows;
  return Array.from({ length: count }, (_, i) => ({
    x: SLIDE.margin + (i % cols) * (w + GAP),
    y: CONTENT_TOP + Math.floor(i / cols) * (h + GAP),
    w,
    h,
  }));
}

function addCell(slide: PptxGenJS.Slide, image: DeckImage, cell: Box): void {
  const imageBox = image.caption ? { ...cell, h: cell.h - CAPTION_H } : cell;
  addContainedImage(slide, image, imageBox);
  if (!image.caption) return;
  slide.addText(image.caption, {
    x: cell.x,
    y: cell.y + cell.h - CAPTION_H + 0.05,
    w: cell.w,
    h: CAPTION_H - 0.05,
    fontFace: FONTS.body,
    fontSize: 12,
    color: COLORS.muted,
    valign: 'top',
    fit: 'shrink',
    ...textDir(image.caption),
    align: textDir(image.caption).rtlMode ? 'right' : 'center',
  });
}

/** One or more slides showing the project's images with their captions. */
export function addGallerySlides(pptx: PptxGenJS, title: string, images: DeckImage[]): void {
  const groups = groupImages(images);
  groups.forEach((group, index) => {
    const slide = pptx.addSlide({ masterName: MASTERS.content });
    addHeading(slide, pagedTitle(`${title}: ${LABELS.gallery}`, index, groups.length));
    gridCells(group.length).forEach((cell, i) => addCell(slide, group[i]!, cell));
  });
}
