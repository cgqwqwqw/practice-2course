import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { plansService } from "@/services/plans.service";
import type { CreatePlanRequest, UpdatePlanRequest } from "@/types/api";

export function usePlans() {
  return useQuery({ queryKey: ["plans"], queryFn: plansService.list });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanRequest) => plansService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Тариф создан");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlanRequest }) =>
      plansService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Тариф обновлён");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plansService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("Тариф деактивирован");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
