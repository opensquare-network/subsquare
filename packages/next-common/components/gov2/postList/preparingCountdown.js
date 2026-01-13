import React, { useMemo } from "react";
import getRemaining from "./common";
import Wrapper from "./wrapper";
import CountDown from "../../_CountDown";
import TimeDuration from "../../TimeDuration";
import usePercentage from "./usePercentage";
import ReferendaTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/referendaTimeoutCountdown";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

export function useRemaining(detail) {
  const latestHeight = useAhmLatestHeight();
  return useMemo(() => {
    const onchain = detail?.onchainData;
    const trackInfo = onchain?.trackInfo;
    const preparePeriod = trackInfo?.preparePeriod;
    const submitted = onchain?.info?.submitted;
    return getRemaining(latestHeight, submitted, preparePeriod);
  }, [detail?.onchainData, latestHeight]);
}

export function PreparingCountdownImpl({ detail }) {
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const preparePeriod = trackInfo?.preparePeriod;
  const submitted = onchain?.info?.submitted;
  const prepareEnd = submitted + preparePeriod;
  const hasPutDecisionDeposit = onchain?.info?.decisionDeposit;
  const remaining = useRemaining(detail);
  const preparePercentage = usePercentage(submitted, preparePeriod);

  return (
    <Wrapper>
      <CountDown
        denominator={100}
        numerator={preparePercentage}
        foregroundColor="var(--blue500)"
        backgroundColor="var(--blue100)"
        tooltipContent={
          remaining > 0 ? (
            <span>
              Preparing end in <TimeDuration blocks={remaining} /> #
              {prepareEnd?.toLocaleString()}
            </span>
          ) : (
            <span>
              Preparation ended
              {hasPutDecisionDeposit ? "" : ", waiting for decision deposit"}
            </span>
          )
        }
      />
    </Wrapper>
  );
}

export default function PreparingCountdown({ detail }) {
  const remaining = useRemaining(detail);

  if (remaining <= 0) {
    return <ReferendaTimeoutCountdown detail={detail} />;
  }

  return <PreparingCountdownImpl detail={detail} />;
}
