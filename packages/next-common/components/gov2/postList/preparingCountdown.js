import React from "react";
import { useSelector } from "react-redux";
import getRemaining from "./common";
import Wrapper from "./wrapper";
import CountDown from "../../_CountDown";
import TimeDuration from "../../TimeDuration";
import usePercentage from "./usePercentage";
import FellowshipTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/fellowshipTimeoutCountdown";
import ReferendaTimeoutCountdown from "next-common/components/gov2/postList/timeoutCountdown/referendaTimeoutCountdown";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function PreparingCountdown({ detail, isFellowship = false }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const preparePeriod = trackInfo?.preparePeriod;
  const submitted = onchain?.info?.submitted;
  const prepareEnd = submitted + preparePeriod;
  const hasPutDecisionDeposit = onchain?.info?.decisionDeposit;

  const remaining = getRemaining(latestHeight, submitted, preparePeriod);
  const preparePercentage = usePercentage(submitted, preparePeriod);

  if (remaining <= 0) {
    return isFellowship ? (
      <FellowshipTimeoutCountdown detail={detail} />
    ) : (
      <ReferendaTimeoutCountdown detail={detail} />
    );
  }

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
