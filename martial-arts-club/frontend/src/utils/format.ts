import type { BeltLevel } from "@/types/api";

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const BELT_META: Record<BeltLevel, { label: string; color: string }> = {
  WHITE: { label: "Белый пояс (9 кю)", color: "#EDE8DD" },
  YELLOW: { label: "Жёлтый пояс", color: "#F2C744" },
  ORANGE: { label: "Оранжевый пояс", color: "#F28B44" },
  GREEN: { label: "Зелёный пояс", color: "#4B7A4A" },
  BLUE: { label: "Синий пояс", color: "#3A5B9A" },
  PURPLE: { label: "Фиолетовый пояс", color: "#6B4A8A" },
  BROWN: { label: "Коричневый пояс", color: "#6B4A2F" },
  BLACK_1_DAN: { label: "Чёрный пояс, 1 дан", color: "#161512" },
  BLACK_2_DAN: { label: "Чёрный пояс, 2 дан", color: "#161512" },
  BLACK_3_DAN: { label: "Чёрный пояс, 3 дан", color: "#161512" },
};

export function formatBelt(belt: BeltLevel): string {
  return BELT_META[belt]?.label ?? belt;
}
