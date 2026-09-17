import { api } from "@/api/client";
import type {
  CreateSessionRequest,
  SessionResponse,
  UpdateSessionRequest,
} from "@/types/api";

export const sessionsService = {
  listUpcoming: async (): Promise<SessionResponse[]> =>
    (await api.get<SessionResponse[]>("/sessions")).data,
  getById: async (id: number): Promise<SessionResponse> =>
    (await api.get<SessionResponse>(`/sessions/${id}`)).data,
  create: async (data: CreateSessionRequest): Promise<SessionResponse> =>
    (await api.post<SessionResponse>("/sessions", data)).data,
  update: async (id: number, data: UpdateSessionRequest): Promise<SessionResponse> =>
    (await api.put<SessionResponse>(`/sessions/${id}`, data)).data,
  cancel: async (id: number): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
