import { api } from "@/api/client";
import type { ExamEntryResponse, UpdateProfileRequest, UserResponse } from "@/types/api";

export const usersService = {
  getMe: async (): Promise<UserResponse> => (await api.get<UserResponse>("/users/me")).data,
  updateMe: async (data: UpdateProfileRequest): Promise<UserResponse> =>
    (await api.put<UserResponse>("/users/me", data)).data,
  getExamHistory: async (): Promise<ExamEntryResponse[]> =>
    (await api.get<ExamEntryResponse[]>("/users/me/exam-history")).data,
};
