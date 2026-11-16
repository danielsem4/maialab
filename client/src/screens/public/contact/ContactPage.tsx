import { useTranslation } from "react-i18next";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { SocialLinks } from "@/components/common/SocialLinks";
import { safeHref } from "@/common/utils/safeHref";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { ContactItem } from "./components/ContactItem";

const LINK_CLASS =
  "rounded-sm underline decoration-foreground/20 underline-offset-[6px] transition-colors hover:text-primary hover:decoration-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export default function ContactPage() {
  const { t } = useTranslation();
  const { data: labInfo, isLoading, isError, refetch } = useLabInfo();

  const handleRetry = () => {
    void refetch();
  };

  const hasSocial = Object.values(labInfo?.socialLinks ?? {}).some((link) => safeHref(link));
  const mapHref = safeHref(labInfo?.mapUrl);

  return (
    <>
      <PublicPageHeader title={t("site.contactTitle")} intro={t("site.contactIntro")} />
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <QueryState isLoading={isLoading} isError={isError} onRetry={handleRetry}>
          <dl className="border-b">
            {labInfo?.contactEmail && (
              <ContactItem label={t("site.email")}>
                <a
                  href={`mailto:${labInfo.contactEmail}`}
                  dir="ltr"
                  className={`font-display text-2xl font-semibold tracking-tight break-all sm:text-5xl ${LINK_CLASS}`}
                >
                  {labInfo.contactEmail}
                </a>
              </ContactItem>
            )}
            {labInfo?.address && (
              <ContactItem label={t("site.address")}>
                <p dir="auto" className="font-display text-2xl leading-snug font-medium whitespace-pre-line sm:text-3xl">
                  {labInfo.address}
                </p>
                {mapHref && (
                  <a href={mapHref} target="_blank" rel="noreferrer" className={`mt-4 inline-block text-lg text-primary ${LINK_CLASS}`}>
                    {t("site.openMap")}
                  </a>
                )}
              </ContactItem>
            )}
            {!labInfo?.address && mapHref && (
              <ContactItem label={t("site.address")}>
                <a href={mapHref} target="_blank" rel="noreferrer" className={`text-lg text-primary ${LINK_CLASS}`}>
                  {t("site.openMap")}
                </a>
              </ContactItem>
            )}
            {labInfo && hasSocial && (
              <ContactItem label={t("labInfo.socialLinks")}>
                <div className="-ms-2">
                  <SocialLinks links={labInfo.socialLinks} />
                </div>
              </ContactItem>
            )}
          </dl>
          {!labInfo && <p className="mt-8 max-w-xl border-s-2 border-highlight ps-4 text-sm text-muted-foreground">{t("site.setupNeeded")}</p>}
        </QueryState>
      </section>
    </>
  );
}
