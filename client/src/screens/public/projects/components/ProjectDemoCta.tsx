import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Smartphone, Tablet } from "lucide-react";
import type { DeviceType } from "@/common/types/Demo";

interface ProjectDemoCtaProps {
  slug: string;
  device: DeviceType;
}

/** Glass card linking to the project's interactive demo. */
export function ProjectDemoCta({ slug, device }: ProjectDemoCtaProps) {
  const { t } = useTranslation();
  const Icon = device === "iphone" ? Smartphone : Tablet;

  return (
    <Link
      to={`/projects/${slug}/demo`}
      className="group mt-8 flex items-center gap-4 rounded-xl glass p-5 transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-6" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 text-start">
        <span className="block font-display text-lg font-semibold group-hover:text-primary">{t("projects.tryDemo")}</span>
        <span className="block text-sm text-muted-foreground">{t(`projects.demoHint.${device}`)}</span>
      </span>
      <ArrowRight className="size-5 text-primary transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
    </Link>
  );
}
