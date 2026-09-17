import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useSessions, useCreateSession, useUpdateSession, useCancelSession } from "@/hooks/useSessions";
import { useRoster, useMarkAttendance } from "@/hooks/useAttendance";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { Modal } from "@/components/Modal";
import { formatDateTime } from "@/utils/format";
import type { SessionResponse } from "@/types/api";

const sessionSchema = z
  .object({
    title: z.string().min(2).max(150),
    startsAt: z.string().min(1, "Укажите дату и время"),
    endsAt: z.string().min(1, "Укажите дату и время"),
    capacity: z.coerce.number().int().min(1),
    description: z.string().max(500).optional(),
  })
  .refine((d) => new Date(d.endsAt) > new Date(d.startsAt), {
    message: "Конец должен быть позже начала",
    path: ["endsAt"],
  });
type SessionFormData = z.infer<typeof sessionSchema>;

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TrainerSessionsPage() {
  const { user } = useAuth();
  const sessions = useSessions();
  const create = useCreateSession();
  const update = useUpdateSession();
  const cancel = useCancelSession();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SessionResponse | null>(null);
  const [rosterFor, setRosterFor] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SessionFormData>({ resolver: zodResolver(sessionSchema) });

  const openCreate = () => {
    setEditing(null);
    reset({ title: "", startsAt: "", endsAt: "", capacity: 15, description: "" });
    setModalOpen(true);
  };

  const openEdit = (s: SessionResponse) => {
    setEditing(s);
    reset({
      title: s.title,
      startsAt: toLocalInput(s.startsAt),
      endsAt: toLocalInput(s.endsAt),
      capacity: s.capacity,
      description: s.description ?? "",
    });
    setModalOpen(true);
  };

  const onSubmit = (data: SessionFormData) => {
    const payload = {
      ...data,
      startsAt: new Date(data.startsAt).toISOString(),
      endsAt: new Date(data.endsAt).toISOString(),
    };
    if (editing) {
      update.mutate(
        { id: editing.id, data: payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      create.mutate(
        { ...payload, trainerId: user!.id },
        { onSuccess: () => setModalOpen(false) }
      );
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px]">Управление занятиями</h1>
          <p className="mt-1 text-[13px] text-ink/50">Создание, редактирование и отмена тренировок</p>
        </div>
        <button className="btn btn-dark btn-sm" onClick={openCreate}>+ Новая тренировка</button>
      </div>

      {sessions.isLoading && <Loader />}
      {sessions.isError && <ErrorState message={sessions.error.message} onRetry={() => sessions.refetch()} />}
      {sessions.isSuccess && sessions.data.length === 0 && <EmptyState message="Тренировок пока нет." />}

      <div className="flex flex-col gap-4">
        {sessions.data?.map((s) => (
          <div key={s.id} className={`panel ${s.cancelled ? "opacity-50" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-sans text-[15px] font-bold">
                  {s.title} {s.cancelled && <span className="badge badge-red ml-2">Отменена</span>}
                </h3>
                <p className="mt-1 font-mono text-xs text-ink/50">
                  {formatDateTime(s.startsAt)} · {s.bookedCount}/{s.capacity} записано
                </p>
                {s.description && <p className="mt-2 text-[13px] text-ink/60">{s.description}</p>}
              </div>
              {!s.cancelled && (
                <div className="flex gap-2">
                  <button className="btn btn-ghost btn-sm" onClick={() => setRosterFor(s.id)}>
                    Посещаемость
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>
                    Изменить
                  </button>
                  <button
                    className="btn btn-sm border border-vermilion/40 text-vermilion hover:bg-vermilion/10"
                    disabled={cancel.isPending}
                    onClick={() => cancel.mutate(s.id)}
                  >
                    Отменить
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Изменить тренировку" : "Новая тренировка"}
        footer={
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>Отмена</button>
            <button className="btn btn-primary btn-sm" form="session-form" type="submit" disabled={create.isPending || update.isPending}>
              {editing ? "Сохранить" : "Создать"}
            </button>
          </>
        }
      >
        <form id="session-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div className="field sm:col-span-2">
            <label>Название</label>
            <input placeholder="Тренировка Карате (Основная)" {...register("title")} />
            {errors.title && <span className="field-error">{errors.title.message}</span>}
          </div>
          <div className="field">
            <label>Начало</label>
            <input type="datetime-local" {...register("startsAt")} />
            {errors.startsAt && <span className="field-error">{errors.startsAt.message}</span>}
          </div>
          <div className="field">
            <label>Конец</label>
            <input type="datetime-local" {...register("endsAt")} />
            {errors.endsAt && <span className="field-error">{errors.endsAt.message}</span>}
          </div>
          <div className="field">
            <label>Вместимость</label>
            <input type="number" min={1} {...register("capacity")} />
            {errors.capacity && <span className="field-error">{errors.capacity.message}</span>}
          </div>
          <div className="field sm:col-span-2">
            <label>Описание</label>
            <textarea placeholder="Отработка базовой техники и ката" {...register("description")} />
          </div>
        </form>
      </Modal>

      <AttendanceModal sessionId={rosterFor} onClose={() => setRosterFor(null)} />
    </div>
  );
}

function AttendanceModal({ sessionId, onClose }: { sessionId: number | null; onClose: () => void }) {
  const roster = useRoster(sessionId);
  const mark = useMarkAttendance();

  return (
    <Modal
      open={sessionId !== null}
      onClose={onClose}
      title="Посещаемость занятия"
      footer={<button className="btn btn-dark btn-sm" onClick={onClose}>Готово</button>}
    >
      {roster.isLoading && <Loader />}
      {roster.isSuccess && roster.data.length === 0 && <EmptyState message="Записанных учеников нет." />}
      {roster.isSuccess && roster.data.length > 0 && (
        <div className="flex flex-col gap-2">
          {roster.data.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center justify-between gap-3 border-b border-ink/5 pb-2 last:border-0">
              <span className="text-sm">{b.userFullName}</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-vermilion"
                checked={b.status === "ATTENDED"}
                disabled={mark.isPending || b.status === "CANCELLED"}
                onChange={(e) => mark.mutate({ bookingId: b.id, attended: e.target.checked })}
              />
            </label>
          ))}
        </div>
      )}
    </Modal>
  );
}
