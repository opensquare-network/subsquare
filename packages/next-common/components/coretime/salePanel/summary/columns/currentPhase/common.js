import { Item } from "next-common/components/coretime/salePanel/summary/common";
import { useRelayChainLatestHeight } from "next-common/hooks/relayScanHeight";
import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";
import { toPercentage } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { useCoretimeSaleLeadinLength } from "next-common/context/coretime/sale/phases/leadin";
import { getEndBlocksTime } from "next-common/components/coretime/salePanel/summary/columns/totalPeriod";
import { usePageProps } from "next-common/context/page";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import { useMemo } from "react";
import { useCoretimeSaleStartWithRCBlockNumber } from "next-common/hooks/coretime/useCoretimeSaleStart";
import useRelayChainBlockTime from "next-common/context/coretime/hooks/useRelayChainBlockTime";

export function getCountDownProgress(startHeight, currentHeight, endHeight) {
  if (currentHeight <= startHeight) {
    return 0;
  }

  if (currentHeight >= endHeight) {
    return 100;
  }

  const progressValue =
    (currentHeight - startHeight) / (endHeight - startHeight);

  return toPercentage(progressValue, 2);
}

export default function CurrentPhaseEnd({ startHeight, endHeight }) {
  const chainHeight = useRelayChainLatestHeight();
  const blockGap = endHeight - chainHeight;
  const blockTime = useRelayChainBlockTime();
  const estimatedBlocksTime = useEstimateBlocksTimeWithBlockTime(
    blockGap,
    blockTime,
  );
  const countDownTotal = useEstimateBlocksTimeWithBlockTime(
    endHeight - startHeight,
    blockTime,
  );

  const saleStartHeight = useCoretimeSaleStartWithRCBlockNumber();
  const leadinLength = useCoretimeSaleLeadinLength();
  const { coretimeSale } = usePageProps();
  const initHeight = coretimeSale?.relayIndexer?.blockHeight;
  const totalBlockGap = useMemo(
    () => endHeight - initHeight,
    [endHeight, initHeight],
  );

  if (isNaN(startHeight) || isNaN(chainHeight) || isNaN(endHeight)) {
    return null;
  }

  const percentage = getCountDownProgress(startHeight, chainHeight, endHeight);
  const countDownTooltipContent = `${percentage}%, total ${countDownTotal}`;

  const isInFixedPriceStage = chainHeight >= saleStartHeight + leadinLength;
  const endInTooltipPrefix = isInFixedPriceStage ? "Estimated: " : "";
  const endInTime = getEndBlocksTime(
    coretimeSale?.relayIndexer?.blockTime,
    blockTime,
    totalBlockGap,
  );
  const endInTooltipContent = `${endInTooltipPrefix}${endHeight?.toLocaleString()}, ${formatDateTime(
    endInTime,
  )}`;

  return (
    <div className="text12Medium flex gap-x-1">
      <Tooltip content={endInTooltipContent}>
        <Item
          label="End in"
          value={estimatedBlocksTime}
          valueClassName={"text-textSecondary"}
        />
      </Tooltip>
      <Tooltip
        content={countDownTooltipContent}
        className={"inline-flex items-center"}
      >
        <CountDown
          numerator={endHeight - chainHeight}
          denominator={endHeight - startHeight}
          backgroundColor="var(--theme100)"
          foregroundColor="var(--theme500)"
        />
      </Tooltip>
    </div>
  );
}
