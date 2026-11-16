import api from "@/lib/axios";
import type { IAuthUser } from "@/common/types/User";

export interface ILoginResult {
  requiresOtp: true;
  otpToken: string;
  email: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<ILoginResult> {
    const { data } = await api.post<ILoginResult>("/auth/login", { email, password });
    return data;
  },

  async me(): Promise<IAuthUser> {
    const { data } = await api.get<{ user: IAuthUser }>("/auth/me");
    return data.user;
  },

  async verifyOtp(otpToken: string, code: string): Promise<IAuthUser> {
    const { data } = await api.post<{ user: IAuthUser }>("/auth/verify-otp", { otpToken, code });
    return data.user;
  },
};
