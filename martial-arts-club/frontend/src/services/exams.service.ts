import { api } from "@/api/client";
import type { CreateExamRequest, ExamResponse } from "@/types/api";

export const examsService = {
  listAll: async (): Promise<ExamResponse[]> =>
    (await api.get<ExamResponse[]>("/exams")).data,
  create: async (data: CreateExamRequest): Promise<ExamResponse> =>
    (await api.post<ExamResponse>("/exams", data)).data,
};
