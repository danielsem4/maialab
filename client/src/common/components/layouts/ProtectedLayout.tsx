import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useNavItems } from "@/hooks/common/useNavItems";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionUser } from "@/hooks/common/useSessionUser";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedLayout() {
  const userId = useAuthStore((s) => s.userId);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const menuItems = useNavItems();
  useSessionUser(Boolean(userId));

  if (!userId) return <Navigate to="/login" replace />;

  const handleToggleSidebar = () => {
    setSidebarOpen((p) => !p);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" open={sidebarOpen} menuItems={menuItems} />
      <SidebarInset
        className={`flex-1 h-svh overflow-hidden transition-all duration-300 ${
          sidebarOpen && !isMobile ? "ms-72" : "ms-0"
        }`}
      >
        <SiteHeader onToggleSidebar={handleToggleSidebar} />
        <div className="flex-1 min-h-0 bg-background overflow-auto transition-all duration-300">
          <div className="mx-auto max-w-6xl p-4 sm:p-6">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
