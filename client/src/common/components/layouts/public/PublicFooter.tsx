import { useTranslation } from "react-i18next";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { SocialLinks } from "@/components/common/SocialLinks";

export function PublicFooter() {
  const { t } = useTranslation();
  const { data: labInfo } = useLabInfo();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t glass-subtle">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="font-display text-base font-semibold">{labInfo?.name}</p>
          {labInfo?.address && <p className="text-xs text-muted-foreground">{labInfo.address}</p>}
          {labInfo?.contactEmail && (
            <a href={`mailto:${labInfo.contactEmail}`} className="text-xs text-primary hover:underline" dir="ltr">
              {labInfo.contactEmail}
            </a>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <img
            src="/hit-logo.png"
            alt={t("site.hitLogoAlt")}
            width={850}
            height={330}
            loading="lazy"
            className="h-9 w-auto shrink-0 dark:rounded-md dark:bg-white dark:px-2 dark:py-1"
          />
          {labInfo && <SocialLinks links={labInfo.socialLinks} />}
          <span className="text-xs text-muted-foreground">{t("site.rights", { year, name: labInfo?.name ?? "" })}</span>
        </div>
      </div>
    </footer>
  );
}
