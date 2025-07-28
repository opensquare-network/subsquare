import React from "react";
import getRemaining from "./common";
import Wrapper from "./wrapper";
import CountDown from "../../_CountDown";
import TimeDuration from "../../TimeDuration";
import usePercentage from "./usePercentage";
import FellowshipTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/fellowshipTimeoutCountdown";
import ReferendaTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/referendaTimeoutCountdown";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

function PreparingCountdownImpl({ detail }) {
  const latestHeight = useAhmLatestHeight();
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const preparePeriod = trackInfo?.preparePeriod;
  const submitted = onchain?.info?.submitted;
  const prepareEnd = submitted + preparePeriod;
  const hasPutDecisionDeposit = onchain?.info?.decisionDeposit;

  const remaining = getRemaining(latestHeight, submitted, preparePeriod);
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
  const latestHeight = useAhmLatestHeight();
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const preparePeriod = trackInfo?.preparePeriod;
  const submitted = onchain?.info?.submitted;

  const remaining = getRemaining(latestHeight, submitted, preparePeriod);

  if (remaining <= 0) {
    return <ReferendaTimeoutCountdown detail={detail} />;
  }

  return <PreparingCountdownImpl detail={detail} />;
}

export function FellowshipPreparingCountdown({ detail }) {
  const latestHeight = useAhmLatestHeight();
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const preparePeriod = trackInfo?.preparePeriod;
  const submitted = onchain?.info?.submitted;

  const remaining = getRemaining(latestHeight, submitted, preparePeriod);

  if (remaining <= 0) {
    return <FellowshipTimeoutCountdown detail={detail} />;
  }

  return <PreparingCountdownImpl detail={detail} />;
}
