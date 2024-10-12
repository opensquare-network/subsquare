import React from "react";
import CountDown from "next-common/components/_CountDown";
import TimeDuration from "../../TimeDuration";
import Wrapper from "./wrapper";
import getRemaining from "./common";
import usePercentage from "./usePercentage";
import { useBlockHeight } from "next-common/hooks/common/useBlockHeight";

export default function DecisionCountdown({ detail }) {
  const latestHeight = useBlockHeight();
  const onchain = detail?.onchainData;
  const info = onchain?.info;
  const trackInfo = onchain?.trackInfo;

  const confirming = info?.deciding?.confirming;

  const decisionPeriod = trackInfo?.decisionPeriod;
  const decisionSince = info?.deciding?.since;
  const decisionEnd = Math.max(decisionSince + decisionPeriod, confirming || 0);

  const decisionRemaining = getRemaining(
    latestHeight,
    decisionSince,
    decisionPeriod,
  );
  const decisionPercentage = usePercentage(decisionSince, decisionPeriod);

  return (
    <Wrapper>
      <CountDown
        denominator={100}
        numerator={decisionPercentage}
        foregroundColor="var(--blue500)"
        backgroundColor="var(--blue100)"
        tooltipContent={
          decisionRemaining > 0 && (
            <span>
              Deciding end in <TimeDuration blocks={decisionRemaining} />, #
              {decisionEnd.toLocaleString()}
            </span>
          )
        }
      />
    </Wrapper>
  );
}
