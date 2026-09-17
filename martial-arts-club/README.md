# Клуб восточных единоборств — микросервисная платформа

Учебное веб-приложение для клуба восточных единоборств: запись на тренировки,
абонементы с онлайн-оплатой, аттестации на пояса, рейтинги тренеров.

## Архитектура

```
                        ┌──────────────────────────┐
   клиент (Swagger/curl)│     API Gateway :8080    │
                        └────────────┬─────────────┘
        ┌──────────────┬───────────┼───────────────┬─────────────────┐
        ▼              ▼           ▼               ▼                 ▼
  auth-service   profile-service  schedule-service  subscription-service  progress-service
      :8081           :8082           :8083             :8084                :8085
        │               │               │                 │                    │
        └─────── Keycloak (realm martial-arts) ──────────┘
                        │
        ┌───────────────┴────────────────┐
        ▼                                ▼
   PostgreSQL 16                     Kafka 3.7
   profile_db / schedule_db          topics:
   subscription_db / progress_db     users, bookings, belts, subscriptions
```

Взаимодействие между сервисами:
- **синхронное** — все вызовы идут через API Gateway, JWT проверяется каждым сервисом (Keycloak, OAuth2 Resource Server);
- **асинхронное (Kafka)**:
  - `users` — auth-service → profile-service (создание профиля при регистрации);
  - `bookings` — schedule-service → progress-service (история посещений);
  - `belts` — progress-service → profile-service (обновление пояса после сдачи экзамена);
  - `subscriptions` — subscription-service (событие покупки абонемента).

## Стек

JDK 17 (Eclipse Temurin), Spring Boot 3.2, Spring Cloud Gateway, Spring Data JPA,
Spring Security OAuth2 Resource Server, Keycloak 24 (OIDC), PostgreSQL 16,
Apache Kafka 3.7, Swagger (springdoc-openapi), Docker.

## Запуск

Требования: Docker и Docker Compose v2, минимум ~4 ГБ свободной RAM, доступ в интернет
(образы и зависимости Maven скачиваются при первой сборке).

```bash
# из корня проекта
docker compose up --build -d

# посмотреть логи
docker compose logs -f
```

Первая сборка занимает 5–15 минут (Maven скачивает зависимости внутри контейнеров).
Готовность сервисов: `curl http://localhost:8080/actuator/health`, `curl http://localhost:8180/health/ready`.

Остановка: `docker compose down` (данные PostgreSQL сохраняются в volume;
полный сброс: `docker compose down -v`).

## Предустановленные учётные записи (Keycloak realm martial-arts)

| Логин     | Пароль      | Роль  |
|-----------|-------------|-------|
| admin     | admin123    | ADMIN |
| coach1    | coach123    | COACH |
| client1   | client123   | USER  |

Консоль Keycloak: http://localhost:8180 (admin / admin).

## Swagger UI

Эндпоинты задокументированы через OpenAPI/Swagger; авторизация — кнопка **Authorize**, схема `bearerAuth` (токен без слова `Bearer`).

| Сервис              | Swagger UI                              |
|---------------------|-----------------------------------------|
| Auth Service        | http://localhost:8081/swagger-ui.html   |
| Profile Service     | http://localhost:8082/swagger-ui.html   |
| Schedule Service    | http://localhost:8083/swagger-ui.html   |
| Subscription Service| http://localhost:8084/swagger-ui.html   |
| Progress Service    | http://localhost:8085/swagger-ui.html   |

Все API также доступны через Gateway: `http://localhost:8080/api/...`

## Типовой сценарий (проверка работоспособности)

```bash
# 1. Получить токен ученика
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"client1","password":"client123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")

# 2. Профиль (создаётся автоматически через Kafka после регистрации)
curl -s http://localhost:8080/api/profiles/me -H "Authorization: Bearer $TOKEN"

# 3. Тарифы и покупка абонемента с промокодом
curl -s http://localhost:8080/api/plans -H "Authorization: Bearer $TOKEN"
curl -s -X POST http://localhost:8080/api/subscriptions \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"planId":2,"promoCode":"WELCOME10","cardNumber":"4276123456789012"}'

# 4. Тренер создаёт тренировку
CTOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"coach1","password":"coach123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
curl -s -X POST http://localhost:8080/api/schedule \
  -H "Authorization: Bearer $CTOKEN" -H "Content-Type: application/json" \
  -d '{"style":"Каратэ","hall":"Зал №1","startTime":"2026-09-20T18:00:00","endTime":"2026-09-20T19:30:00","capacity":12,"type":"GROUP"}'

# 5. Ученик записывается, тренер отмечает посещение
curl -s -X POST http://localhost:8080/api/bookings \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"sessionId":1}'
curl -s -X POST http://localhost:8080/api/bookings/1/attendance \
  -H "Authorization: Bearer $CTOKEN" -H "Content-Type: application/json" -d '{"attended":true}'

# 6. Аттестация: заявка -> результат PASSED -> пояс обновился в профиле (Kafka)
USER_ID=$(curl -s http://localhost:8080/api/profiles/me -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json;print(json.load(sys.stdin)['id'])")
curl -s -X POST http://localhost:8080/api/progress/exams \
  -H "Authorization: Bearer $CTOKEN" -H "Content-Type: application/json" \
  -d "{"userId":"$USER_ID","userName":"Сергей Сидоров","beltFrom":"10 кю","beltTo":"9 кю"}"
curl -s -X PATCH http://localhost:8080/api/progress/exams/1/result \
  -H "Authorization: Bearer $CTOKEN" -H "Content-Type: application/json" \
  -d '{"status":"PASSED","grade":9,"notes":"Хорошая техника"}'

# 7. Отзыв тренеру
curl -s -X POST http://localhost:8080/api/progress/reviews \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{"coachId":"<UUID тренера из /api/profiles/coaches>","rating":5,"comment":"Отличный тренер!"}"

# 8. Аналитика продаж (админ)
ATOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
curl -s http://localhost:8080/api/admin/analytics/sales -H "Authorization: Bearer $ATOKEN"
```

Регистрация нового пользователя: `POST /api/auth/register`
(`{"username":"...","password":"...","firstName":"...","lastName":"...","email":"...","role":"USER"}`).

## Структура репозитория

```
├── docker-compose.yml          # вся инфраструктура и сервисы
├── keycloak/realm-export.json  # realm, клиенты, роли, пользователи
├── postgres/init.sql           # создание баз данных
├── api-gateway/                # Spring Cloud Gateway (маршрутизация)
├── auth-service/               # регистрация + логин через Keycloak Admin API
├── profile-service/            # профили, пояса (консьюмер Kafka: users, belts)
├── schedule-service/           # расписание, запись, посещаемость (продюсер: bookings)
├── subscription-service/       # тарифы, оплата, промокоды, аналитика
└── progress-service/           # аттестации, отзывы, посещения (продюсер: belts, консьюмер: bookings)
```
