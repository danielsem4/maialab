import type PptxGenJS from 'pptxgenjs';
import { addContainedImage } from './images';
import { textDir } from './text';
import { COLORS, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckImage } from './types';

export interface TitleSlideInput {
  title: string;
  subtitle: string;
  logo: DeckImage | null;
  date: Date;
}

const TEXT_W = SLIDE.w - SLIDE.margin * 2;

export function formatDeckDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function addTitleSlide(pptx: PptxGenJS, input: TitleSlideInput): void {
  const slide = pptx.addSlide({ masterName: MASTERS.title });

  if (input.logo) {
    // A white plate keeps dark logos readable on the indigo background.
    slide.addShape('roundRect', {
      x: SLIDE.margin,
      y: 0.6,
      w: 2.2,
      h: 1.2,
      fill: { color: COLORS.white },
      line: { color: COLORS.white },
      rectRadius: 0.12,
    });
    addContainedImage(slide, input.logo, { x: SLIDE.margin + 0.15, y: 0.72, w: 1.9, h: 0.96 });
  }

  slide.addText(input.title, {
    x: SLIDE.margin,
    y: 2.3,
    w: TEXT_W,
    h: 2.0,
    fontFace: FONTS.heading,
    fontSize: 48,
    bold: true,
    color: COLORS.white,
    valign: 'bottom',
    fit: 'shrink',
    ...textDir(input.title),
  });

  if (input.subtitle) {
    slide.addText(input.subtitle, {
      x: SLIDE.margin,
      y: 4.45,
      w: TEXT_W,
      h: 1.2,
      fontFace: FONTS.body,
      fontSize: 22,
      color: 'D5D7F0',
      valign: 'top',
      fit: 'shrink',
      ...textDir(input.subtitle),
    });
  }

  slide.addText(formatDeckDate(input.date), {
    x: SLIDE.margin,
    y: 6.75,
    w: TEXT_W,
    h: 0.4,
    fontFace: FONTS.body,
    fontSize: 14,
    color: 'B9BCE0',
    align: 'left',
  });
}
