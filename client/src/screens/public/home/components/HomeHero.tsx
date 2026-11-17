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
    <section aria-labelledby="home-title" className="pt-14 sm:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {isLoading ? (
          <Skeleton className="h-24 w-3/4 sm:h-40" />
        ) : (
          <h1
            id="home-title"
            dir="auto"
            className="font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] font-bold tracking-[-0.045em] text-balance break-words"
          >
            {labInfo?.name}
          </h1>
        )}
        {labInfo?.tagline && (
          <div className="mt-8 flex max-w-3xl items-start gap-5 sm:mt-10">
            <span aria-hidden="true" className="mt-4 h-1 w-12 shrink-0 rounded-full bg-highlight" />
            <p dir="auto" className="text-lg leading-snug text-foreground/80 text-pretty sm:text-2xl">
              {labInfo.tagline}
            </p>
          </div>
        )}
        {needsSetup && (
          <p className="mt-8 max-w-xl border-s-2 border-highlight ps-4 text-sm text-muted-foreground">
            {t("site.setupNeeded")}
          </p>
        )}
      </div>
      {labInfo?.hero && (
        <div className="mx-auto mt-12 max-w-[88rem] px-4 sm:mt-16 sm:px-6">
          <img
            src={labInfo.hero.url}
            alt={labInfo.hero.alt}
            className="aspect-[4/3] w-full rounded-2xl object-cover sm:aspect-[21/9]"
          />
        </div>
      )}
    </section>
  );
}
