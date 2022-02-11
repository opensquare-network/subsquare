import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "next-common/components/countDown";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "utils";

export default function MotionEnd({ motion, type = "full", chain }) {
  const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    currentFinalHeight - motionEndHeight
  );
  const motionEnd = isMotionEnded(motion);

  if (
    motionEnd ||
    !motionEndHeight ||
    !currentFinalHeight ||
    currentFinalHeight >= motionEndHeight ||
    !estimatedBlocksTime
  ) {
    return null;
  }

  const elapsePercent =
    (currentFinalHeight - motionStartHeight) /
    (motionEndHeight - motionStartHeight);
  return (
    <>
      <CountDown percent={parseInt(elapsePercent * 100)} />
      {type === "full" ? (
        <span>{`End in ${estimatedBlocksTime}, #${bigNumber2Locale(
          motionEndHeight.toString()
        )}`}</span>
      ) : type === "simple" ? (
        <span>{`End in ${estimatedBlocksTime}`}</span>
      ) : null}
    </>
  );
}
