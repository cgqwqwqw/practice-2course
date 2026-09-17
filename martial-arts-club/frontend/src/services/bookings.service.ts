import { api } from "@/api/client";
import type { BookingResponse, CreateBookingRequest } from "@/types/api";

export const bookingsService = {
  book: async (data: CreateBookingRequest): Promise<BookingResponse> =>
    (await api.post<BookingResponse>("/bookings", data)).data,
  listMine: async (): Promise<BookingResponse[]> =>
    (await api.get<BookingResponse[]>("/bookings/me")).data,
  cancel: async (id: number): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};
