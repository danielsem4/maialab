import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { IAuthUser } from "@/common/types/User";

interface AuthStore {
  userId: string | null;
  name: string | null;
  role: string | null;
  setAuthUser: (user: IAuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      name: null,
      role: null,
      setAuthUser: (user: IAuthUser) =>
        set({ userId: user.id, name: user.name, role: user.role }),
      logout: () => set({ userId: null, name: null, role: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userId: state.userId,
        role: state.role,
      }),
    },
  ),
);
