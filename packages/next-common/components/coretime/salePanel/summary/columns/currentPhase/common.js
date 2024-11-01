import SummaryItem from "next-common/components/summary/layout/item";
import { Item } from "next-common/components/coretime/salePanel/summary/common";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";
import { toPercentage } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";

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
  const chainHeight = useSelector(chainOrScanHeightSelector);
  const blockGap = endHeight - chainHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(blockGap);
  const countDownTotal = useEstimateBlocksTime(endHeight - startHeight);

  if (isNaN(startHeight) || isNaN(chainHeight) || isNaN(endHeight)) {
    return null;
  }

  const percentage = getCountDownProgress(startHeight, chainHeight, endHeight);
  const tooltipContent = `${percentage}%, total ${countDownTotal}`;

  return (
    <SummaryItem>
      <div className="text12Medium flex gap-x-1">
        <Item
          label="End in"
          value={estimatedBlocksTime}
          valueClassName={"text-textSecondary"}
        />
        <Tooltip
          content={tooltipContent}
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
    </SummaryItem>
  );
}
