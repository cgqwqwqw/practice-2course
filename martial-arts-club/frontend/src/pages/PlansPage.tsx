import { usePlans } from "@/hooks/usePlans";
import { useMySubscriptions, usePurchaseSubscription } from "@/hooks/useSubscriptions";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { formatDate } from "@/utils/format";

export function PlansPage() {
  const plans = usePlans();
  const subscriptions = useMySubscriptions();
  const purchase = usePurchaseSubscription();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[26px]">Абонементы</h1>
        <p className="mt-1 text-[13px] text-ink/50">Каталог тарифов · оплата эмулируется</p>
      </div>

      {subscriptions.data && subscriptions.data.length > 0 && (
        <div className="panel mb-6">
          <h3 className="mb-4 text-base font-bold">Мои абонементы</h3>
          <div className="flex flex-col gap-2">
            {subscriptions.data.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/5 pb-2 last:border-0 last:pb-0 text-sm">
                <span>{s.planName}</span>
                <span className="font-mono text-xs text-ink/50">
                  осталось {s.sessionsLeft} зан. · до {formatDate(s.expiresAt)} ·{" "}
                  {s.active ? "активен" : "неактивен"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {plans.isLoading && <Loader />}
      {plans.isError && <ErrorState message={plans.error.message} onRetry={() => plans.refetch()} />}
      {plans.isSuccess && plans.data.length === 0 && <EmptyState message="Активных тарифов пока нет." />}

      <div className="grid gap-5 md:grid-cols-3">
        {plans.data?.map((p) => (
          <div key={p.id} className="panel flex flex-col">
            <div className="mb-2 font-display text-xl">{p.name}</div>
            {p.description && <p className="mb-5 text-[13px] text-ink/55">{p.description}</p>}
            <div className="mb-1 font-display text-4xl">{p.price.toLocaleString("ru-RU")} ₽</div>
            <p className="mb-5 text-xs text-ink/50">
              {p.sessionsCount} занятий · {p.validityDays} дней действия
            </p>
            <button
              className="btn btn-dark btn-block mt-auto"
              disabled={purchase.isPending}
              onClick={() => purchase.mutate(p.id)}
            >
              Купить (эмуляция оплаты)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
