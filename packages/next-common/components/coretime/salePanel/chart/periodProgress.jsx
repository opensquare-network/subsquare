import { SystemQuestion } from "@osn/icons/subsquare";
import Progress from "next-common/components/progress";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { cn, toPercentage } from "next-common/utils";

export default function CoretimeSalePanelChartPeriodProgress({
  className = "",
  endBlockHeight,
  totalBlocks,
  interludeEndHeight,
}) {
  const sale = useCoretimeSale();
  const { initIndexer: { blockHeight: initBlockHeight } = {} } = sale;
  const interludeBlocks = interludeEndHeight - initBlockHeight;

  const interludeWidth = toPercentage(interludeBlocks / totalBlocks, 3);

  return (
    <>
      <div>
        total:{totalBlocks}
        end:{endBlockHeight}
        interlude:{interludeBlocks}
        <div>{interludeBlocks / totalBlocks}</div>
      </div>
      <div className={cn("flex", className)}>
        <RenewalPeriodProgress
          style={{
            width: `${interludeWidth}%`,
          }}
        />
        <SalePeriodProgress />
      </div>
    </>
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
