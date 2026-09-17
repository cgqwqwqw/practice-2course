import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usersService } from "@/services/users.service";
import type { UpdateProfileRequest } from "@/types/api";

export function useProfile() {
  return useQuery({ queryKey: ["me"], queryFn: usersService.getMe });
}

export function useExamHistory() {
  return useQuery({ queryKey: ["exam-history"], queryFn: usersService.getExamHistory });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => usersService.updateMe(data),
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      toast.success("Профиль обновлён");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
