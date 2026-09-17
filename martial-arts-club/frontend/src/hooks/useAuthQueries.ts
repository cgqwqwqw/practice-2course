import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { saveSession } from "@/hooks/useAuth";
import type { LoginRequest, RegisterRequest } from "@/types/api";

function homeFor(role: string): string {
  if (role === "ADMIN") return "/admin/plans";
  if (role === "TRAINER") return "/trainer/sessions";
  return "/schedule";
}

export function useLogin() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      saveSession(data.token, data.user);
      toast.success(`С возвращением, ${data.user.fullName}!`);
      navigate(homeFor(data.user.role), { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      saveSession(data.token, data.user);
      toast.success("Аккаунт создан. Добро пожаловать в клуб!");
      navigate("/schedule", { replace: true });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
