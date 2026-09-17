import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings.service";

export function useMyBookings() {
  return useQuery({ queryKey: ["bookings", "mine"], queryFn: bookingsService.listMine });
}

export function useBookSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: number) => bookingsService.book({ sessionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Запись подтверждена");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: number) => bookingsService.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Запись отменена, занятие возвращено в абонемент");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
