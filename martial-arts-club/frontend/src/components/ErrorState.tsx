import { ShieldAlert } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-vermilion/30 bg-vermilion/5 py-12 text-center">
      <ShieldAlert className="h-8 w-8 text-vermilion" />
      <p className="max-w-md text-sm text-ink/70">{message}</p>
      {onRetry && (
        <button className="btn btn-ghost btn-sm" onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-dashed border-ink/15 py-12 text-center text-sm text-ink/50">
      {message}
    </div>
  );
}
