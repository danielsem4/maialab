import type PptxGenJS from 'pptxgenjs';
import { joinParts, paginate, pagedTitle, textDir } from './text';
import { addHeading, COLORS, CONTENT_TOP, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckPublication } from './types';

const PER_SLIDE = 6;
const ENTRY_H = 0.82;

/** "Authors. Venue, 2024" */
export function citationLine(pub: DeckPublication): string {
  return joinParts([pub.authors, joinParts([pub.venue, String(pub.year)])], '. ');
}

function addEntry(slide: PptxGenJS.Slide, pub: DeckPublication, y: number): void {
  const w = SLIDE.w - SLIDE.margin * 2;
  const dir = textDir(`${pub.title} ${pub.authors}`);
  const citation = citationLine(pub);

  slide.addText(
    [
      {
        text: pub.title,
        options: {
          bold: true,
          fontSize: 16,
          color: COLORS.indigo,
          breakLine: true,
          ...(pub.url ? { hyperlink: { url: pub.url } } : {}),
        },
      },
      { text: citation, options: { fontSize: 12, color: COLORS.muted } },
    ],
    {
      x: SLIDE.margin,
      y,
      w,
      h: ENTRY_H,
      fontFace: FONTS.body,
      valign: 'top',
      fit: 'shrink',
      ...dir,
    },
  );
}

/** Publication list, newest first, six per slide. */
export function addPublicationsSlides(pptx: PptxGenJS, heading: string, publications: DeckPublication[]): void {
  const sorted = [...publications].sort((a, b) => b.year - a.year);
  const pages = paginate(sorted, PER_SLIDE);

  pages.forEach((page, index) => {
    const slide = pptx.addSlide({ masterName: MASTERS.content });
    addHeading(slide, pagedTitle(heading, index, pages.length));
    page.forEach((pub, i) => addEntry(slide, pub, CONTENT_TOP + i * ENTRY_H));
  });
}
