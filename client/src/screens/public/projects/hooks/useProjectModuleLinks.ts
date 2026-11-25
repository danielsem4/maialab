import { APP_PLATFORM_SLUG, buildProjectStory, isAppModule } from "@/common/utils/projectStory";
import { usePublishedProjects } from "@/hooks/queries/useProjectQueries";

/** For a project page: the app it is a module of, or — on the app's own page — the modules it holds. */
export function useProjectModuleLinks(slug: string) {
  const { data } = usePublishedProjects();
  const story = buildProjectStory(data ?? []);

  return {
    parent: story && isAppModule(slug) ? story.app : null,
    modules: story && slug === APP_PLATFORM_SLUG ? [...story.modules, ...story.cognitive] : [],
  };
}
