import type PptxGenJS from 'pptxgenjs';
import { markdownToText, truncateText } from './markdownToText';
import { textDir } from './text';
import { addHeading, COLORS, CONTENT_BOTTOM, CONTENT_TOP, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckProject } from './types';

/** Roughly what fits on one slide at a readable size. */
const DESCRIPTION_MAX = 1100;

/** The project's long description, flattened from Markdown and shortened to one slide. */
export function addProjectDescriptionSlide(pptx: PptxGenJS, project: DeckProject): void {
  const text = truncateText(markdownToText(project.description), DESCRIPTION_MAX);
  if (!text) return;

  const slide = pptx.addSlide({ masterName: MASTERS.content });
  addHeading(slide, project.title);

  const hasTags = project.tags.length > 0;
  const bodyH = CONTENT_BOTTOM - CONTENT_TOP - (hasTags ? 0.6 : 0);

  slide.addText(text, {
    x: SLIDE.margin,
    y: CONTENT_TOP,
    w: SLIDE.w - SLIDE.margin * 2,
    h: bodyH,
    fontFace: FONTS.body,
    fontSize: text.length > 700 ? 15 : 18,
    color: COLORS.ink,
    valign: 'top',
    paraSpaceAfter: 6,
    fit: 'shrink',
    ...textDir(text),
  });

  if (hasTags) {
    const tags = project.tags.join(', ');
    slide.addText(tags, {
      x: SLIDE.margin,
      y: CONTENT_BOTTOM - 0.45,
      w: SLIDE.w - SLIDE.margin * 2,
      h: 0.4,
      fontFace: FONTS.body,
      fontSize: 12,
      color: COLORS.muted,
      ...textDir(tags),
    });
  }
}
