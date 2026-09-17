import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSessions } from "@/hooks/useSessions";
import { useMyBookings, useBookSession } from "@/hooks/useBookings";
import { useMySubscriptions } from "@/hooks/useSubscriptions";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { formatDateTime } from "@/utils/format";

export function SchedulePage() {
  const { user } = useAuth();
  const sessions = useSessions();
  const bookings = useMyBookings();
  const subscriptions = useMySubscriptions();
  const book = useBookSession();
  const [onlyMine, setOnlyMine] = useState(false);

  const bookedSessionIds = new Set(
    (bookings.data ?? [])
      .filter((b) => b.status === "BOOKED" && b.userId === user?.id)
      .map((b) => b.sessionId)
  );
  const hasActiveSubscription = (subscriptions.data ?? []).some(
    (s) => s.active && s.sessionsLeft > 0 && new Date(s.expiresAt) >= new Date()
  );

  const list = (sessions.data ?? []).filter((s) => (onlyMine ? bookedSessionIds.has(s.id) : true));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[26px]">Расписание занятий</h1>
          <p className="mt-1 text-[13px] text-ink/50">Предстоящие тренировки клуба</p>
        </div>
        <label className="flex cursor-pointer items-center gap-2.5 text-[13px]">
          <input type="checkbox" className="accent-vermilion" checked={onlyMine} onChange={(e) => setOnlyMine(e.target.checked)} />
          Только мои записи
        </label>
      </div>

      {!hasActiveSubscription && subscriptions.isSuccess && (
        <div className="mb-5 rounded-md border border-gold/40 bg-gold/10 px-4 py-3 text-[13px] text-ink/70">
          У вас нет активного абонемента — для записи на тренировку сначала оформите его в разделе «Абонементы».
        </div>
      )}

      {sessions.isLoading && <Loader />}
      {sessions.isError && <ErrorState message={sessions.error.message} onRetry={() => sessions.refetch()} />}
      {sessions.isSuccess && list.length === 0 && (
        <EmptyState message={onlyMine ? "У вас пока нет записей на тренировки." : "Предстоящих тренировок пока нет."} />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {list.map((s) => {
          const isBooked = bookedSessionIds.has(s.id);
          const full = s.bookedCount >= s.capacity;
          return (
            <div key={s.id} className={`panel flex flex-col gap-3 ${s.cancelled ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-sans text-[15px] font-bold">{s.title}</h3>
                  <p className="mt-0.5 font-mono text-xs text-ink/50">{formatDateTime(s.startsAt)} — {new Date(s.endsAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                {s.cancelled ? (
                  <span className="badge badge-red">Отменена</span>
                ) : full ? (
                  <span className="badge badge-amber">Группа заполнена</span>
                ) : (
                  <span className="badge badge-green">{s.bookedCount}/{s.capacity} мест</span>
                )}
              </div>
              {s.description && <p className="text-[13px] leading-6 text-ink/60">{s.description}</p>}
              <div className="mt-auto flex items-center justify-between border-t border-ink/10 pt-3">
                <span className="text-[12.5px] text-ink/50">Тренер: <b className="text-ink">{s.trainerName}</b></span>
                {!s.cancelled &&
                  (isBooked ? (
                    <span className="badge badge-blue">Вы записаны</span>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={full || !hasActiveSubscription || book.isPending}
                      onClick={() => book.mutate(s.id)}
                    >
                      {full ? "Нет мест" : "Записаться"}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
