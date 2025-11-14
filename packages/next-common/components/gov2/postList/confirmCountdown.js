import React from "react";
import TimeDuration from "../../TimeDuration";
import CountDown from "../../_CountDown";
import Wrapper from "./wrapper";
import getRemaining from "./common";
import usePercentage from "./usePercentage";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import { isNil } from "lodash-es";

export default function ConfirmCountdown({ detail }) {
  const latestHeight = useAhmLatestHeight();
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const confirmPeriod = trackInfo?.confirmPeriod;
  const confirmEnd = onchain.info?.deciding?.confirming;
  const confirmSince = confirmEnd - confirmPeriod;

  const confirmRemaining = getRemaining(
    latestHeight,
    confirmSince,
    confirmPeriod,
  );
  const confirmPercentage = usePercentage(confirmSince, confirmPeriod);

  if (isNil(confirmEnd)) {
    return null;
  }

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
