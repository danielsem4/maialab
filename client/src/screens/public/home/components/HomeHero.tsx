import { useTranslation } from "react-i18next";
import type { ILabInfo } from "@/common/types/LabInfo";
import { Skeleton } from "@/components/ui/skeleton";

interface HomeHeroProps {
  labInfo: ILabInfo | null;
  isLoading: boolean;
  needsSetup: boolean;
}

export function HomeHero({ labInfo, isLoading, needsSetup }: HomeHeroProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="home-title" className="pt-8 sm:pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {isLoading ? (
          <Skeleton className="h-12 w-3/4 sm:h-16" />
        ) : (
          <h1
            id="home-title"
            dir="auto"
            className="font-display text-[clamp(2rem,4.5vw,3.5rem)] leading-tight font-bold tracking-[-0.03em] text-balance break-words"
          >
            {labInfo?.name}
          </h1>
        )}
        {labInfo?.tagline && (
          <div className="mt-4 flex max-w-3xl items-start gap-4 sm:mt-5">
            <span aria-hidden="true" className="mt-3 h-1 w-10 shrink-0 rounded-full bg-highlight" />
            <p dir="auto" className="text-base leading-snug text-foreground/80 text-pretty sm:text-lg">
              {labInfo.tagline}
            </p>
          </div>
        )}
        {needsSetup && (
          <p className="mt-6 max-w-xl border-s-2 border-highlight ps-4 text-sm text-muted-foreground">
            {t("site.setupNeeded")}
          </p>
        )}
      </div>
      {labInfo?.hero && (
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:mt-10 sm:px-6">
          <img
            src={labInfo.hero.url}
            alt={labInfo.hero.alt}
            className="aspect-[4/3] max-h-[60vh] w-full rounded-2xl object-cover sm:aspect-[21/9]"
          />
        </div>
      )}
    </section>
  );
}
