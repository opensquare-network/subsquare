import Wrapper from "../wrapper";
import CountDown from "next-common/components/_CountDown";
import React from "react";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export default function TimeoutCountDown({ detail = {}, timeout }) {
  const now = useAhmLatestHeight();

  const onchain = detail?.onchainData;
  const submitted = onchain.info.submitted;
  const timeoutAt = submitted + timeout || 0;
  const estimatedBlocksTime = useEstimateBlocksTime(timeoutAt - now);
  if (!timeout) {
    return;
  }

  const text = `Timeout in ${estimatedBlocksTime}`;
  return (
    <Wrapper>
      <CountDown
        numerator={now - submitted}
        denominator={timeout}
        tooltipContent={text}
      />
    </Wrapper>
  );
}
