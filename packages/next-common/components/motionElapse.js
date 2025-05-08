import React from "react";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";
import CountDown from "./_CountDown";
import useChainOrScanHeight from "next-common/hooks/height";

export default function MotionElapse({ motion }) {
  const latestHeight = useChainOrScanHeight();
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    latestHeight - motionEndHeight,
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
        motionEndHeight.toString(),
      )}`}
    />
  );
}
