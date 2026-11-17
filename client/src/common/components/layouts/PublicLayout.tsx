import { Outlet, ScrollRestoration } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PublicFooter } from "./public/PublicFooter";
import { PublicHeader } from "./public/PublicHeader";

export default function PublicLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("site.skipToContent")}
      </a>
      <PublicHeader />
      <main id="content" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      <ScrollRestoration />
    </div>
  );
}
