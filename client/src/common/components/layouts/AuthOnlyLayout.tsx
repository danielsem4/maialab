import { Navigate, Outlet } from "react-router-dom";
import { useSessionUser } from "@/hooks/common/useSessionUser";
import { useAuthStore } from "@/store/useAuthStore";

/** Same guard as ProtectedLayout, without the sidebar and header: for full-screen tools. */
export default function AuthOnlyLayout() {
  const userId = useAuthStore((s) => s.userId);
  useSessionUser(Boolean(userId));

  if (!userId) return <Navigate to="/login" replace />;

  return (
    <div className="h-svh overflow-hidden bg-background">
      <Outlet />
    </div>
  );
}
