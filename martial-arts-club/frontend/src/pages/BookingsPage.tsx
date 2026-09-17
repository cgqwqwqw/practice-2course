import { useMyBookings, useCancelBooking } from "@/hooks/useBookings";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { formatDateTime } from "@/utils/format";

const STATUS_BADGE: Record<string, { cls: string; label: string }> = {
  BOOKED: { cls: "badge-green", label: "Подтверждено" },
  CANCELLED: { cls: "badge-red", label: "Отменено" },
  ATTENDED: { cls: "badge-blue", label: "Посещено" },
  NO_SHOW: { cls: "badge-amber", label: "Не явился" },
};

export function BookingsPage() {
  const bookings = useMyBookings();
  const cancel = useCancelBooking();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[26px]">Мои записи</h1>
        <p className="mt-1 text-[13px] text-ink/50">Забронированные тренировки и их статус</p>
      </div>

      {bookings.isLoading && <Loader />}
      {bookings.isError && <ErrorState message={bookings.error.message} onRetry={() => bookings.refetch()} />}
      {bookings.isSuccess && bookings.data.length === 0 && (
        <EmptyState message="Записей пока нет — выберите тренировку в расписании." />
      )}

      {bookings.isSuccess && bookings.data.length > 0 && (
        <div className="panel overflow-hidden p-0 rounded-lg border border-paper/15 bg-paper/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-paper/15 bg-paper/10 text-xs font-semibold tracking-wider text-ink/70 uppercase">
                  <th scope="col" className="px-6 py-4">Тренировка</th>
                  <th scope="col" className="px-6 py-4">Начало</th>
                  <th scope="col" className="px-6 py-4">Статус</th>
                  <th scope="col" className="px-6 py-4 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper/10">
                {bookings.data.map((b) => {
                  const meta = STATUS_BADGE[b.status] ?? { cls: "badge-gray", label: b.status };
                  const canCancel = b.status === "BOOKED" && new Date(b.sessionStartsAt) > new Date();
                  return (
                    <tr key={b.id} className="hover:bg-paper/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{b.sessionTitle}</td>
                      <td className="px-6 py-4 font-mono text-xs text-ink/70 whitespace-nowrap">
                        {formatDateTime(b.sessionStartsAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${meta.cls}`}>{meta.label}</span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {canCancel && (
                          <button
                            className="text-xs font-semibold text-vermilion hover:underline disabled:opacity-50"
                            disabled={cancel.isPending}
                            onClick={() => cancel.mutate(b.id)}
                          >
                            Отменить запись
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}