import { cn } from "next-common/utils";

export function TabTitle({ label, length, disabled = true }) {
  return (
    <div className="flex gap-[8px]" role="button">
      <div
        className={cn(
          "text16Bold",
          disabled ? "text-textTertiary" : "text-textPrimary",
        )}
      >
        {label}
      </div>
      <span className="text-textTertiary text16Medium">{length || 0}</span>
    </div>
  );
}
