import { cn } from "next-common/utils";
import { SummaryTitle } from "next-common/components/summary/styled";

export default function LabelItem({ className, label, suffix, children }) {
  return (
    <div className={cn("flex justify-between items-center whitespace-nowrap", className)}>
      <span className="inline-flex items-center gap-x-[4px]">
        {label && <SummaryTitle className="inline-block">{label}</SummaryTitle>}
        <span
          className={cn(
            "text16Bold text-textPrimary inline-flex items-center",
            "space-x-1",
            "[&_.unit]:text-textTertiary",
            "[&_.total]:text-textTertiary [&_.total]:text-[12px]",
            "[&_.upper]:uppercase",
          )}
        >
          {children}
        </span>
      </span>
      {suffix && <span className="inline-block ml-1">{suffix}</span>}
    </div>
  );
}