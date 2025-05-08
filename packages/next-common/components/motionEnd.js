import React from "react";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale, isMotionEnded } from "next-common/utils";
import CountDown from "./_CountDown";
import useChainOrScanHeight from "next-common/hooks/height";

export default function MotionEnd({ motion, type = "full" }) {
  const blockHeight = useChainOrScanHeight();
  const motionEndHeight = motion?.voting?.end;
  const motionStartHeight = motion?.indexer?.blockHeight;
  const estimatedBlocksTime = useEstimateBlocksTime(
    motionEndHeight - blockHeight,
  );
  const motionEnd = isMotionEnded(motion);

  if (motionEnd || !motionEndHeight || !blockHeight || !estimatedBlocksTime) {
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
    simpleTooltipContent = `End in ${estimatedBlocksTime}`;
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
