import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan } from "@/hooks/usePlans";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { Modal } from "@/components/Modal";
import type { PlanResponse } from "@/types/api";

const schema = z.object({
    name: z.string().min(2).max(150),
    description: z.string().max(500).optional(),
    price: z.coerce.number().min(0),
    sessionsCount: z.coerce.number().int().min(1),
    validityDays: z.coerce.number().int().min(1),
    active: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export function AdminPlansPage() {
    const plans = usePlans();
    const create = useCreatePlan();
    const update = useUpdatePlan();
    const remove = useDeletePlan();

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<PlanResponse | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({ resolver: zodResolver(schema) });

    const openCreate = () => {
        setEditing(null);
        reset({ name: "", description: "", price: 3500, sessionsCount: 8, validityDays: 30, active: true });
        setModalOpen(true);
    };

    const openEdit = (p: PlanResponse) => {
        setEditing(p);
        reset({
            name: p.name,
            description: p.description ?? "",
            price: p.price,
            sessionsCount: p.sessionsCount,
            validityDays: p.validityDays,
            active: p.active,
        });
        setModalOpen(true);
    };

    const onSubmit = (data: FormData) => {
        const payload = { ...data, description: data.description || undefined };
        if (editing) {
            update.mutate({ id: editing.id, data: payload }, { onSuccess: () => setModalOpen(false) });
        } else {
            create.mutate(payload, { onSuccess: () => setModalOpen(false) });
        }
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-[26px]">Тарифные планы</h1>
                    <p className="mt-1 text-[13px] text-ink/50">CRUD каталога абонементов (ADMIN)</p>
                </div>
                <button className="btn btn-dark btn-sm" onClick={openCreate}>+ Новый тариф</button>
            </div>

            {plans.isLoading && <Loader />}
            {plans.isError && <ErrorState message={plans.error.message} onRetry={() => plans.refetch()} />}
            {plans.isSuccess && plans.data.length === 0 && <EmptyState message="Тарифов пока нет." />}

            {plans.isSuccess && plans.data.length > 0 && (
                <div className="panel overflow-x-auto p-0">
                    <table className="w-full min-w-[720px] text-left border-collapse">
                        <thead>
                        <tr className="border-b border-ink/10 text-xs font-semibold text-ink/60 uppercase tracking-wider">
                            <th className="px-4 py-3 text-left">Название</th>
                            <th className="px-4 py-3 text-right">Цена</th>
                            <th className="px-4 py-3 text-center">Занятий</th>
                            <th className="px-4 py-3 text-center">Дней</th>
                            <th className="px-4 py-3 text-center">Статус</th>
                            <th className="px-4 py-3 text-right">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/10">
                        {plans.data.map((p) => (
                            <tr key={p.id} className={`transition-colors hover:bg-ink/5 ${p.active ? "" : "opacity-50"}`}>
                                <td className="px-4 py-3 align-middle">
                                    <b className="block text-[13.5px] font-medium">{p.name}</b>
                                    {p.description && <span className="text-xs text-ink/50">{p.description}</span>}
                                </td>
                                <td className="px-4 py-3 align-middle text-right whitespace-nowrap font-medium">
                                    {p.price.toLocaleString("ru-RU")} ₽
                                </td>
                                <td className="px-4 py-3 align-middle text-center">{p.sessionsCount}</td>
                                <td className="px-4 py-3 align-middle text-center">{p.validityDays}</td>
                                <td className="px-4 py-3 align-middle text-center">
                    <span className={`badge ${p.active ? "badge-green" : "badge-gray"}`}>
                      {p.active ? "Активен" : "Деактивирован"}
                    </span>
                                </td>
                                <td className="px-4 py-3 align-middle text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            className="text-[12.5px] font-semibold text-ink/70 hover:underline"
                                            onClick={() => openEdit(p)}
                                        >
                                            Изменить
                                        </button>
                                        {p.active && (
                                            <button
                                                className="text-[12.5px] font-semibold text-vermilion hover:underline"
                                                disabled={remove.isPending}
                                                onClick={() => remove.mutate(p.id)}
                                            >
                                                Деактивировать
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editing ? "Изменить тариф" : "Новый тариф"}
                footer={
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => setModalOpen(false)}>Отмена</button>
                        <button className="btn btn-primary btn-sm" form="plan-form" type="submit" disabled={create.isPending || update.isPending}>
                            {editing ? "Сохранить" : "Создать"}
                        </button>
                    </>
                }
            >
                <form id="plan-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
                    <div className="field sm:col-span-2">
                        <label>Название</label>
                        <input {...register("name")} />
                        {errors.name && <span className="field-error">{errors.name.message}</span>}
                    </div>
                    <div className="field sm:col-span-2">
                        <label>Описание</label>
                        <textarea {...register("description")} />
                    </div>
                    <div className="field">
                        <label>Цена, ₽</label>
                        <input type="number" step="0.01" {...register("price")} />
                        {errors.price && <span className="field-error">{errors.price.message}</span>}
                    </div>
                    <div className="field">
                        <label>Количество занятий</label>
                        <input type="number" {...register("sessionsCount")} />
                        {errors.sessionsCount && <span className="field-error">{errors.sessionsCount.message}</span>}
                    </div>
                    <div className="field">
                        <label>Срок действия, дней</label>
                        <input type="number" {...register("validityDays")} />
                        {errors.validityDays && <span className="field-error">{errors.validityDays.message}</span>}
                    </div>
                    <div className="field">
                        <label>Активен</label>
                        <select {...register("active")}>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    </div>
                </form>
            </Modal>
        </div>
    );
}