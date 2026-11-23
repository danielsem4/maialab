import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authApi } from "@/api/authApi";
import { getApiErrorStatus } from "@/common/utils/apiError";
import type { IAuthUser } from "@/common/types/User";
import { useAuthStore } from "@/store/useAuthStore";
import { credentialsSchema, type CredentialsValues } from "../schema/loginSchema";

interface OtpChallenge {
  otpToken: string;
  email: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const setAuthUser = useAuthStore((s) => s.setAuthUser);
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [code, setCode] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const form = useForm<CredentialsValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: "", password: "" },
  });

  const completeLogin = (user: IAuthUser) => {
    setAuthUser(user);
    navigate("/admin", { replace: true });
  };

  const login = useMutation({
    mutationFn: (values: CredentialsValues) => authApi.login(values.email, values.password),
    onSuccess: (result) => {
      setErrorKey(null);
      if (!result.requiresOtp) {
        completeLogin(result.user);
        return;
      }
      setChallenge({ otpToken: result.otpToken, email: result.email });
    },
    onError: (error) => {
      setErrorKey(getApiErrorStatus(error) === 401 ? "login.invalidCredentials" : "common.errorGeneric");
    },
  });

  const verify = useMutation({
    mutationFn: (otp: string) => authApi.verifyOtp(challenge!.otpToken, otp),
    onSuccess: completeLogin,
    onError: (error) => {
      setCode("");
      setErrorKey(getApiErrorStatus(error) === 401 ? "login.invalidCode" : "common.errorGeneric");
    },
  });

  const handleCredentialsSubmit = form.handleSubmit((values) => login.mutate(values));

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6) verify.mutate(value);
  };

  const handleCodeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (code.length === 6) verify.mutate(code);
    else setErrorKey("validation.codeLength");
  };

  const handleStartOver = () => {
    setChallenge(null);
    setCode("");
    setErrorKey(null);
  };

  return {
    form,
    challenge,
    code,
    errorKey,
    isSubmitting: login.isPending,
    isVerifying: verify.isPending,
    handleCredentialsSubmit,
    handleCodeChange,
    handleCodeSubmit,
    handleStartOver,
  };
}
