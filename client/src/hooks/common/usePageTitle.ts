import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ADMIN_NAV } from "./useNavItems";

/** Title for the admin header: the nav item whose URL is the longest prefix of the path. */
export function usePageTitle(): string {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const match = [...ADMIN_NAV]
    .sort((a, b) => b.url.length - a.url.length)
    .find((item) => pathname === item.url || pathname.startsWith(`${item.url}/`));
  return match ? t(match.key) : "";
}
