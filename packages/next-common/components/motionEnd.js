import React from "react";
import { useSelector } from "react-redux";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";
import { latestHeightSelector } from "../store/reducers/chainSlice";
import CountDown from "./_CountDown";

export default function MotionEnd({ motion, type = "full" }) {
  const blockHeight = useSelector(latestHeightSelector);
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    blockHeight - motionEndHeight
  );
  const motionEnd = isMotionEnded(motion);

  if (
    motionEnd ||
    !motionEndHeight ||
    !blockHeight ||
    blockHeight >= motionEndHeight ||
    !estimatedBlocksTime
  ) {
    return null;
  }

  return (
    <>
      <CountDown
        numerator={blockHeight - motionStartHeight}
        denominator={motionEndHeight - motionStartHeight}
        tooltipContent={`End in ${estimatedBlocksTime}, #${bigNumber2Locale(
          motionEndHeight.toString()
        )}`}
      />
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
