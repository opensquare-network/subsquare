import { cn } from "next-common/utils";

export function SummaryColumnGap({ children }) {
  return <div className="flex flex-col gap-2.5">{children}</div>;
}

export function Item({ label = "", value, valueClassName }) {
  return (
    <div className="flex items-center flex-wrap gap-x-1 text12Medium text-textTertiary">
      <div>{label}</div>
      <div className={cn("text-textPrimary", valueClassName)}>{value}</div>
    </div>
  );
}
