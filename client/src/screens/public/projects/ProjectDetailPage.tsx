import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BackLink } from "@/components/common/BackLink";
import { MarkdownView } from "@/components/common/MarkdownView";
import { PublicNotFound } from "@/components/common/PublicNotFound";
import { QueryState } from "@/components/common/QueryState";
import { ZoomableImage } from "@/components/common/ZoomableImage";
import { usePublishedProject } from "@/hooks/queries/useProjectQueries";
import { getDemo } from "./demos/demoRegistry";
import { ProjectDemoCta } from "./components/ProjectDemoCta";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectModuleLinks } from "./components/ProjectModuleLinks";
import { ProjectPublications } from "./components/ProjectPublications";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { useProjectModuleLinks } from "./hooks/useProjectModuleLinks";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const { data: project, isLoading, isError } = usePublishedProject(slug);
  const demo = getDemo(slug);
  const moduleLinks = useProjectModuleLinks(slug);

  if (isError) return <PublicNotFound backTo="/projects" backLabel={t("projects.backToProjects")} />;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-10">
      <BackLink to="/projects" label={t("projects.backToProjects")} />
      <QueryState isLoading={isLoading} isError={false}>
        {project && (
          <>
            <ProjectModuleLinks parent={moduleLinks.parent} modules={[]} />
            <header className="mt-4 max-w-4xl sm:mt-8">
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">{project.title}</h1>
              {project.summary && <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl">{project.summary}</p>}
            </header>
            <ProjectModuleLinks parent={null} modules={moduleLinks.modules} />
            {demo && <ProjectDemoCta slug={slug} device={demo.device} />}
            {project.cover && (
              <div className="mt-6 overflow-hidden rounded-xl glass sm:mt-10">
                <div className="flex justify-center bg-primary/10 p-2 sm:p-6">
                  <ZoomableImage
                    src={project.cover.url}
                    alt={project.cover.alt}
                    className="max-h-[28rem] w-auto max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
            <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[1fr_16rem] lg:gap-12">
              <div className="min-w-0 max-w-3xl">
                <MarkdownView content={project.description} className="text-base sm:text-lg" />
                <div className="mt-10">
                  <ProjectGallery images={project.images} />
                </div>
                <ProjectPublications publications={project.publications} />
              </div>
              <ProjectSidebar project={project} />
            </div>
          </>
        )}
      </QueryState>
    </article>
  );
}
