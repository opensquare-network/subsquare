import { isMotionEnded } from "next-common/utils";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function useShowMotionEnd(motion) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const estimatedBlocksTime = useEstimateBlocksTime(
    motionEndHeight - latestHeight,
  );
  const motionEnd = isMotionEnded(motion);

  return !motionEnd && motionEndHeight && latestHeight && estimatedBlocksTime;
}
