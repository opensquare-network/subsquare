import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import Wrapper from "../wrapper";
import CountDown from "next-common/components/_CountDown";
import React from "react";
import { useEstimateBlocksTime } from "next-common/utils/hooks";

export default function TimeoutCountDown({ detail = {}, timeout }) {
  const now = useSelector(latestHeightSelector);

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
