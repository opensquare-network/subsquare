import React from "react";
import TimeDuration from "../../TimeDuration";
import CountDown from "../../_CountDown";
import Wrapper from "./wrapper";
import getRemaining from "./common";
import usePercentage from "./usePercentage";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export default function ConfirmCountdown({ detail }) {
  const latestHeight = useAhmLatestHeight();
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const confirmPeriod = trackInfo?.confirmPeriod;
  const confirmSince = onchain?.lastConfirmStartedAt?.blockHeight;
  const confirmEnd = confirmSince + confirmPeriod;

  const confirmRemaining = getRemaining(
    latestHeight,
    confirmSince,
    confirmPeriod,
  );
  const confirmPercentage = usePercentage(confirmSince, confirmPeriod);

  return (
    <Wrapper>
      <CountDown
        denominator={100}
        numerator={confirmPercentage}
        foregroundColor="var(--green500)"
        backgroundColor="var(--green100)"
        tooltipContent={
          confirmRemaining > 0 && (
            <span>
              Confirming end in <TimeDuration blocks={confirmRemaining} /> #
              {confirmEnd?.toLocaleString()}
            </span>
          )
        }
      />
    </Wrapper>
  );
}
