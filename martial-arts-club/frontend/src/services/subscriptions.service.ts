import { api } from "@/api/client";
import type { PurchaseRequest, UserSubscriptionResponse } from "@/types/api";

export const subscriptionsService = {
  listMine: async (): Promise<UserSubscriptionResponse[]> =>
    (await api.get<UserSubscriptionResponse[]>("/subscriptions")).data,
  purchase: async (data: PurchaseRequest): Promise<UserSubscriptionResponse> =>
    (await api.post<UserSubscriptionResponse>("/subscriptions", data)).data,
};
