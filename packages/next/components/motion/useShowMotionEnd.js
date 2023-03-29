import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";

export default function useShowMotionEnd(motion) {
  const latestHeight = useSelector(latestHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    motionEndHeight - latestHeight
  );
  const motionEnd = isMotionEnded(motion);

  return !motionEnd &&
    motionEndHeight &&
    latestHeight &&
    estimatedBlocksTime;
}
