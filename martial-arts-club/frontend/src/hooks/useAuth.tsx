import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { tokenStorage, userStorage } from "@/api/storage";
import type { Role, UserResponse } from "@/types/api";

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (...roles: Role[]) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_EVENT = "mc:auth-changed";

/** Сохранить сессию после login/register */
export function saveSession(token: string, user: UserResponse) {
  tokenStorage.setToken(token);
  userStorage.setUser(user);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [storedUser, setStoredUser] = useState<UserResponse | null>(() =>
    userStorage.getUser()
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const hasToken = Boolean(tokenStorage.getToken());
  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: usersService.getMe,
    enabled: hasToken,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data) {
      userStorage.setUser(meQuery.data);
      setStoredUser(meQuery.data);
    }
  }, [meQuery.data]);

  useEffect(() => {
    if (meQuery.isError && hasToken) {
      tokenStorage.clear();
      setStoredUser(null);
    }
  }, [meQuery.isError, hasToken]);

  useEffect(() => {
    const handler = () => setStoredUser(userStorage.getUser());
    window.addEventListener(AUTH_EVENT, handler);
    return () => window.removeEventListener(AUTH_EVENT, handler);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setStoredUser(null);
    queryClient.clear();
    navigate("/login");
  }, [navigate, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: storedUser,
      isLoading: hasToken && meQuery.isLoading,
      isAuthenticated: Boolean(storedUser && tokenStorage.getToken()),
      hasRole: (...roles: Role[]) => Boolean(storedUser && roles.includes(storedUser.role)),
      logout,
    }),
    [storedUser, hasToken, meQuery.isLoading, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth должен использоваться внутри AuthProvider");
  return ctx;
}
