import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { useRegister } from "@/hooks/useAuthQueries";

const maxDate = new Date().toISOString().split("T")[0];

const schema = z.object({
  fullName: z.string().min(2, "Введите ФИО").max(150),
  email: z.string().email("Введите корректный email"),
  birthDate: z
    .string()
    .min(1, "Укажите дату рождения")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Некорректная дата",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "Дата рождения не может быть в будущем",
    })
    .refine((val) => {
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      return new Date(val) >= minDate;
    }, {
      message: "Укажите корректный год",
    }),
  password: z.string().min(8, "Минимум 8 символов").max(100),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const registerMut = useRegister();
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const birthDateRegister = register("birthDate");

  return (
    <AuthLayout>
      <div className="mb-7 flex gap-1 border-b border-paper/10">
        <Link to="/login" className="-mb-px border-b-2 border-transparent px-[18px] py-3 text-sm text-paper/50 hover:text-paper">
          Вход
        </Link>
        <Link to="/register" className="-mb-px border-b-2 border-vermilion px-[18px] py-3 text-sm font-semibold text-vermilion">
          Регистрация
        </Link>
      </div>
      <h2 className="mb-2 font-display text-[26px]">Создать аккаунт</h2>
      <p className="mb-7 text-sm text-paper/60">Регистрация ученика (роль CLIENT).</p>

      <form onSubmit={handleSubmit((d) => registerMut.mutate(d))} className="flex flex-col gap-4">
        <div className="flex flex-col gap-[7px]">
          <label className="label-dark">ФИО</label>
          <input className="input-dark" placeholder="Иванов Иван Иванович" {...register("fullName")} />
          {errors.fullName && <span className="text-xs font-medium text-vermilion-bright">{errors.fullName.message}</span>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-[7px]">
            <label className="label-dark">Дата рождения</label>
            <input
              type="date"
              max={maxDate}
              className={`input-dark cursor-pointer [color-scheme:dark] ${errors.birthDate ? "border-vermilion" : ""}`}
              {...birthDateRegister}
              onClick={(e) => {
                // При клике на любое место инпута программно открываем календарь
                try {
                  e.currentTarget.showPicker();
                } catch {
                  // Игнорируем, если браузер не поддерживает showPicker()
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val && val > maxDate) {
                  e.target.value = maxDate;
                  setValue("birthDate", maxDate, { shouldValidate: true });
                } else {
                  birthDateRegister.onChange(e);
                }
              }}
              onBlur={(e) => {
                birthDateRegister.onBlur(e);
                trigger("birthDate");
              }}
            />
            {errors.birthDate && (
              <span className="text-xs font-medium text-vermilion-bright">
                {errors.birthDate.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[7px]">
            <label className="label-dark">Email</label>
            <input type="email" className="input-dark" placeholder="you@example.com" {...register("email")} />
            {errors.email && <span className="text-xs font-medium text-vermilion-bright">{errors.email.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-[7px]">
          <label className="label-dark">Пароль</label>
          <input type="password" className="input-dark" placeholder="Минимум 8 символов" {...register("password")} />
          {errors.password && <span className="text-xs font-medium text-vermilion-bright">{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-2" disabled={registerMut.isPending}>
          {registerMut.isPending ? "Создаём…" : "Создать аккаунт"}
        </button>
      </form>
    </AuthLayout>
  );
}