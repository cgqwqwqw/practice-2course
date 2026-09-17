import { Loader2 } from "lucide-react";

export function Loader({ text = "Загрузка…" }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sage">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="font-mono text-xs tracking-wider">{text}</span>
    </div>
  );
}

/** Skeleton для карточек/строк таблицы */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-ink/10 ${className}`} />;
}
