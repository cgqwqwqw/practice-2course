import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sessionsService } from "@/services/sessions.service";
import type { CreateSessionRequest, UpdateSessionRequest } from "@/types/api";

export function useSessions() {
  return useQuery({ queryKey: ["sessions"], queryFn: sessionsService.listUpcoming });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSessionRequest) => sessionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Тренировка создана");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSessionRequest }) =>
      sessionsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Тренировка обновлена");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCancelSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Тренировка отменена");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
