import { useSelector } from "react-redux";
import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import CountDown from "components/countDown";
import Tooltip from "./tooltip";
import { useBlockTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";

export default function MotionElapse({ motion, chain }) {
  // const currentFinalHeight = useSelector(nodesHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  //todo : this is dev only, delete before commit
  const currentFinalHeight = motionEndHeight - 10000;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const blockTime = useBlockTime(currentFinalHeight - motionEndHeight, chain);
  const motionEnd = isMotionEnded(motion);

  if (
    motionEnd ||
    !motionEndHeight ||
    !currentFinalHeight ||
    currentFinalHeight >= motionEndHeight ||
    !blockTime
  ) {
    // return null;
  }

  const elapsePercent =
    (currentFinalHeight - motionStartHeight) /
    (motionEndHeight - motionStartHeight);
  return (
    <Tooltip
      content={`End in ${blockTime}, #${bigNumber2Locale(
        motionEndHeight.toString()
      )}`}
    >
      <div>
        <CountDown percent={parseInt(elapsePercent * 100)} />
      </div>
    </Tooltip>
  );
}
