import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DeviceFrame } from "@/components/common/DeviceFrame";
import { PublicNotFound } from "@/components/common/PublicNotFound";
import { Spinner } from "@/components/ui/spinner";
import { usePublishedProject } from "@/hooks/queries/useProjectQueries";
import { getDemo } from "./demos/demoRegistry";

export default function ProjectDemoPage() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const demo = getDemo(slug);
  const { data: project, isError } = usePublishedProject(slug);

  if (!demo || isError) return <PublicNotFound backTo="/projects" backLabel={t("projects.backToProjects")} />;

  const Demo = demo.component;

  return (
    <article className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <Link
        to={`/projects/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("projects.backToProject")}
      </Link>
      <header className="mt-6 mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {project ? t("projects.demoTitle", { title: project.title }) : t("projects.tryDemo")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("projects.demoIntro")}</p>
        <p className="mt-2 text-sm text-muted-foreground sm:hidden">{t("projects.demoSmallScreen")}</p>
      </header>
      <DeviceFrame device={demo.device}>
        <Suspense
          fallback={
            <div className="flex size-full items-center justify-center">
              <Spinner className="size-8 text-primary" />
            </div>
          }
        >
          <Demo />
        </Suspense>
      </DeviceFrame>
    </article>
  );
}
