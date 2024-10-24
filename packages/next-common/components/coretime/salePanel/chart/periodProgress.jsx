import { SystemQuestion } from "@osn/icons/subsquare";
import Progress from "next-common/components/progress";
import { cn } from "next-common/utils";

export default function CoretimeSalePanelChartPeriodProgress({
  className = "",
}) {
  return (
    <div className={cn("flex", className)}>
      <RenewalPeriodProgress />
      <SalePeriodProgress />
    </div>
  );
}

function RenewalPeriodProgress() {
  // TODO: how to handle the width
  return (
    <div className="min-w-[120px] text12Medium space-y-2">
      <div>Renewal Period</div>
      <Progress percentage={66} fg="var(--theme300)" bg="var(--neutral200)" />
      <div className="text-textTertiary flex items-center gap-1">
        Interlude <SystemQuestion className="inline-flex w-3 h-3" />
      </div>
    </div>
  );
}

function SalePeriodProgress() {
  return (
    <div className="grow text12Medium space-y-2">
      <div>Sale Period</div>
      <div className="relative space-y-2">
        <Progress fg="var(--theme300)" bg="var(--neutral200)" />
        <div className="text-textTertiary flex items-center gap-1">
          Price Discovery
          <SystemQuestion className="inline-flex w-3 h-3" />
        </div>

        <div className="!mt-0 absolute top-0 left-1/2 space-y-2">
          <div className="w-0.5 h-2 bg-neutral500" />
          <div className="text-textTertiary flex items-center gap-1">
            Fixed Price
            <SystemQuestion className="inline-flex w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
