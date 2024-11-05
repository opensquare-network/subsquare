import { cn } from "next-common/utils";

export default function CoretimeSalePanelChartSkeleton({ className = "" }) {
  return (
    <div
      className={cn("w-full rounded-lg bg-neutral300 animate-pulse", className)}
    />
  );
}
