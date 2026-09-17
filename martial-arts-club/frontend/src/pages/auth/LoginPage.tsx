import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useLogin } from "@/hooks/useAuthQueries";

const schema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <AuthLayout>
      <div className="mb-7 flex gap-1 border-b border-paper/10">
        <Link to="/login" className="-mb-px border-b-2 border-vermilion px-[18px] py-3 text-sm font-semibold text-vermilion">
          Вход
        </Link>
        <Link to="/register" className="-mb-px border-b-2 border-transparent px-[18px] py-3 text-sm text-paper/50 hover:text-paper">
          Регистрация
        </Link>
      </div>
      <h2 className="mb-2 font-display text-[26px]">С возвращением</h2>
      <p className="mb-7 text-sm text-paper/60">Войдите, чтобы управлять записями и абонементом.</p>

      <form onSubmit={handleSubmit((d) => login.mutate(d))} className="flex flex-col gap-4">
        <div className="flex flex-col gap-[7px]">
          <label className="label-dark">Email</label>
          <input type="email" className="input-dark" placeholder="you@example.com" {...register("email")} />
          {errors.email && <span className="text-xs font-medium text-vermilion-bright">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-[7px]">
          <label className="label-dark">Пароль</label>
          <input type="password" className="input-dark" placeholder="••••••••" {...register("password")} />
          {errors.password && <span className="text-xs font-medium text-vermilion-bright">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-block mt-2" disabled={login.isPending}>
          {login.isPending ? "Входим…" : "Войти в личный кабинет"}
        </button>
      </form>
    </AuthLayout>
  );
}
