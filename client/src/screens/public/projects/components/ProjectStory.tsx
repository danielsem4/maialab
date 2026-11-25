import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Smartphone } from "lucide-react";
import type { IProjectStory } from "@/common/utils/projectStory";
import { ProjectIndex } from "@/components/common/ProjectIndex";
import { useReveal } from "@/hooks/common/useReveal";
import { ModuleSection } from "./ModuleSection";
import { PlatformDuo } from "./PlatformDuo";

interface ProjectStoryProps {
  story: IProjectStory;
}

/** Projects told as one platform: the web side and the app, the modules living inside the app, then everything else. */
export function ProjectStory({ story }: ProjectStoryProps) {
  const { t } = useTranslation();
  const [platformRef, platformRevealed] = useReveal<HTMLElement>();
  const [insideRef, insideRevealed] = useReveal<HTMLElement>();
  const moduleOf = t("projects.story.moduleOf", { app: story.app.title });

  return (
    <div>
      <section ref={platformRef} data-revealed={platformRevealed} aria-labelledby="story-platform">
        <h2 id="story-platform" className="text-start font-display text-xl font-bold sm:text-3xl">
          {t("projects.story.platformTitle")}
        </h2>
        <p className="mt-2 mb-5 max-w-2xl text-start text-sm text-muted-foreground sm:mb-6 sm:text-base">{t("projects.story.platformIntro")}</p>
        <PlatformDuo web={story.web} app={story.app} />
      </section>

      <section ref={insideRef} data-revealed={insideRevealed} aria-labelledby="story-inside">
        {/* Sits under the app card (the end column on wide screens) and leads into its modules. */}
        <div className="flex justify-center lg:justify-end lg:pe-[23%]" aria-hidden>
          <div className="story-line relative h-10 w-0.5 bg-primary/50 sm:h-16">
            <span className="story-dot absolute start-1/2 size-2 -translate-x-1/2 rounded-full bg-primary rtl:translate-x-1/2" />
          </div>
        </div>
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4 sm:rounded-3xl sm:p-8">
          <header className="story-item mb-7 flex items-start gap-3 text-start sm:mb-8 sm:gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-12">
              <Smartphone className="size-5 sm:size-6" aria-hidden />
            </span>
            <div>
              <h2 id="story-inside" className="font-display text-xl font-bold sm:text-3xl">
                {t("projects.story.insideTitle", { app: story.app.title })}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
                {t("projects.story.insideIntro", { web: story.web.title })}
              </p>
            </div>
          </header>
          <div className="space-y-10 sm:space-y-12">
            <ModuleSection
              id="story-modules"
              title={t("projects.story.otherModulesTitle")}
              projects={story.modules}
              moduleOf={moduleOf}
            />
            <ModuleSection
              id="story-cognitive"
              title={t("projects.story.cognitiveTitle")}
              projects={story.cognitive}
              moduleOf={moduleOf}
              numbered
              action={
                story.cognitiveOverview && (
                  <Link
                    to={`/projects/${story.cognitiveOverview.slug}`}
                    className="inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:min-h-0"
                  >
                    {t("projects.story.cognitiveOverview")}
                    <ArrowRight className="size-4 rtl:rotate-180" />
                  </Link>
                )
              }
            />
          </div>
        </div>
      </section>

      {story.rest.length > 0 && (
        <section className="mt-12 sm:mt-16" aria-labelledby="story-rest">
          <h2 id="story-rest" className="mb-5 text-start font-display text-xl font-bold sm:text-2xl">
            {t("projects.story.restTitle")}
          </h2>
          <ProjectIndex projects={story.rest} />
        </section>
      )}
    </div>
  );
}
