import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useExams, useCreateExam } from "@/hooks/useExams";
import { Loader } from "@/components/Loader";
import { ErrorState, EmptyState } from "@/components/ErrorState";
import { BeltBadge } from "@/components/BeltBadge";
import { Modal } from "@/components/Modal";
import { formatDate } from "@/utils/format";
import type { BeltLevel } from "@/types/api";

const BELTS: BeltLevel[] = [
    "WHITE",
    "YELLOW",
    "ORANGE",
    "GREEN",
    "BLUE",
    "PURPLE",
    "BROWN",
    "BLACK_1_DAN",
    "BLACK_2_DAN",
    "BLACK_3_DAN",
];

const schema = z.object({
    title: z.string().min(2).max(150),
    examDate: z.string().min(1, "Укажите дату экзамена"),
    entries: z
        .array(
            z.object({
                studentId: z.coerce.number().int().positive("ID ученика обязателен"),
                result: z.enum(["PASSED", "FAILED"]),
                awardedBelt: z.string().optional(),
                comment: z.string().max(500).optional(),
            })
        )
        .min(1, "Добавьте хотя бы одного ученика"),
});
type FormData = z.infer<typeof schema>;

export function ExamsPage() {
    const exams = useExams();
    const create = useCreateExam();
    const [open, setOpen] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            examDate: "",
            entries: [{ studentId: 0, result: "PASSED", awardedBelt: "YELLOW", comment: "" }],
        },
    });
    const { fields, append, remove } = useFieldArray({ control, name: "entries" });
    const entries = watch("entries");

    const onSubmit = (data: FormData) => {
        create.mutate(
            {
                title: data.title,
                examDate: data.examDate,
                entries: data.entries.map((e) => ({
                    studentId: e.studentId,
                    result: e.result,
                    awardedBelt: e.result === "PASSED" ? (e.awardedBelt as BeltLevel) : undefined,
                    comment: e.comment || undefined,
                })),
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    reset();
                },
            }
        );
    };

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="font-display text-[26px]">Аттестации</h1>
                    <p className="mt-1 text-[13px] text-ink/50">Экзаменационные ведомости и присвоение поясов</p>
                </div>
                <button className="btn btn-dark btn-sm" onClick={() => setOpen(true)}>
                    + Новая ведомость
                </button>
            </div>

            {exams.isLoading && <Loader />}
            {exams.isError && <ErrorState message={exams.error.message} onRetry={() => exams.refetch()} />}
            {exams.isSuccess && (exams.data?.length ?? 0) === 0 && (
                <EmptyState message="Экзаменов пока не проводилось." />
            )}

            <div className="flex flex-col gap-4">
                {(exams.data ?? []).map((exam) => (
                    <div key={exam.id} className="panel">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-sans text-[15px] font-bold">{exam.title}</h3>
                            <span className="font-mono text-xs text-ink/50">
                {formatDate(exam.examDate)} · {exam.conductedByName}
              </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {(exam.entries ?? []).map((e) => (
                                <div
                                    key={e.id}
                                    className="flex flex-wrap items-center gap-3 border-b border-ink/5 pb-2 text-sm last:border-0 last:pb-0"
                                >
                                    <b>{e.studentName}</b>
                                    <span className={`badge ${e.result === "PASSED" ? "badge-green" : "badge-red"}`}>
                    {e.result === "PASSED" ? "Сдано" : "Не сдано"}
                  </span>
                                    {e.awardedBelt && <BeltBadge belt={e.awardedBelt} />}
                                    {e.comment && <span className="text-ink/55">{e.comment}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                title="Новая экзаменационная ведомость"
                footer={
                    <>
                        <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                            Отмена
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            form="exam-form"
                            type="submit"
                            disabled={create.isPending}
                        >
                            Создать ведомость
                        </button>
                    </>
                }
            >
                <form id="exam-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="field">
                            <label>Название</label>
                            <input placeholder="Аттестация на жёлтый пояс" {...register("title")} />
                            {errors.title && <span className="field-error">{errors.title.message}</span>}
                        </div>
                        <div className="field">
                            <label>Дата экзамена</label>
                            <input type="date" {...register("examDate")} />
                            {errors.examDate && <span className="field-error">{errors.examDate.message}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold">Ученики и результаты</label>
                            <button
                                type="button"
                                className="btn btn-ghost btn-sm"
                                onClick={() =>
                                    append({ studentId: 0, result: "PASSED", awardedBelt: "YELLOW", comment: "" })
                                }
                            >
                                + Ученик
                            </button>
                        </div>
                        {errors.entries?.message && <span className="field-error">{errors.entries.message}</span>}

                        {fields.map((field, idx) => {
                            const isPassed = entries?.[idx]?.result === "PASSED";
                            return (
                                <div
                                    key={field.id}
                                    className="flex flex-col gap-3 rounded border border-ink/10 p-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                                            <div className="field">
                                                <label>ID ученика</label>
                                                <input type="number" {...register(`entries.${idx}.studentId`)} />
                                                {errors.entries?.[idx]?.studentId && (
                                                    <span className="field-error">{errors.entries[idx]?.studentId?.message}</span>
                                                )}
                                            </div>
                                            <div className="field">
                                                <label>Результат</label>
                                                <select {...register(`entries.${idx}.result`)}>
                                                    <option value="PASSED">Сдал</option>
                                                    <option value="FAILED">Не сдал</option>
                                                </select>
                                            </div>
                                            <div className="field">
                                                <label>Присвоенный пояс</label>
                                                <select {...register(`entries.${idx}.awardedBelt`)} disabled={!isPassed}>
                                                    {BELTS.map((b) => (
                                                        <option key={b} value={b}>
                                                            {b}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-sm mt-6 text-ink/50 hover:text-red-500"
                                                onClick={() => remove(idx)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    <div className="field w-full">
                                        <label>Комментарий</label>
                                        <input
                                            className="w-full"
                                            placeholder="Отличное выполнение техники"
                                            {...register(`entries.${idx}.comment`)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </form>
            </Modal>
        </div>
    );
}