import { useTranslation } from "react-i18next";
import type { ILabInfo } from "@/common/types/LabInfo";
import { MarkdownView } from "@/components/common/MarkdownView";

interface HomeAboutProps {
  labInfo: ILabInfo | null;
}

export function HomeAbout({ labInfo }: HomeAboutProps) {
  const { t } = useTranslation();

  if (!labInfo?.about) return null;

  return (
    <section aria-labelledby="home-about" className="mx-auto mt-14 max-w-6xl px-4 sm:mt-28 sm:px-6">
      <div className="max-w-prose">
        <h2 id="home-about" className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("site.about")}
        </h2>
        <MarkdownView content={labInfo.about} className="mt-4 text-base sm:text-lg" />
      </div>
    </section>
  );
}
