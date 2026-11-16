import type PptxGenJS from 'pptxgenjs';
import { addCoverImage } from './images';
import { paginate, pagedTitle, textDir } from './text';
import { addHeading, COLORS, CONTENT_TOP, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckPerson } from './types';

const PER_SLIDE = 8;
const COLS = 4;
const PHOTO = 1.45;
const ROW_H = 2.6;

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');
}

function addPerson(slide: PptxGenJS.Slide, person: DeckPerson, x: number, y: number, cellW: number): void {
  const photoX = x + (cellW - PHOTO) / 2;
  const box = { x: photoX, y, w: PHOTO, h: PHOTO };
  if (person.photo) {
    addCoverImage(slide, { ...person.photo, alt: person.photo.alt || person.name }, box, true);
  } else {
    slide.addText(initials(person.name), {
      shape: 'ellipse',
      ...box,
      fill: { color: COLORS.indigo },
      color: COLORS.white,
      fontFace: FONTS.heading,
      fontSize: 28,
      bold: true,
      align: 'center',
      valign: 'middle',
    });
  }

  slide.addText(person.name, {
    x,
    y: y + PHOTO + 0.1,
    w: cellW,
    h: 0.4,
    fontFace: FONTS.heading,
    fontSize: 15,
    bold: true,
    color: COLORS.ink,
    fit: 'shrink',
    ...textDir(person.name),
    align: 'center',
  });

  if (person.title) {
    slide.addText(person.title, {
      x,
      y: y + PHOTO + 0.5,
      w: cellW,
      h: 0.5,
      fontFace: FONTS.body,
      fontSize: 12,
      color: COLORS.muted,
      valign: 'top',
      fit: 'shrink',
      ...textDir(person.title),
      align: 'center',
    });
  }
}

/** Photo grid of people, eight per slide. */
export function addTeamSlides(pptx: PptxGenJS, heading: string, people: DeckPerson[]): void {
  const pages = paginate(people, PER_SLIDE);
  const cellW = (SLIDE.w - SLIDE.margin * 2) / COLS;

  pages.forEach((page, index) => {
    const slide = pptx.addSlide({ masterName: MASTERS.content });
    addHeading(slide, pagedTitle(heading, index, pages.length));
    const rows = Math.ceil(page.length / COLS);
    const top = rows === 1 ? CONTENT_TOP + 1.1 : CONTENT_TOP;

    page.forEach((person, i) => {
      const row = Math.floor(i / COLS);
      const inRow = Math.min(COLS, page.length - row * COLS);
      // Center short rows.
      const offset = ((COLS - inRow) * cellW) / 2;
      const x = SLIDE.margin + offset + (i % COLS) * cellW;
      addPerson(slide, person, x, top + row * ROW_H, cellW);
    });
  });
}
