import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { CalendarDays, CreditCard, ScrollText, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/api";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const NAV: NavItem[] = [
  { to: "/schedule", label: "Расписание", icon: <CalendarDays size={15} />, roles: ["CLIENT", "TRAINER", "ADMIN"] },
  { to: "/bookings", label: "Мои записи", icon: <ScrollText size={15} />, roles: ["CLIENT", "TRAINER", "ADMIN"] },
  { to: "/plans", label: "Абонементы", icon: <CreditCard size={15} />, roles: ["CLIENT", "TRAINER", "ADMIN"] },
  { to: "/profile", label: "Профиль и пояса", icon: <UserRound size={15} />, roles: ["CLIENT", "TRAINER", "ADMIN"] },
  { to: "/trainer/sessions", label: "Управление занятиями", icon: <CalendarDays size={15} />, roles: ["TRAINER", "ADMIN"] },
  { to: "/exams", label: "Аттестации", icon: <ShieldCheck size={15} />, roles: ["TRAINER", "ADMIN"] },
  { to: "/admin/plans", label: "Тарифы (админ)", icon: <CreditCard size={15} />, roles: ["ADMIN"] },
];

export function AppLayout() {
  const { user, hasRole, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV.filter((i) => hasRole(...i.roles));

  return (
    <div className="grid min-h-screen bg-paper text-ink md:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 flex h-auto flex-col bg-ink p-5 text-paper md:h-screen">
        <button
          onClick={() => navigate("/schedule")}
          className="mb-10 flex items-center gap-3 text-left font-display text-lg font-semibold"
        >
          <span className="flex h-[34px] w-[34px] rotate-45 items-center justify-center border-[1.5px] border-vermilion text-sm font-extrabold text-vermilion">
            <span className="-rotate-45">武</span>
          </span>
          БУДОКАН
        </button>

        <nav className="flex flex-1 flex-col gap-0.5">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3.5 py-[11px] text-[13.5px] transition-colors ${
                  isActive
                    ? "bg-vermilion text-paper"
                    : "text-paper/60 hover:bg-paper/5 hover:text-paper"
                }`
              }
            >
              <span className="opacity-80">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div className="mt-4 flex items-center gap-3 border-t border-paper/10 pt-4">
            <div className="h-[34px] w-[34px] bg-gradient-to-br from-gold to-vermilion" />
            <div className="min-w-0 flex-1">
              <b className="block truncate text-xs">{user.fullName}</b>
              <span className="text-[11px] text-paper/45">{user.role}</span>
            </div>
            <button
              onClick={logout}
              className="text-[11px] text-paper/50 underline-offset-2 hover:text-paper hover:underline"
            >
              Выйти
            </button>
          </div>
        )}
      </aside>

      <main className="px-6 py-8 md:px-10 md:pb-20">
        <Outlet />
      </main>
    </div>
  );
}
