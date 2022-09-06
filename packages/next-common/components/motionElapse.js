import React from "react";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";
import { latestHeightSelector } from "../store/reducers/chainSlice";
import CountDown from "./_CountDown";

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

  return (
    <CountDown
      numerator={latestHeight - motionStartHeight}
      denominator={motionEndHeight - motionStartHeight}
      tooltipContent={`End in ${estimatedBlocksTime}, #${bigNumber2Locale(
        motionEndHeight.toString()
      )}`}
    />
  );
}
