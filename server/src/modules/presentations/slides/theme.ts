import type PptxGenJS from 'pptxgenjs';
import { textDir } from './text';

export const COLORS = {
  indigo: '2B2F7A',
  coral: 'E5677D',
  background: 'F6F7FB',
  ink: '1C1D2B',
  muted: '5B5F77',
  white: 'FFFFFF',
  hairline: 'DCDEEA',
} as const;

export const FONTS = {
  heading: 'Calibri',
  body: 'Calibri',
} as const;

/** LAYOUT_WIDE is 13.333 x 7.5 inches. */
export const SLIDE = { w: 13.333, h: 7.5, margin: 0.6 } as const;

export const MASTERS = {
  title: 'TITLE',
  section: 'SECTION',
  content: 'CONTENT',
} as const;

/** Top of the content area on CONTENT slides (below the heading). */
export const CONTENT_TOP = 1.55;
/** Bottom of the content area on CONTENT slides (above the footer). */
export const CONTENT_BOTTOM = 6.7;

export function defineMasters(pptx: PptxGenJS, labName: string): void {
  pptx.defineSlideMaster({
    title: MASTERS.title,
    background: { color: COLORS.indigo },
    objects: [{ rect: { x: SLIDE.margin, y: 6.55, w: 1.2, h: 0.08, fill: { color: COLORS.coral } } }],
  });

  pptx.defineSlideMaster({
    title: MASTERS.section,
    background: { color: COLORS.indigo },
    objects: [{ rect: { x: SLIDE.margin, y: 3.0, w: 0.08, h: 1.5, fill: { color: COLORS.coral } } }],
  });

  pptx.defineSlideMaster({
    title: MASTERS.content,
    background: { color: COLORS.background },
    objects: [
      { rect: { x: SLIDE.margin, y: 1.25, w: 0.9, h: 0.06, fill: { color: COLORS.coral } } },
      { line: { x: SLIDE.margin, y: 6.95, w: SLIDE.w - SLIDE.margin * 2, h: 0, line: { color: COLORS.hairline, width: 0.75 } } },
      {
        text: {
          text: labName,
          options: {
            x: SLIDE.margin,
            y: 7.0,
            w: 8,
            h: 0.35,
            fontFace: FONTS.body,
            fontSize: 10,
            color: COLORS.muted,
            ...textDir(labName),
            align: 'left',
          },
        },
      },
    ],
    slideNumber: { x: SLIDE.w - SLIDE.margin - 0.6, y: 7.0, w: 0.6, h: 0.35, fontFace: FONTS.body, fontSize: 10, color: COLORS.muted, align: 'right' },
  });
}

/** Adds the indigo heading used at the top of every CONTENT slide. */
export function addHeading(slide: PptxGenJS.Slide, text: string): void {
  slide.addText(text, {
    x: SLIDE.margin,
    y: 0.45,
    w: SLIDE.w - SLIDE.margin * 2,
    h: 0.75,
    fontFace: FONTS.heading,
    fontSize: 28,
    bold: true,
    color: COLORS.indigo,
    valign: 'bottom',
    fit: 'shrink',
    ...textDir(text),
  });
}
