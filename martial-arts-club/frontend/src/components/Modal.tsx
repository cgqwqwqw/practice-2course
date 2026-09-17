import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/65 p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[460px] overflow-hidden rounded-lg bg-white text-ink">
        <div className="flex items-center justify-between border-b border-ink/10 px-[26px] py-[22px]">
          <h3 className="text-base font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-ink/50 transition-colors hover:text-ink"
            aria-label="Закрыть"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-[26px] py-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2.5 border-t border-ink/10 px-[26px] py-[18px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
