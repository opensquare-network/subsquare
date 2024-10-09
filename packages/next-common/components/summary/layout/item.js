import { cn } from "next-common/utils";
import { SummaryTitle } from "next-common/components/summary/styled";

export default function SummaryItem({ className, title, suffix, children }) {
  return (
    <div className={cn("flex-1 flex justify-between", className)}>
      <div className="flex flex-col gap-[4px]">
        {title && <SummaryTitle>{title}</SummaryTitle>}
        <div
          className={cn(
            "text16Bold text-textPrimary",
            "space-x-1",
            "[&_.unit]:text-textTertiary",
            "[&_.total]:text-textTertiary [&_.total]:text-[12px]",
            "[&_.upper]:uppercase",
          )}
        >
          {children}
        </div>
      </div>
      {suffix && <div>{suffix}</div>}
    </div>
  );
}
