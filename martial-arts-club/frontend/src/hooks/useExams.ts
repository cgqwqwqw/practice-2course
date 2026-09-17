import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { examsService } from "@/services/exams.service";
import type { CreateExamRequest } from "@/types/api";

export function useExams() {
  return useQuery({ queryKey: ["exams"], queryFn: examsService.listAll });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateExamRequest) => examsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam-history"] });
      toast.success("Экзаменационная ведомость создана");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
