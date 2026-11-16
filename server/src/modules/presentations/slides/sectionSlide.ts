import type PptxGenJS from 'pptxgenjs';
import { textDir } from './text';
import { COLORS, FONTS, MASTERS, SLIDE } from './theme';

/** A divider slide between the parts of a deck. */
export function addSectionSlide(pptx: PptxGenJS, title: string, subtitle = ''): void {
  const slide = pptx.addSlide({ masterName: MASTERS.section });
  const x = SLIDE.margin + 0.4;
  const w = SLIDE.w - x - SLIDE.margin;

  slide.addText(title, {
    x,
    y: 2.9,
    w,
    h: 1.0,
    fontFace: FONTS.heading,
    fontSize: 40,
    bold: true,
    color: COLORS.white,
    valign: 'middle',
    fit: 'shrink',
    ...textDir(title),
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x,
      y: 3.9,
      w,
      h: 0.7,
      fontFace: FONTS.body,
      fontSize: 18,
      color: 'D5D7F0',
      valign: 'top',
      fit: 'shrink',
      ...textDir(subtitle),
    });
  }
}
