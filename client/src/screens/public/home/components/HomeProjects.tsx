import { useTranslation } from "react-i18next";
import type { IProject } from "@/common/types/Project";
import { ProjectIndex } from "@/components/common/ProjectIndex";
import { HomeSectionHeading } from "./HomeSectionHeading";

interface HomeProjectsProps {
  projects: IProject[];
}

export function HomeProjects({ projects }: HomeProjectsProps) {
  const { t } = useTranslation();

  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="home-projects" className="mx-auto mt-24 max-w-6xl px-4 sm:mt-32 sm:px-6">
      <HomeSectionHeading id="home-projects" title={t("site.featuredProjects")} linkTo="/projects" linkLabel={t("site.allProjects")} />
      <ProjectIndex projects={projects} />
    </section>
  );
}
