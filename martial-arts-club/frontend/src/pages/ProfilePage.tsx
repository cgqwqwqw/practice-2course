import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfile, useUpdateProfile, useExamHistory } from "@/hooks/useUsers";
import { BeltBadge } from "@/components/BeltBadge";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { formatDate } from "@/utils/format";

const schema = z.object({
  fullName: z.string().min(2).max(150),
  birthDate: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function ProfilePage() {
  const profile = useProfile();
  const update = useUpdateProfile();
  const exams = useExamHistory();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      fullName: profile.data?.fullName ?? "",
      birthDate: profile.data?.birthDate ?? "",
    },
  });

  if (profile.isLoading) return <Loader />;
  if (profile.isError || !profile.data) return <ErrorState message={profile.error?.message ?? "Не удалось загрузить профиль"} onRetry={() => profile.refetch()} />;
  const user = profile.data;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <div>
        <h1 className="font-display text-[26px]">Профиль</h1>
        <p className="mt-1 text-[13px] text-ink/50">{user.email} · роль {user.role}</p>
      </div>

      <div className="panel">
        <h3 className="mb-4 text-base font-bold">Личные данные</h3>
        <form onSubmit={handleSubmit((d) => update.mutate(d))} className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label>ФИО</label>
            <input {...register("fullName")} />
            {errors.fullName && <span className="field-error">{errors.fullName.message}</span>}
          </div>
          <div className="field">
            <label>Дата рождения</label>
            <input type="date" {...register("birthDate")} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-dark" disabled={update.isPending}>
              {update.isPending ? "Сохраняем…" : "Сохранить изменения"}
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <h3 className="mb-1 text-base font-bold">Текущий пояс</h3>
        <div className="panel-sub text-[12.5px] text-ink/50">Статус ученика в системе кю/дан</div>
        <BeltBadge belt={user.currentBelt} />
      </div>

      <div className="panel">
        <h3 className="mb-1 text-base font-bold">История аттестаций</h3>
        <div className="panel-sub text-[12.5px] text-ink/50">Сданные экзамены на пояса</div>
        {exams.isLoading && <Loader />}
        {exams.isSuccess && exams.data.length === 0 && <EmptyState message="Экзаменов пока не было." />}
        {exams.isSuccess && exams.data.length > 0 && (
          <div className="flex flex-col gap-3">
            {exams.data.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-3 border-b border-ink/5 pb-3 text-sm last:border-0 last:pb-0">
                <span className={`badge ${e.result === "PASSED" ? "badge-green" : "badge-red"}`}>
                  {e.result === "PASSED" ? "Сдано" : "Не сдано"}
                </span>
                {e.awardedBelt && <BeltBadge belt={e.awardedBelt} />}
                {e.comment && <span className="text-ink/60">{e.comment}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
