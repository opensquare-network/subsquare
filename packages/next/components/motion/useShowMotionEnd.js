import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export default function useShowMotionEnd(motion) {
  const latestHeight = useBlockHeight();
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    motionEndHeight - latestHeight,
  );
  const motionEnd = isMotionEnded(motion);

  return !motionEnd && motionEndHeight && latestHeight && estimatedBlocksTime;
}
