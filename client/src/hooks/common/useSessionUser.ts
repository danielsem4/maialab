import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Confirms the cookie session when the admin shell mounts and restores the
 * user's name (only id/role are persisted). A 401 is handled by the axios interceptor.
 */
export function useSessionUser(enabled: boolean) {
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const { data } = useQuery({ queryKey: ["auth", "me"], queryFn: authApi.me, enabled, retry: false });

  useEffect(() => {
    if (data) setAuthUser(data);
  }, [data, setAuthUser]);
}
