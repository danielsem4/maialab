import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PATH_TO_TITLE_KEY: Record<string, string> = {
  "/": "nav.home",
};

export function usePageTitle(): string {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const key = PATH_TO_TITLE_KEY[pathname];
  return key ? t(key) : "";
}
