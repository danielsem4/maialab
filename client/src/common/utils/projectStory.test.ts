import { describe, expect, it } from "vitest";
import type { IProject } from "@/common/types/Project";
import { buildProjectStory, isAppModule } from "./projectStory";

function project(slug: string): IProject {
  return { slug } as IProject;
}

function slugs(projects: IProject[]): string[] {
  return projects.map((p) => p.slug);
}

describe("isAppModule", () => {
  it("is true for cognitive tests, their overview and the other modules", () => {
    expect(isAppModule("clock-drawing-test")).toBe(true);
    expect(isAppModule("digital-cognitive-tests")).toBe(true);
    expect(isAppModule("sensors-module")).toBe(true);
    expect(isAppModule("parkinson-belinson")).toBe(true);
  });

  it("is false for the platforms and unrelated projects", () => {
    expect(isAppModule("dmt-proms")).toBe(false);
    expect(isAppModule("generic3-web-app")).toBe(false);
    expect(isAppModule("hit-living-lab")).toBe(false);
  });
});

describe("buildProjectStory", () => {
  const all = [
    "generic3-web-app",
    "dmt-proms",
    "clock-drawing-test",
    "memory-test",
    "palpa-language-assessment",
    "digital-cognitive-tests",
    "hit-living-lab",
  ].map(project);

  it("returns null when a platform project is missing", () => {
    expect(buildProjectStory([])).toBeNull();
    expect(buildProjectStory(all.filter((p) => p.slug !== "generic3-web-app"))).toBeNull();
    expect(buildProjectStory(all.filter((p) => p.slug !== "dmt-proms"))).toBeNull();
  });

  it("splits projects into platforms, modules and the rest", () => {
    const story = buildProjectStory(all);
    expect(story?.web.slug).toBe("generic3-web-app");
    expect(story?.app.slug).toBe("dmt-proms");
    expect(slugs(story?.cognitive ?? [])).toEqual(["clock-drawing-test", "memory-test"]);
    expect(story?.cognitiveOverview?.slug).toBe("digital-cognitive-tests");
    expect(slugs(story?.modules ?? [])).toEqual(["palpa-language-assessment"]);
    expect(slugs(story?.rest ?? [])).toEqual(["hit-living-lab"]);
  });

  it("keeps the incoming order inside each group", () => {
    const story = buildProjectStory([...all].reverse());
    expect(slugs(story?.cognitive ?? [])).toEqual(["memory-test", "clock-drawing-test"]);
  });

  it("puts the Parkinson module with the app's modules, not the rest", () => {
    const story = buildProjectStory([...all, project("parkinson-belinson")]);
    expect(slugs(story?.modules ?? [])).toEqual(["palpa-language-assessment", "parkinson-belinson"]);
    expect(slugs(story?.rest ?? [])).toEqual(["hit-living-lab"]);
  });

  it("has no overview when that project is not published", () => {
    expect(buildProjectStory(all.filter((p) => p.slug !== "digital-cognitive-tests"))?.cognitiveOverview).toBeNull();
  });
});
