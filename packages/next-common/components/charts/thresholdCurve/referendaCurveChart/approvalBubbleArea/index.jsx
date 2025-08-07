import { useMemo } from "react";
import { useReferendumActions } from "next-common/components/pages/components/gov2/sidebar/tally/voteActions/table";
import {
  useBeginHeight,
  useBlockSteps,
} from "next-common/utils/hooks/referenda/detail/useReferendumBlocks";
import BubbleItem from "./bubbleItem";
import useShowVoteActions from "next-common/hooks/useShowVoteActions";

const useApprovalBubbleData = (maxX, historyApprovalData) => {
  const beginheight = useBeginHeight();
  const blockStep = useBlockSteps();

  const { loading, voteActions } = useReferendumActions();

  return useMemo(() => {
    if (loading) {
      return [];
    }
    return voteActions
      .sort((a, b) => a.indexer.blockHeight - b.indexer.blockHeight)
      .map((item) => {
        const { data, type, who } = item;
        const blockHeight = item.indexer.blockHeight;
        const steps = (blockHeight - beginheight) / blockStep;
        return {
          data,
          type,
          who,
          y: historyApprovalData[Math.ceil(steps)],
          x: (steps / maxX) * 100,
        };
      });
  }, [beginheight, blockStep, historyApprovalData, loading, maxX, voteActions]);
};

export default function ApprovalBubbleArea(props) {
  const showVoteActions = useShowVoteActions();
  if (!showVoteActions) {
    return;
  }
  return <ApprovalBubbleAreaImpl {...props} />;
}

function ApprovalBubbleAreaImpl({
  chartArea,
  scales,
  historyApprovalData,
  showAyeNay,
}) {
  const maxX = scales?.["x"]?.max;
  const approvalData = useApprovalBubbleData(maxX, historyApprovalData);
  const style = useMemo(() => {
    const {
      width = 0,
      left = 0,
      right = 0,
      top,
      bottom,
      height,
    } = chartArea || {};

    return {
      paddingLeft: `${left}px`,
      paddingRight: showAyeNay ? `${Math.max(right - width, 0)}px` : "0px",
      paddingTop: `${top}px`,
      paddingBottom: `${Math.max(bottom - height)}px`,
    };
  }, [chartArea, showAyeNay]);

  return (
    <div
      style={style}
      className="top-0 left-0 absolute w-full h-full  pointer-events-none"
    >
      <div className="w-full h-full relative">
        {approvalData?.map(({ x, y, who, data, type }, index) => {
          return (
            <BubbleItem
              key={index}
              leftPositionPercent={x + "%"}
              bottomPositionPercent={y + "%"}
              who={who}
              data={data}
              type={type}
            />
          );
        })}
      </div>
    </div>
  );
}
