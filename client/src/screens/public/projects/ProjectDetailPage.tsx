import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MarkdownView } from "@/components/common/MarkdownView";
import { PublicNotFound } from "@/components/common/PublicNotFound";
import { QueryState } from "@/components/common/QueryState";
import { usePublishedProject } from "@/hooks/queries/useProjectQueries";
import { getDemo } from "./demos/demoRegistry";
import { ProjectDemoCta } from "./components/ProjectDemoCta";
import { ProjectGallery } from "./components/ProjectGallery";
import { ProjectPublications } from "./components/ProjectPublications";
import { ProjectSidebar } from "./components/ProjectSidebar";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const { data: project, isLoading, isError } = usePublishedProject(slug);
  const demo = getDemo(slug);

  if (isError) return <PublicNotFound backTo="/projects" backLabel={t("projects.backToProjects")} />;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("projects.backToProjects")}
      </Link>
      <QueryState isLoading={isLoading} isError={false}>
        {project && (
          <>
            <header className="mt-8 max-w-4xl">
              <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">{project.title}</h1>
              {project.summary && <p className="mt-5 text-xl text-muted-foreground">{project.summary}</p>}
            </header>
            {demo && <ProjectDemoCta slug={slug} device={demo.device} />}
            {project.cover && (
              <div className="mt-10 overflow-hidden rounded-xl glass">
                <div className="flex justify-center bg-primary/10 p-4 sm:p-6">
                  <img
                    src={project.cover.url}
                    alt={project.cover.alt}
                    className="max-h-[28rem] w-auto max-w-full rounded-lg object-contain"
                  />
                </div>
              </div>
            )}
            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_16rem]">
              <div className="min-w-0 max-w-3xl">
                <MarkdownView content={project.description} className="text-lg" />
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
