import Wrapper from "../wrapper";
import CountDown from "next-common/components/_CountDown";
import React from "react";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import useChainOrScanHeight from "next-common/hooks/height";

export default function TimeoutCountDown({ detail = {}, timeout }) {
  const now = useChainOrScanHeight();

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
