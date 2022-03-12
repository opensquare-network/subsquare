import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { useSelector } from "react-redux";
import { finalizedHeightSelector } from "next-common/store/reducers/chainSlice";

export default function useShowMotionEnd(motion, chain) {
  const currentFinalHeight = useSelector(finalizedHeightSelector());
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    currentFinalHeight - motionEndHeight
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
