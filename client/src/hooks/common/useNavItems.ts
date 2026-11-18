import {
  Image,
  Info,
  LayoutDashboard,
  ShieldCheck,
  Users,
  FlaskConical,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/components/ui/AppSidebar";
import { useAuthStore } from "@/store/useAuthStore";

export const ADMIN_NAV = [
  { key: "nav.dashboard", url: "/admin", icon: LayoutDashboard },
  { key: "nav.projects", url: "/admin/projects", icon: FlaskConical },
  { key: "nav.team", url: "/admin/members", icon: Users },
  { key: "nav.media", url: "/admin/media", icon: Image },
  { key: "nav.labInfo", url: "/admin/lab-info", icon: Info },
  { key: "nav.users", url: "/admin/users", icon: ShieldCheck, superAdminOnly: true },
] as const;

export function useNavItems(): MenuItem[] {
  const { t } = useTranslation();
  const role = useAuthStore((s) => s.role);

  return ADMIN_NAV.filter((item) => !("superAdminOnly" in item) || role === "SUPER_ADMIN").map((item) => ({
    title: t(item.key),
    url: item.url,
    icon: item.icon,
  }));
}
