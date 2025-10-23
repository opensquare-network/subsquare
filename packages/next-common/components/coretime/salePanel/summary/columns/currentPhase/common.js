import { Item } from "next-common/components/coretime/salePanel/summary/common";
import useCoretimeChainOrScanHeight from "next-common/hooks/coretime/scanHeight";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";
import { toPercentage } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import { useCoretimeSaleLeadinLength } from "next-common/context/coretime/sale/phases/leadin";
import { getEndBlocksTime } from "next-common/components/coretime/salePanel/summary/columns/totalPeriod";
import { formatDateTime } from "next-common/components/coretime/sales/history/timeRange";
import { useMemo } from "react";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import useCoretimeSaleStart from "next-common/hooks/coretime/useCoretimeSaleStart";
import {
  useCoretimeSaleInitHeight,
  useCoretimeSaleInitIndexer,
} from "next-common/context/coretime/sale/provider";
import { useSelector } from "react-redux";

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
  const chainHeight = useCoretimeChainOrScanHeight();
  const blockGap = endHeight - chainHeight;
  const blockTime = useSelector(blockTimeSelector);
  const estimatedBlocksTime = useEstimateBlocksTime(blockGap);
  const countDownTotal = useEstimateBlocksTime(endHeight - startHeight);

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
