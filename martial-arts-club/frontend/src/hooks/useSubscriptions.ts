import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { subscriptionsService } from "@/services/subscriptions.service";

export function useMySubscriptions() {
  return useQuery({
    queryKey: ["subscriptions", "mine"],
    queryFn: subscriptionsService.listMine,
  });
}

export function usePurchaseSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => subscriptionsService.purchase({ planId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Абонемент активирован. Оплата эмулирована.");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
