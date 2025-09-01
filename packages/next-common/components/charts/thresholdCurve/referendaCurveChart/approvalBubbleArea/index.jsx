import { useMemo } from "react";
import { useReferendumActions } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import BubbleItem from "./bubbleItem";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";
import { clamp, inRange, last } from "lodash-es";

export default function ApprovalBubbleArea(props) {
  const showVoteActions = useShowVoteActions();
  if (!showVoteActions) {
    return;
  }
  return <ApprovalBubbleAreaImpl {...props} />;
}

const useApprovalBubbleData = (rangeData, historyApprovalData) => {
  const labelXLength = rangeData[1] - rangeData[0];
  const beginheight = useBeginHeight();
  const blockStep = useBlockSteps();

  const { loading, voteActions } = useReferendumActions();

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
        const { data, type, who } = item;
        const blockHeight = item.indexer.blockHeight;
        const currentStep = (blockHeight - beginheight) / blockStep;

        return {
          data,
          type,
          who,
          y: getY(currentStep),
          x:
            clamp(((currentStep - rangeData[0]) / labelXLength) * 100, 0, 100) +
            1,
          index: currentStep,
          hidden: !inRange(currentStep, rangeData[0], rangeData[1]),
        };
      });
  }, [
    beginheight,
    blockStep,
    historyApprovalData,
    loading,
    labelXLength,
    rangeData,
    voteActions,
  ]);
};

function ApprovalBubbleAreaImpl({
  chartArea,
  historyApprovalData,
  showAyeNay,
  visible,
  rangeData,
}) {
  const approvalData = useApprovalBubbleData(rangeData, historyApprovalData);
  const style = useMemo(() => {
    const {
      left = 0,
      right = 0,
      top = 0,
      bottom = 0,
      height = 0,
    } = chartArea || {};

    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `calc(100% - ${right}px)` : "0px",
      paddingTop: `${top}px`,
      paddingBottom: `${Math.max(bottom - height)}px`,
      visibility: visible ? "visible" : "hidden",
    };
  }, [chartArea, showAyeNay, visible]);

  return (
    <div
      style={style}
      className="top-0 left-0 absolute w-full h-full  pointer-events-none select-none"
    >
      <div className="w-full h-full relative">
        {approvalData?.map(({ x, y, who, data, type, hidden }, index) => {
          return (
            <BubbleItem
              key={index}
              leftPositionPercent={x + "%"}
              bottomPositionPercent={y + "%"}
              who={who}
              hidden={hidden}
              data={data}
              type={type}
            />
          );
        })}
      </div>
    </div>
  );
}
