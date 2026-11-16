import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { SocialLinks } from "@/components/common/SocialLinks";

export function PublicFooter() {
  const { t } = useTranslation();
  const { data: labInfo } = useLabInfo();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-2">
          <p className="font-display text-lg font-semibold">{labInfo?.name}</p>
          {labInfo?.address && <p className="max-w-sm text-sm text-muted-foreground">{labInfo.address}</p>}
          {labInfo?.contactEmail && (
            <a href={`mailto:${labInfo.contactEmail}`} className="text-sm text-primary hover:underline" dir="ltr">
              {labInfo.contactEmail}
            </a>
          )}
        </div>
        <div className="flex flex-col gap-4 sm:items-end">
          {labInfo && <SocialLinks links={labInfo.socialLinks} />}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{t("site.rights", { year, name: labInfo?.name ?? "" })}</span>
            <Link to="/login" className="hover:text-foreground hover:underline">
              {t("site.adminLogin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
