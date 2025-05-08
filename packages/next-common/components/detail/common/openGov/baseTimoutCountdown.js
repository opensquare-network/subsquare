import { useOnchainData } from "next-common/context/post";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import CountDown from "next-common/components/_CountDown";
import React from "react";
import useChainOrScanHeight from "next-common/hooks/height";

export default function BaseTimeoutCountdown({ timeout }) {
  const now = useChainOrScanHeight();
  const onchain = useOnchainData();
  const submitted = onchain.info?.submitted;
  const timeoutAt = submitted + timeout || 0;

  const estimatedBlocksTime = useEstimateBlocksTime(timeoutAt - now);
  if (!timeout) {
    return;
  }

  const text = `Timeout in ${estimatedBlocksTime}`;
  return (
    <CountDownWrapper>
      <CountDown
        numerator={now - submitted}
        denominator={timeout}
        tooltipContent={text}
      />
      <span>{text}</span>
    </CountDownWrapper>
  );
}
