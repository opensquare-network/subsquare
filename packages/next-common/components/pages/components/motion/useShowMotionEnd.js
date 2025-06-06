import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import useChainOrScanHeight from "next-common/hooks/height";

export default function useShowMotionEnd(motion) {
  const latestHeight = useChainOrScanHeight();
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    motionEndHeight - latestHeight,
  );
  const motionEnd = isMotionEnded(motion);

  return !motionEnd && motionEndHeight && latestHeight && estimatedBlocksTime;
}
