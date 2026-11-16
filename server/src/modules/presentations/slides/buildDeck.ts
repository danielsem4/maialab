import PptxGenJS from 'pptxgenjs';
import { addClosingSlide } from './closingSlide';
import { addGallerySlides } from './gallerySlides';
import { addLabIntroSlide } from './labIntroSlide';
import { LABELS } from './labels';
import { truncateText } from './markdownToText';
import { addProjectDescriptionSlide } from './projectDescriptionSlide';
import { addProjectTitleSlide } from './projectTitleSlide';
import { addPublicationsSlides } from './publicationsSlide';
import { addSectionSlide } from './sectionSlide';
import { addTeamSlides } from './teamSlide';
import { defineMasters, FONTS } from './theme';
import { addTitleSlide } from './titleSlide';
import type { DeckLab, DeckPerson, DeckProject, DeckPublication } from './types';

export interface LabDeckContent {
  lab: DeckLab;
  projects: DeckProject[];
  /** null when the team slides are not wanted. */
  team: DeckPerson[] | null;
  /** null when the publication slides are not wanted. */
  publications: DeckPublication[] | null;
}

function createPresentation(lab: DeckLab, title: string): PptxGenJS {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.title = title;
  pptx.author = lab.name;
  pptx.company = lab.name;
  pptx.theme = { headFontFace: FONTS.heading, bodyFontFace: FONTS.body };
  defineMasters(pptx, lab.name);
  return pptx;
}

async function toBuffer(pptx: PptxGenJS): Promise<Buffer> {
  const output = await pptx.write({ outputType: 'nodebuffer' });
  return output as Buffer;
}

function addProjectSlides(pptx: PptxGenJS, project: DeckProject): void {
  addProjectTitleSlide(pptx, project);
  addProjectDescriptionSlide(pptx, project);
  addGallerySlides(pptx, project.title, project.images);
}

/** A deck about one project: cover, overview, gallery, its team and its publications. */
export async function buildProjectDeck(lab: DeckLab, project: DeckProject, date = new Date()): Promise<Buffer> {
  const pptx = createPresentation(lab, project.title);
  addTitleSlide(pptx, { title: project.title, subtitle: lab.name, logo: lab.logo, date });
  addProjectSlides(pptx, project);
  if (project.members.length > 0) addTeamSlides(pptx, LABELS.projectTeam, project.members);
  if (project.publications.length > 0) addPublicationsSlides(pptx, LABELS.publications, project.publications);
  addClosingSlide(pptx, lab);
  return toBuffer(pptx);
}

/** A lab overview deck: intro, one section per chosen project, then team and publications. */
export async function buildLabDeck(content: LabDeckContent, date = new Date()): Promise<Buffer> {
  const { lab, projects, team, publications } = content;
  const pptx = createPresentation(lab, lab.name);

  addTitleSlide(pptx, { title: lab.name, subtitle: lab.tagline || LABELS.labOverview, logo: lab.logo, date });
  addLabIntroSlide(pptx, lab, LABELS.about);

  if (projects.length > 0) {
    addSectionSlide(pptx, LABELS.projects, truncateText(projects.map((p) => p.title).join(', '), 200));
    projects.forEach((project) => addProjectSlides(pptx, project));
  }
  if (team && team.length > 0) {
    addSectionSlide(pptx, LABELS.team);
    addTeamSlides(pptx, LABELS.team, team);
  }
  if (publications && publications.length > 0) {
    addPublicationsSlides(pptx, LABELS.publications, publications);
  }

  addClosingSlide(pptx, lab);
  return toBuffer(pptx);
}
