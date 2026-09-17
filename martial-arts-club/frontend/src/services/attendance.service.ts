import { api } from "@/api/client";
import type { AttendanceMarkRequest, BookingResponse } from "@/types/api";

export const attendanceService = {
  roster: async (sessionId: number): Promise<BookingResponse[]> =>
    (await api.get<BookingResponse[]>(`/attendance/sessions/${sessionId}`)).data,
  mark: async (data: AttendanceMarkRequest): Promise<BookingResponse> =>
    (await api.post<BookingResponse>("/attendance/mark", data)).data,
};
