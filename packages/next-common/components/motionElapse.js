import React from "react";
import { useSelector } from "react-redux";
import { nodesHeightSelector } from "next-common/store/reducers/nodeSlice";
import CountDown from "next-common/components/countDown";
import Tooltip from "next-common/components/tooltip";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";

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
