import React from "react";
import { LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/common/useLogout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  variant?: "inset" | "default";
  menuItems: MenuItem[];
  open?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  variant = "inset",
  menuItems,
  open = true,
}) => {
  const name = useAuthStore((s) => s.name);
  const { handleLogout } = useLogout();
  const { t } = useTranslation();

  return (
    <aside
      className={`fixed top-0 start-0 h-screen z-50 flex flex-col p-4 gap-4 transition-transform duration-300 ${
        variant === "inset" ? "w-72 glass border-y-0 border-s-0 rounded-none" : "w-64 glass border-y-0 border-s-0 rounded-none"
      } ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}
    >
      <div className="flex flex-col gap-1 pb-2 border-b border-border/50">
        <img src="/app_logo.png" alt="" className="h-10 w-10 mx-2" />
        {name && (
          <p className="text-sm text-muted-foreground px-2">
            {t("nav.hello", { name })}
          </p>
        )}
      </div>

      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition text-start w-full ${
                isActive ? "bg-primary/30 font-semibold" : "hover:bg-primary/20"
              }`
            }
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        );
      })}

      <div className="mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded hover:bg-destructive/20 transition text-destructive w-full text-start"
            >
              <LogOut size={20} />
              <span>{t("nav.logout")}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("nav.logoutConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("nav.logoutConfirmDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("nav.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("nav.logoutConfirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
