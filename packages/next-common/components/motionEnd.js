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
    motionEndHeight - blockHeight,
  );
  const motionEnd = isMotionEnded(motion);

  if (
    motionEnd ||
    !motionEndHeight ||
    !blockHeight ||
    !estimatedBlocksTime
  ) {
    return null;
  }

  let tooltipContent;
  let simpleTooltipContent;
  if (blockHeight >= motionEndHeight) {
    tooltipContent = "Closeable";
    simpleTooltipContent = tooltipContent;
  } else {
    tooltipContent = `End in ${estimatedBlocksTime}, #${bigNumber2Locale(
      motionEndHeight.toString(),
    )}`;
    simpleTooltipContent = `End in ${ estimatedBlocksTime }`;
  }

  return (
    <>
      <CountDown
        numerator={blockHeight - motionStartHeight}
        denominator={motionEndHeight - motionStartHeight}
        tooltipContent={tooltipContent}
      />
      {type === "full" ? (
        <span>{tooltipContent}</span>
      ) : type === "simple" ? (
        <span>{simpleTooltipContent}</span>
      ) : null}
    </>
  );
}
