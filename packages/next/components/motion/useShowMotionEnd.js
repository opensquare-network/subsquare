import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { useSelector } from "react-redux";

export default function useShowMotionEnd(motion, chain) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    currentFinalHeight - motionEndHeight,
    chain
  );
  const motionEnd = isMotionEnded(motion);

  const showMotionEnd =
    !motionEnd &&
    motionEndHeight &&
    currentFinalHeight &&
    currentFinalHeight <= motionEndHeight &&
    estimatedBlocksTime;

  return showMotionEnd;
}
