import { SystemQuestion } from "@osn/icons/subsquare";
import ExternalLink from "next-common/components/externalLink";
import Progress from "next-common/components/progress";
import Tooltip from "next-common/components/tooltip";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { cn, toPercentage } from "next-common/utils";
import { useSelector } from "react-redux";
import CoretimeSalePanelChartSkeleton from "./skeleton";

export default function CoretimeSalePanelChartPeriodProgress({
  className = "",
  totalBlocks,
  initBlockHeight,
  endBlockHeight,
  saleStart,
  fixedStart,
  isLoading,
}) {
  if (isLoading) {
    return <CoretimeSalePanelChartSkeleton className={cn("h-14", className)} />;
  }

  return (
    <PeriodProgressImpl
      className={className}
      totalBlocks={totalBlocks}
      initBlockHeight={initBlockHeight}
      endBlockHeight={endBlockHeight}
      saleStart={saleStart}
      fixedStart={fixedStart}
    />
  );
}

function PeriodProgressImpl({
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
    <div className={className}>
      <div className="flex -mt-2">
        <RenewalPeriodProgress
          style={{
            width: `${renewalWidth}%`,
          }}
          renewalBlocks={renewalBlocks}
          initBlockHeight={initBlockHeight}
        />

        <SalePeriodProgress
          fixedStart={fixedStart}
          saleStart={saleStart}
          saleBlocks={saleBlocks}
          endBlockHeight={endBlockHeight}
        />
      </div>
    </div>
  );
}

function RenewalPeriodProgress({
  style,
  renewalBlocks,
  saleStart,
  initBlockHeight,
}) {
  const chainHeight = useSelector(chainOrScanHeightSelector);

  let percentage = 0;
  if (chainHeight >= saleStart) {
    percentage = 100;
  } else if (chainHeight >= initBlockHeight) {
    const gone = chainHeight - initBlockHeight;
    percentage = toPercentage(gone / renewalBlocks, 3);
  }

  return (
    <div className="text12Medium space-y-2" style={style}>
      <div>Renewal Period</div>
      <Progress
        percentage={percentage}
        fg="var(--theme300)"
        bg="var(--neutral200)"
      />
      <div className="text-textTertiary flex items-center gap-1">
        Interlude
        <Tooltip
          content={
            <>
              Cores can be renewed. <WikiLink />
            </>
          }
        >
          <SystemQuestion className="inline-flex w-3 h-3" />
        </Tooltip>
      </div>
    </div>
  );
}

function SalePeriodProgress({
  fixedStart,
  saleStart,
  saleBlocks,
  endBlockHeight,
}) {
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const fixedPosition = toPercentage((fixedStart - saleStart) / saleBlocks, 3);

  let percentage = 0;
  if (chainHeight >= endBlockHeight) {
    percentage = 100;
  } else if (chainHeight >= saleStart) {
    const gone = chainHeight - saleStart;
    percentage = toPercentage(gone / saleBlocks, 3);
  }

  return (
    <div className="grow text12Medium space-y-2">
      <div>Sale Period</div>
      <div className="relative space-y-2">
        <Progress
          percentage={percentage}
          fg="var(--theme300)"
          bg="var(--neutral200)"
        />
        <div className="text-textTertiary flex items-center gap-1">
          Price Discovery
          <Tooltip
            content={
              <>
                Core price decreases from the start price to the floor price.{" "}
                <WikiLink />
              </>
            }
          >
            <SystemQuestion className="inline-flex w-3 h-3" />
          </Tooltip>
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
            <Tooltip
              content={
                <>
                  Cores are sold for the floor price. <WikiLink />
                </>
              }
            >
              <SystemQuestion className="inline-flex w-3 h-3" />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function WikiLink() {
  return (
    <ExternalLink
      externalIcon={false}
      className="text12Medium text-textPrimaryContrast"
      href="https://wiki.polkadot.network/docs/learn-agile-coretime#coretime-sales"
    >
      <span className="underline">Wiki</span> ↗
    </ExternalLink>
  );
}
