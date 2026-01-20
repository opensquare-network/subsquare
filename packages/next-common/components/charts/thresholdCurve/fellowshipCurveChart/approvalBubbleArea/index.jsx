import { useMemo } from "react";
import useFellowshipReferendaActions from "next-common/components/pages/components/fellowship/referendum/sidebar/tally/voteActions/useFellowshipReferendaActions";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import FellowshipBubbleItem from "./bubbleItem";
import { clamp, inRange, last } from "lodash-es";
import { cn } from "next-common/utils";

const useApprovalBubbleData = (rangeData, historyApprovalData) => {
  const labelXLength = rangeData[1] - rangeData[0];
  const beginHeight = useBeginHeight();
  const blockStep = useBlockSteps();

  const { loading, voteActions } = useFellowshipReferendaActions();

  return useMemo(() => {
    if (loading) {
      return [];
    }
    const getY = (steps) => {
      if (steps >= historyApprovalData.length - 1) {
        return last(historyApprovalData);
      } else {
        return historyApprovalData[Math.ceil(steps)];
      }
    };
    return voteActions
      .sort((a, b) => a.indexer.blockHeight - b.indexer.blockHeight)
      .map((item) => {
        const { data, formatData, rank } = item;
        const blockHeight = item.indexer.blockHeight;
        const currentStep = (blockHeight - beginHeight) / blockStep;

        return {
          data,
          rank,
          formatData,
          y: getY(currentStep),
          x:
            clamp(((currentStep - rangeData[0]) / labelXLength) * 100, 0, 100) +
            1,
          index: currentStep,
          hidden: !inRange(currentStep, rangeData[0], rangeData[1]),
        };
      });
  }, [
    beginHeight,
    blockStep,
    historyApprovalData,
    loading,
    labelXLength,
    rangeData,
    voteActions,
  ]);
};

export default function FellowshipApprovalBubbleArea({
  visible,
  chartArea,
  historyApprovalData,
  rangeData,
}) {
  const approvalData = useApprovalBubbleData(rangeData, historyApprovalData);

  const style = useMemo(() => {
    const { left = 0, top = 0, height = 0, width = 0 } = chartArea || {};

    const leftValue = Number.isFinite(left) ? left : 0;
    const topValue = Number.isFinite(top) ? top : 0;
    const heightValue = Number.isFinite(height) ? height : 0;
    const widthValue = Number.isFinite(width) ? width : 0;

    return {
      position: "absolute",
      left: `${leftValue}px`,
      top: `${topValue}px`,
      width: `${widthValue}px`,
      height: `${heightValue}px`,
    };
  }, [chartArea]);

  return (
    <div
      style={style}
      className={cn("pointer-events-none select-none", !visible && "hidden")}
    >
      <div className="w-full h-full relative">
        {approvalData?.map(({ x, y, formatData, hidden, rank }, index) => {
          return (
            <FellowshipBubbleItem
              key={index}
              leftPositionPercent={x + "%"}
              bottomPositionPercent={y + "%"}
              hidden={hidden}
              formatData={formatData}
              rank={rank}
            />
          );
        })}
      </div>
    </div>
  );
}
