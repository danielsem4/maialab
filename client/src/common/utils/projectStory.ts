import type { IProject } from "@/common/types/Project";

/** The clinic-facing web platform and the patient app every module plugs into. */
export const WEB_PLATFORM_SLUG = "generic3-web-app";
export const APP_PLATFORM_SLUG = "dmt-proms";

/** Umbrella project for the cognitive tests: linked from their section header instead of shown as a card. */
export const COGNITIVE_OVERVIEW_SLUG = "digital-cognitive-tests";

export const COGNITIVE_MODULE_SLUGS = [
  "clock-drawing-test",
  "memory-test",
  "orientation-test",
  "hitber",
  "coffe-phone-test",
  "supermarket-test",
];

export const OTHER_MODULE_SLUGS = ["palpa-language-assessment", "soroka-tens-care", "sensors-module"];

export interface IProjectStory {
  web: IProject;
  app: IProject;
  cognitive: IProject[];
  cognitiveOverview: IProject | null;
  modules: IProject[];
  rest: IProject[];
}

/** True for projects that are modules of the patient app. */
export function isAppModule(slug: string): boolean {
  return slug === COGNITIVE_OVERVIEW_SLUG || COGNITIVE_MODULE_SLUGS.includes(slug) || OTHER_MODULE_SLUGS.includes(slug);
}

/**
 * Splits the projects into the platform story: web platform, patient app, the app's modules and everything else.
 * Each group keeps the order the projects arrive in. Returns null when either platform project is missing.
 */
export function buildProjectStory(projects: IProject[]): IProjectStory | null {
  const web = projects.find((p) => p.slug === WEB_PLATFORM_SLUG);
  const app = projects.find((p) => p.slug === APP_PLATFORM_SLUG);
  if (!web || !app) return null;

  return {
    web,
    app,
    cognitive: projects.filter((p) => COGNITIVE_MODULE_SLUGS.includes(p.slug)),
    cognitiveOverview: projects.find((p) => p.slug === COGNITIVE_OVERVIEW_SLUG) ?? null,
    modules: projects.filter((p) => OTHER_MODULE_SLUGS.includes(p.slug)),
    rest: projects.filter((p) => p !== web && p !== app && !isAppModule(p.slug)),
  };
}
