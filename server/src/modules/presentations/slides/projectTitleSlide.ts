import type PptxGenJS from 'pptxgenjs';
import { addCoverImage } from './images';
import { formatPeriod, LABELS } from './labels';
import { markdownToText, truncateText } from './markdownToText';
import { joinParts, textDir } from './text';
import { COLORS, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckProject } from './types';

const COVER_X = 7.2;
const COVER_BOTTOM = 6.85;

/** Opening slide of a project: title, summary and status, with the cover image on the side. */
export function addProjectTitleSlide(pptx: PptxGenJS, project: DeckProject): void {
  const slide = pptx.addSlide({ masterName: MASTERS.content });
  const rtl = textDir(project.title).rtlMode === true;
  const hasCover = project.cover !== null;
  const textW = hasCover ? COVER_X - 0.5 - SLIDE.margin : SLIDE.w - SLIDE.margin * 2;

  if (project.cover) {
    const coverW = SLIDE.w - COVER_X;
    // RTL decks mirror the layout so the text starts on the right.
    const x = rtl ? 0 : COVER_X;
    addCoverImage(slide, { ...project.cover, alt: project.cover.alt || project.title }, { x, y: 0, w: coverW, h: COVER_BOTTOM });
  }
  const textX = hasCover && rtl ? SLIDE.w - COVER_X + 0.5 : SLIDE.margin;

  slide.addText(project.title, {
    x: textX,
    y: 1.6,
    w: textW,
    h: 1.9,
    fontFace: FONTS.heading,
    fontSize: 38,
    bold: true,
    color: COLORS.indigo,
    valign: 'bottom',
    fit: 'shrink',
    ...textDir(project.title),
  });

  const summary = truncateText(markdownToText(project.summary), 420);
  if (summary) {
    slide.addText(summary, {
      x: textX,
      y: 3.65,
      w: textW,
      h: 2.0,
      fontFace: FONTS.body,
      fontSize: 18,
      color: COLORS.ink,
      valign: 'top',
      fit: 'shrink',
      ...textDir(summary),
    });
  }

  const meta = joinParts([LABELS.status[project.status], formatPeriod(project.startDate, project.endDate)], '   |   ');
  slide.addText(meta, {
    x: textX,
    y: 5.9,
    w: textW,
    h: 0.45,
    fontFace: FONTS.body,
    fontSize: 14,
    bold: true,
    color: COLORS.muted,
    align: rtl ? 'right' : 'left',
  });
}
