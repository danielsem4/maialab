import type PptxGenJS from 'pptxgenjs';
import { markdownToText, truncateText } from './markdownToText';
import { textDir } from './text';
import { addHeading, COLORS, CONTENT_BOTTOM, CONTENT_TOP, FONTS, MASTERS, SLIDE } from './theme';
import type { DeckLab } from './types';

const ABOUT_MAX = 900;
const MISSION_MAX = 400;

/** "About the lab": the about text, with the mission as a highlighted side note. */
export function addLabIntroSlide(pptx: PptxGenJS, lab: DeckLab, heading: string): void {
  const about = truncateText(markdownToText(lab.about), ABOUT_MAX);
  const mission = truncateText(markdownToText(lab.mission), MISSION_MAX);
  if (!about && !mission) return;

  const slide = pptx.addSlide({ masterName: MASTERS.content });
  addHeading(slide, heading);

  const fullW = SLIDE.w - SLIDE.margin * 2;
  const aboutW = mission ? fullW * 0.6 : fullW;
  const h = CONTENT_BOTTOM - CONTENT_TOP;

  if (about) {
    slide.addText(about, {
      x: SLIDE.margin,
      y: CONTENT_TOP,
      w: aboutW,
      h,
      fontFace: FONTS.body,
      fontSize: 18,
      color: COLORS.ink,
      valign: 'top',
      paraSpaceAfter: 8,
      fit: 'shrink',
      ...textDir(about),
    });
  }

  if (mission) {
    const x = about ? SLIDE.margin + aboutW + 0.4 : SLIDE.margin;
    const w = about ? fullW - aboutW - 0.4 : fullW;
    slide.addShape('rect', { x, y: CONTENT_TOP, w, h: 3.6, fill: { color: COLORS.white }, line: { color: COLORS.hairline } });
    slide.addShape('rect', { x, y: CONTENT_TOP, w: 0.06, h: 3.6, fill: { color: COLORS.indigo }, line: { color: COLORS.indigo } });
    slide.addText(mission, {
      x: x + 0.3,
      y: CONTENT_TOP + 0.25,
      w: w - 0.5,
      h: 3.1,
      fontFace: FONTS.body,
      fontSize: 17,
      italic: true,
      color: COLORS.indigo,
      valign: 'top',
      fit: 'shrink',
      ...textDir(mission),
    });
  }
}
