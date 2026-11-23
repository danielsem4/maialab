import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Puzzle } from "lucide-react";
import type { IProject } from "@/common/types/Project";

interface ProjectModuleLinksProps {
  /** The app this project is a module of, when it is one. */
  parent: IProject | null;
  /** The modules of this project, when it is the app. */
  modules: IProject[];
}

const CHIP =
  "inline-flex items-center gap-1.5 min-h-10 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-sm font-medium text-primary transition hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

/** On a module's page: a chip linking up to the app. On the app's page: chips linking down to each module. */
export function ProjectModuleLinks({ parent, modules }: ProjectModuleLinksProps) {
  const { t } = useTranslation();

  if (parent) {
    return (
      <div className="mt-2 sm:mt-6">
        <Link to={`/projects/${parent.slug}`} className={CHIP}>
          <Puzzle className="size-4" aria-hidden />
          {t("projects.story.moduleOf", { app: parent.title })}
        </Link>
      </div>
    );
  }

  if (modules.length === 0) return null;

  return (
    <nav className="mt-8" aria-labelledby="project-modules">
      <h2 id="project-modules" className="mb-3 flex items-center gap-2 text-start text-sm font-semibold text-primary">
        <Puzzle className="size-4" aria-hidden />
        {t("projects.story.modulesInApp")}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {modules.map((module) => (
          <li key={module.id}>
            <Link to={`/projects/${module.slug}`} className={CHIP}>
              {module.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
