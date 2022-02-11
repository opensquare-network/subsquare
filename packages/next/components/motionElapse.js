import { useSelector } from "react-redux";
import { nodesHeightSelector } from "store/reducers/nodeSlice";
import CountDown from "components/countDown";
import Tooltip from "./tooltip";
import { useEstimateBlocksTime } from "utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "utils";

export default function MotionElapse({ motion, chain }) {
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
    <Tooltip
      content={`End in ${estimatedBlocksTime}, #${bigNumber2Locale(
        motionEndHeight.toString()
      )}`}
    >
      <div>
        <CountDown percent={parseInt(elapsePercent * 100)} />
      </div>
    </Tooltip>
  );
}
