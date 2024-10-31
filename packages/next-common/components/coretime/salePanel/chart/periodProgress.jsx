import { SystemQuestion } from "@osn/icons/subsquare";
import Progress from "next-common/components/progress";
import { cn, toPercentage } from "next-common/utils";

export default function CoretimeSalePanelChartPeriodProgress({
  className = "",
  totalBlocks,
  initBlockHeight,
  endBlockHeight,
  saleStart,
  fixedStart,
}) {
  const renewalBlocks = saleStart - initBlockHeight;
  const saleBlocks = endBlockHeight - saleStart;

  const renewalWidth = toPercentage(renewalBlocks / totalBlocks, 3);

  return (
    <div className={cn("flex", className)}>
      <RenewalPeriodProgress
        style={{
          width: `${renewalWidth}%`,
        }}
      />

      <SalePeriodProgress
        fixedStart={fixedStart}
        saleStart={saleStart}
        saleBlocks={saleBlocks}
      />
    </div>
  );
}

function RenewalPeriodProgress({ style }) {
  return (
    <div className="text12Medium space-y-2" style={style}>
      <div>Renewal Period</div>
      {/* TODO: renewal period percentage*/}
      <Progress percentage={66} fg="var(--theme300)" bg="var(--neutral200)" />
      <div className="text-textTertiary flex items-center gap-1">
        Interlude <SystemQuestion className="inline-flex w-3 h-3" />
      </div>
    </div>
  );
}

function SalePeriodProgress({ fixedStart, saleStart, saleBlocks }) {
  const fixedPosition = toPercentage((fixedStart - saleStart) / saleBlocks, 3);

  return (
    <div className="grow text12Medium space-y-2">
      <div>Sale Period</div>
      <div className="relative space-y-2">
        <Progress fg="var(--theme300)" bg="var(--neutral200)" />
        <div className="text-textTertiary flex items-center gap-1">
          Price Discovery
          <SystemQuestion className="inline-flex w-3 h-3" />
        </div>

        <div
          className="!mt-0 absolute top-0 space-y-2"
          style={{
            left: `${fixedPosition}%`,
          }}
        >
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
