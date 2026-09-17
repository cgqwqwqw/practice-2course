import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { attendanceService } from "@/services/attendance.service";

export function useRoster(sessionId: number | null) {
  return useQuery({
    queryKey: ["attendance", "roster", sessionId],
    queryFn: () => attendanceService.roster(sessionId!),
    enabled: sessionId !== null,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, attended }: { bookingId: number; attended: boolean }) =>
      attendanceService.mark({ bookingId, attended }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
