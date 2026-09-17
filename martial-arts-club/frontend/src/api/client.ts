import axios, { AxiosError } from "axios";
import { ApiError } from "@/types/api";
import { tokenStorage } from "./storage";

export const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Подстановка Bearer-токена
api.interceptors.request.use((config) => {
  const token = tokenStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Нормализация ошибок + обработка 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data as
      | { message?: string; error?: string }
      | undefined;
    const message =
      body?.message ?? body?.error ?? defaultMessage(status);

    if (status === 401) {
      tokenStorage.clear();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(new ApiError(status, message));
  }
);

function defaultMessage(status: number): string {
  switch (status) {
    case 400:
      return "Некорректный запрос. Проверьте введённые данные.";
    case 401:
      return "Требуется авторизация.";
    case 403:
      return "Недостаточно прав для этого действия.";
    case 404:
      return "Запрашиваемый ресурс не найден.";
    case 409:
      return "Конфликт: действие уже невозможно (например, повторная запись).";
    case 500:
      return "Ошибка сервера. Попробуйте позже.";
    default:
      return status === 0
        ? "Сервер недоступен. Проверьте подключение."
        : `Ошибка запроса (${status}).`;
  }
}
