import { CountDownWrapper } from "next-common/components/detail/common/styled";
import { useOnchainData, usePostState } from "next-common/context/post";
import { gov2State } from "next-common/utils/consts/state";
import { useDecisionDeposit } from "next-common/context/post/gov2/referendum";
import useApi from "next-common/utils/hooks/useApi";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "next-common/store/reducers/chainSlice";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import CountDown from "next-common/components/_CountDown";
import React from "react";

function useUndecidingTimeout() {
  const api = useApi();

  if (api) {
    return api.consts.referenda.undecidingTimeout.toNumber();
  }

  return null;
}

function Countdown() {
  const timeout = useUndecidingTimeout();
  const now = useSelector(latestHeightSelector);
  const onchain = useOnchainData();
  const submitted = onchain.info.submitted;
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

export default function TimeoutCountdown() {
  const state = usePostState();
  const deposit = useDecisionDeposit();
  if (gov2State.Preparing !== state || deposit) {
    return;
  }

  return <Countdown />;
}
