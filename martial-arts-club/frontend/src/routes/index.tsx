import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { SchedulePage } from "@/pages/SchedulePage";
import { BookingsPage } from "@/pages/BookingsPage";
import { PlansPage } from "@/pages/PlansPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { TrainerSessionsPage } from "@/pages/trainer/TrainerSessionsPage";
import { ExamsPage } from "@/pages/trainer/ExamsPage";
import { AdminPlansPage } from "@/pages/admin/AdminPlansPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Корневой лейаут, обеспечивающий AuthProvider для absolutly всех страниц приложения
function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        // Все защищённые маршруты внутри AppLayout (сайдбар + Outlet)
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: "schedule", element: <SchedulePage /> },
          { path: "bookings", element: <BookingsPage /> },
          { path: "plans", element: <PlansPage /> },
          { path: "profile", element: <ProfilePage /> },
          {
            element: <ProtectedRoute roles={["TRAINER", "ADMIN"]} />,
            children: [
              { path: "trainer/sessions", element: <TrainerSessionsPage /> },
              { path: "exams", element: <ExamsPage /> },
            ],
          },
          {
            element: <ProtectedRoute roles={["ADMIN"]} />,
            children: [{ path: "admin/plans", element: <AdminPlansPage /> }],
          },
          { path: "home", element: <Navigate to="/schedule" replace /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);