# --- Этап 1: Сборка приложения (Build Stage) ---
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем манифесты зависимостей для эффективного кэширования слоев
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем продакшен-бандл (файлы создадутся в папке /app/dist)
RUN npm run build

# --- Этап 2: Раздача статики через Nginx (Production Stage) ---
FROM nginx:alpine

# Копируем собранную статику из первого этапа в директорию Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем пользовательский конфиг Nginx (для поддержки React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]