import { Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/components/ui/AppSidebar";

export function useNavItems(): MenuItem[] {
  const { t } = useTranslation();

  return [{ title: t("nav.home"), url: "/", icon: Home }];
}
