import { api } from "@/api/client";
import type { CreatePlanRequest, PlanResponse, UpdatePlanRequest } from "@/types/api";

export const plansService = {
  list: async (): Promise<PlanResponse[]> => (await api.get<PlanResponse[]>("/plans")).data,
  getById: async (id: number): Promise<PlanResponse> =>
    (await api.get<PlanResponse>(`/plans/${id}`)).data,
  create: async (data: CreatePlanRequest): Promise<PlanResponse> =>
    (await api.post<PlanResponse>("/plans", data)).data,
  update: async (id: number, data: UpdatePlanRequest): Promise<PlanResponse> =>
    (await api.put<PlanResponse>(`/plans/${id}`, data)).data,
  remove: async (id: number): Promise<void> => {
    await api.delete(`/plans/${id}`);
  },
};
