import type PptxGenJS from 'pptxgenjs';
import { LABELS } from './labels';
import { textDir } from './text';
import { COLORS, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckLab } from './types';

/** Final slide: thanks plus how to reach the lab. */
export function addClosingSlide(pptx: PptxGenJS, lab: DeckLab): void {
  const slide = pptx.addSlide({ masterName: MASTERS.title });
  const w = SLIDE.w - SLIDE.margin * 2;

  slide.addText(LABELS.thanks, {
    x: SLIDE.margin,
    y: 2.2,
    w,
    h: 1.3,
    fontFace: FONTS.heading,
    fontSize: 48,
    bold: true,
    color: COLORS.white,
    valign: 'bottom',
  });

  slide.addText(lab.name, {
    x: SLIDE.margin,
    y: 3.6,
    w,
    h: 0.6,
    fontFace: FONTS.body,
    fontSize: 22,
    color: 'D5D7F0',
    ...textDir(lab.name),
    align: 'left',
  });

  const contact = [lab.contactEmail, lab.website, lab.address].filter(Boolean);
  if (contact.length === 0) return;

  slide.addText(
    contact.map((line, i) => ({
      text: line,
      options: {
        breakLine: i < contact.length - 1,
        color: COLORS.white,
        ...(line === lab.contactEmail ? { hyperlink: { url: `mailto:${line}` } } : {}),
        ...(line === lab.website ? { hyperlink: { url: line } } : {}),
        ...(textDir(line).rtlMode ? { rtlMode: true } : {}),
      },
    })),
    {
      x: SLIDE.margin,
      y: 4.6,
      w,
      h: 1.5,
      fontFace: FONTS.body,
      fontSize: 18,
      color: COLORS.white,
      valign: 'top',
      align: 'left',
      paraSpaceAfter: 4,
    },
  );
}
