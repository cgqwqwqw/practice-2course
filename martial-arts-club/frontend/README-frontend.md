# Martial Club — SPA-фронтенд

React + TypeScript + Vite + TanStack Query + Axios + React Router v6 + RHF/Zod + Tailwind CSS.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
```

Vite проксирует `/api` → `http://localhost:8080` (см. `vite.config.ts`).

## Демо-доступ (backend)

- ADMIN: `admin@martialclub.local` / `Admin123!`

## Структура

```
src/
├── api/        # axios-клиент (интерцепторы Bearer + обработка 401), localStorage-хранилище
├── types/      # DTO из OpenAPI/Postman (api.ts) + ApiError
├── services/   # тонкие обёртки над эндпоинтами (auth, users, plans, sessions, bookings, attendance, exams, subscriptions)
├── hooks/      # AuthProvider/useAuth, React Query хуки (usePlans, useSessions, useBookings, ...)
├── components/ # AppLayout (сайдбар), ProtectedRoute, Modal, Loader, BeltBadge, ErrorState
├── pages/      # Landing, Login/Register, Schedule, Bookings, Plans, Profile, Trainer/Exams, Admin/Plans
├── routes/     # createBrowserRouter с вложенными ProtectedRoute по ролям
└── utils/      # форматирование дат и метаданные поясов
```

## Ролевая модель

| Роль    | Разделы |
|---------|---------|
| CLIENT  | Расписание, Мои записи, Абонементы, Профиль |
| TRAINER | + Управление занятиями, Посещаемость (модалка), Аттестации |
| ADMIN   | + CRUD тарифных планов |
