import { Suspense } from "react";
import { RotateCw } from "lucide-react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BackLink } from "@/components/common/BackLink";
import { DeviceFrame } from "@/components/common/DeviceFrame";
import { PublicNotFound } from "@/components/common/PublicNotFound";
import { Spinner } from "@/components/ui/spinner";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import { usePublishedProject } from "@/hooks/queries/useProjectQueries";
import { cn } from "@/lib/utils";
import { getDemo } from "./demos/demoRegistry";

/** A phone held sideways: too short for the page chrome, so the demo takes over the whole screen. */
const PHONE_LANDSCAPE = "(orientation: landscape) and (max-height: 500px)";

export default function ProjectDemoPage() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const demo = getDemo(slug);
  const { data: project, isError } = usePublishedProject(slug);
  const fullScreen = useMediaQuery(PHONE_LANDSCAPE);

  if (!demo || isError) return <PublicNotFound backTo="/projects" backLabel={t("projects.backToProjects")} />;

  const Demo = demo.component;

  // Both layouts share one element tree, so rotating the phone mid-test keeps the demo's state.
  return (
    <article
      className={cn(
        fullScreen
          ? "fixed inset-0 z-50 flex items-center bg-background px-[env(safe-area-inset-left)]"
          : "mx-auto max-w-6xl px-4 pt-4 sm:px-6 sm:pt-10",
      )}
    >
      <BackLink
        to={`/projects/${slug}`}
        label={t("projects.backToProject")}
        iconOnly={fullScreen}
        className={cn(fullScreen && "absolute start-3 top-1 z-10 ms-0")}
      />
      <header className={cn("mt-4 mb-6 sm:mt-6 sm:mb-8", fullScreen && "sr-only")}>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">
          {project ? t("projects.demoTitle", { title: project.title }) : t("projects.tryDemo")}
        </h1>
        <p className="mt-3 text-muted-foreground">{t("projects.demoIntro")}</p>
      </header>
      <div className={cn("mb-5 flex items-center gap-3 rounded-xl glass p-4 text-start sm:hidden", fullScreen && "hidden")}>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <RotateCw className="size-5" aria-hidden />
        </span>
        <p className="text-sm">
          <span className="block font-medium">{t("projects.demoRotate")}</span>
          <span className="block text-muted-foreground">{t("projects.demoSmallScreen")}</span>
        </p>
      </div>
      <DeviceFrame device={demo.device} compact={fullScreen}>
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
