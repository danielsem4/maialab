import { ExternalLink, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/common/usePageTitle";

interface SiteHeaderProps {
  onToggleSidebar: () => void;
}

export const SiteHeader = ({ onToggleSidebar }: SiteHeaderProps) => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle();

  return (
    <header className="flex h-12 w-full items-center justify-between gap-2 border-b border-border bg-card px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 transition hover:bg-muted"
          aria-label={t("common.toggleSidebar")}
        >
          <Menu size={20} />
        </button>
        <h1 className="truncate text-lg font-semibold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" target="_blank">
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">{t("nav.viewSite")}</span>
          </Link>
        </Button>
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </header>
  );
};
