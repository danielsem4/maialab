import { useTranslation } from "react-i18next";
import type { ILabInfo } from "@/common/types/LabInfo";
import { MarkdownView } from "@/components/common/MarkdownView";

interface HomeAboutProps {
  labInfo: ILabInfo | null;
}

export function HomeAbout({ labInfo }: HomeAboutProps) {
  const { t } = useTranslation();

  if (!labInfo?.about && !labInfo?.mission) return null;

  return (
    <section aria-labelledby="home-about" className="mx-auto mt-20 max-w-6xl px-4 sm:mt-28 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-20">
        {labInfo.about && (
          <div className="max-w-prose">
            <h2 id="home-about" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("site.about")}
            </h2>
            <MarkdownView content={labInfo.about} className="mt-4 text-lg" />
          </div>
        )}
        {labInfo.mission && (
          <aside className="self-start border-s-2 border-highlight ps-6 lg:mt-16">
            <h2 id={labInfo.about ? undefined : "home-about"} className="font-display text-xl font-semibold">
              {t("site.mission")}
            </h2>
            <MarkdownView content={labInfo.mission} className="mt-2 text-lg text-foreground/80" />
          </aside>
        )}
      </div>
    </section>
  );
}
