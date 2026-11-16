import { useTranslation } from "react-i18next";

export interface PublicNavItem {
  title: string;
  url: string;
}

export function usePublicNavItems(): PublicNavItem[] {
  const { t } = useTranslation();

  return [
    { title: t("nav.projects"), url: "/projects" },
    { title: t("nav.team"), url: "/team" },
    { title: t("nav.publications"), url: "/publications" },
    { title: t("nav.news"), url: "/news" },
    { title: t("nav.contact"), url: "/contact" },
  ];
}
