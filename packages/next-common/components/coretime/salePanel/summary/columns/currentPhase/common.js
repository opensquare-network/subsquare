import { Item } from "next-common/components/coretime/salePanel/summary/common";
import { useRelayHeight } from "next-common/context/relayInfo";
import { useEstimateBlocksTimeWithBlockTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";
import { toPercentage } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { useCoretimeSaleLeadinLength } from "next-common/context/coretime/sale/phases/leadin";
import { getEndBlocksTime } from "next-common/components/coretime/salePanel/summary/columns/totalPeriod";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import { useMemo } from "react";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import useBlockTime from "next-common/context/coretime/hooks/useBlockTime";
import {
  useCoretimeSaleInitHeight,
  useCoretimeSaleInitIndexer,
} from "next-common/context/coretime/sale/provider";

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
  const chainHeight = useRelayHeight();
  const blockGap = endHeight - chainHeight;
  const blockTime = useBlockTime();
  const estimatedBlocksTime = useEstimateBlocksTimeWithBlockTime(
    blockGap,
    blockTime,
  );
  const countDownTotal = useEstimateBlocksTimeWithBlockTime(
    endHeight - startHeight,
    blockTime,
  );

  const saleStartHeight = useCoretimeSaleStart();
  const leadinLength = useCoretimeSaleLeadinLength();
  const initHeight = useCoretimeSaleInitHeight();
  const initIndexer = useCoretimeSaleInitIndexer();
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
    initIndexer?.blockTime,
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
