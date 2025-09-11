import { cn } from "next-common/utils";

export function TabTitle({ label, length, active = true, className = "" }) {
  return (
    <div className={cn("flex gap-[8px]", className)}>
      <div
        className={cn(
          "text16Bold",
          active ? "text-textPrimary" : "text-textTertiary",
        )}
      >
        {label}
      </div>
      <span className="text-textTertiary text16Medium">{length || 0}</span>
    </div>
  );
}
