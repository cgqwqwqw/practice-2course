// Типы, сгенерированные на основе OpenAPI / Postman-коллекции Martial Club API

export type Role = "CLIENT" | "TRAINER" | "ADMIN";

export type BeltLevel =
  | "WHITE" | "YELLOW" | "ORANGE" | "GREEN" | "BLUE"
  | "PURPLE" | "BROWN" | "BLACK_1_DAN" | "BLACK_2_DAN" | "BLACK_3_DAN";

export type BookingStatus = "BOOKED" | "CANCELLED" | "ATTENDED" | "NO_SHOW";
export type ExamResult = "PASSED" | "FAILED";

// ---- Auth ----
export interface RegisterRequest {
  email: string;
  password: string; // 8–100 символов
  fullName: string;
  birthDate?: string; // YYYY-MM-DD
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tokenType?: string;
  user: UserResponse;
}

// ---- Users ----
export interface UserResponse {
  id: number;
  email: string;
  fullName: string;
  birthDate?: string;
  role: Role;
  currentBelt: BeltLevel;
  active: boolean;
}

export interface UpdateProfileRequest {
  fullName?: string;
  birthDate?: string;
}

// ---- Subscription Plans ----
export interface PlanResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  sessionsCount: number;
  validityDays: number;
  active: boolean;
}

export interface CreatePlanRequest {
  name: string;
  description?: string;
  price: number;
  sessionsCount: number;
  validityDays: number;
}

export interface UpdatePlanRequest {
  name?: string;
  description?: string;
  price?: number;
  sessionsCount?: number;
  validityDays?: number;
  active?: boolean;
}

// ---- My Subscriptions ----
export interface PurchaseRequest {
  planId: number;
}

export interface UserSubscriptionResponse {
  id: number;
  planId: number;
  planName: string;
  sessionsLeft: number;
  purchasedAt: string;
  expiresAt: string;
  active: boolean;
}

// ---- Schedule / Sessions ----
export interface SessionResponse {
  id: number;
  title: string;
  trainerId: number;
  trainerName: string;
  startsAt: string; // ISO 8601
  endsAt: string;
  capacity: number;
  bookedCount: number;
  description?: string;
  cancelled: boolean;
}

export interface CreateSessionRequest {
  title: string;
  trainerId: number;
  startsAt: string;
  endsAt: string;
  capacity: number;
  description?: string;
}

export interface UpdateSessionRequest {
  title?: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
  description?: string;
  cancelled?: boolean;
}

// ---- Bookings ----
export interface CreateBookingRequest {
  sessionId: number;
}

export interface BookingResponse {
  id: number;
  sessionId: number;
  sessionTitle: string;
  sessionStartsAt: string;
  userId: number;
  userFullName: string;
  status: BookingStatus;
  createdAt: string;
}

// ---- Attendance ----
export interface AttendanceMarkRequest {
  bookingId: number;
  attended: boolean;
}

// ---- Exams ----
export interface ExamEntryRequest {
  studentId: number;
  result: ExamResult;
  awardedBelt?: BeltLevel; // обязателен при result === "PASSED"
  comment?: string;
}

export interface CreateExamRequest {
  title: string;
  examDate: string; // YYYY-MM-DD
  entries: ExamEntryRequest[];
}

export interface ExamEntryResponse {
  id: number;
  studentId: number;
  studentName: string;
  result: ExamResult;
  awardedBelt?: BeltLevel;
  comment?: string;
}

export interface ExamResponse {
  id: number;
  title: string;
  examDate: string;
  conductedById: number;
  conductedByName: string;
  entries: ExamEntryResponse[];
}

// ---- Ошибки API ----
export interface ApiErrorBody {
  status?: number;
  message?: string;
  errors?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  body?: ApiErrorBody;

  constructor(status: number, message: string, body?: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
