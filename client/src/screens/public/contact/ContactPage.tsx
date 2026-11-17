import { useTranslation } from "react-i18next";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { SocialLinks } from "@/components/common/SocialLinks";
import { safeHref } from "@/common/utils/safeHref";
import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { usePublishedMembers } from "@/hooks/queries/useMemberQueries";
import { ContactItem } from "./components/ContactItem";
import { ContactTeamList } from "./components/ContactTeamList";
import { LINK_CLASS } from "./linkClass";

export default function ContactPage() {
  const { t } = useTranslation();
  const { data: labInfo, isLoading, isError, refetch } = useLabInfo();
  const { data: members } = usePublishedMembers();

  const handleRetry = () => {
    void refetch();
  };

  const hasSocial = Object.values(labInfo?.socialLinks ?? {}).some((link) => safeHref(link));
  const mapHref = safeHref(labInfo?.mapUrl);
  const membersWithEmail = (members ?? []).filter((member) => member.email);

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
                  className={`font-display text-lg font-semibold tracking-tight break-all sm:text-xl ${LINK_CLASS}`}
                >
                  {labInfo.contactEmail}
                </a>
              </ContactItem>
            )}
            {membersWithEmail.length > 0 && (
              <ContactItem label={t("site.teamEmails")}>
                <ContactTeamList members={membersWithEmail} />
              </ContactItem>
            )}
            {labInfo?.address && (
              <ContactItem label={t("site.address")}>
                <p dir="auto" className="font-display text-lg leading-snug font-medium whitespace-pre-line sm:text-xl">
                  {labInfo.address}
                </p>
                {mapHref && (
                  <a href={mapHref} target="_blank" rel="noreferrer" className={`mt-3 inline-block text-base text-primary ${LINK_CLASS}`}>
                    {t("site.openMap")}
                  </a>
                )}
              </ContactItem>
            )}
            {!labInfo?.address && mapHref && (
              <ContactItem label={t("site.address")}>
                <a href={mapHref} target="_blank" rel="noreferrer" className={`text-base text-primary ${LINK_CLASS}`}>
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
