import type { BeltLevel } from "@/types/api";
import { BELT_META } from "@/utils/format";

export function BeltBadge({ belt }: { belt: BeltLevel }) {
  const meta = BELT_META[belt] ?? { label: belt, color: "#888" };
  return (
    <span className="badge badge-gray" title={meta.label}>
      <span
        className="inline-block h-2.5 w-7 rounded-[2px] border border-ink/15"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
