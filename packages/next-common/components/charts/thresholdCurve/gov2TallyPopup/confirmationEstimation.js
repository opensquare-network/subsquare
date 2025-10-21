import Tooltip from "next-common/components/tooltip";
import dayjs from "dayjs";
import ConfirmationEstimationGuard from "next-common/components/tally/confirmationEstimationGuard";
import useConfirmationEstimateBlocks from "next-common/hooks/useConfirmationEstimateBlocks";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import { useSelector } from "react-redux";
import { memo, useMemo } from "react";
import BigNumber from "bignumber.js";

function EstimatedTimeGap({ blocks = 0 }) {
  const blockTime = useSelector(blockTimeSelector);
  return useMemo(() => {
    return estimateBlocksTime(blocks, blockTime);
  }, [blocks, blockTime]);
}

function EstimatedTooltipContent({ blocks = 0 }) {
  const blockTime = useSelector(blockTimeSelector);
  const timestampGap = new BigNumber(blockTime).multipliedBy(blocks).toNumber();
  const estimatedTimestamp = new Date().getTime() + timestampGap;
  return dayjs(estimatedTimestamp).format("YYYY-MM-DD HH:mm");
}

function Estimation({ approvePercentage, supportPercentage }) {
  const estimatedBlocks = useConfirmationEstimateBlocks(
    approvePercentage,
    supportPercentage,
  );

  if (!estimatedBlocks) {
    return null;
  }

  return (
    <div className="px-[16px] py-[10px] rounded-[8px] bg-neutral200 text-textSecondary text14Medium">
      Estimated by current tally, the referenda will start confirmation in{" "}
      <Tooltip content={<EstimatedTooltipContent blocks={estimatedBlocks} />}>
        <span className="text-theme500 text14Bold">
          <EstimatedTimeGap blocks={estimatedBlocks} />
        </span>
      </Tooltip>
    </div>
  );
}

const MemoEstimation = memo(Estimation);

export default function ConfirmationEstimation({
  approvePercentage,
  supportPercentage,
}) {
  return (
    <ConfirmationEstimationGuard
      approvePercentage={approvePercentage}
      supportPercentage={supportPercentage}
    >
      <MemoEstimation
        approvePercentage={approvePercentage}
        supportPercentage={supportPercentage}
      />
    </ConfirmationEstimationGuard>
  );
}
