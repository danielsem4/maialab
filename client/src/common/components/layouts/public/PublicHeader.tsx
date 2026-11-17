import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/common/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePublicNavItems } from "@/hooks/common/usePublicNavItems";
import { LabMark } from "./LabMark";
import { PublicNav } from "./PublicNav";

export function PublicHeader() {
  const { t } = useTranslation();
  const items = usePublicNavItems();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b glass-subtle">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <LabMark />
        <div className="hidden md:block">
          <PublicNav items={items} />
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("nav.openMenu")}>
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-6">
              <SheetTitle className="sr-only">{t("nav.openMenu")}</SheetTitle>
              <SheetDescription className="sr-only">{t("nav.home")}</SheetDescription>
              <div className="mt-8">
                <PublicNav items={items} orientation="vertical" onNavigate={handleNavigate} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
