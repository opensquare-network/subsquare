import React from "react";
import { useSelector } from "react-redux";
import CountDown from "next-common/components/countDown";
import Tooltip from "next-common/components/tooltip";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";
import { latestHeightSelector } from "../store/reducers/chainSlice";

export default function MotionElapse({ motion }) {
  const latestHeight = useSelector(latestHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    latestHeight - motionEndHeight
  );
  const motionEnd = isMotionEnded(motion);

  if (
    motionEnd ||
    !motionEndHeight ||
    !latestHeight ||
    latestHeight >= motionEndHeight ||
    !estimatedBlocksTime
  ) {
    return null;
  }

  const elapsePercent =
    (latestHeight - motionStartHeight) /
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
