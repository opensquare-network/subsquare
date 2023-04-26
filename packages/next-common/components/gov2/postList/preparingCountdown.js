import React from "react";
import { useTheme } from "styled-components";
import { useSelector } from "react-redux";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import getRemaining from "./common";
import Wrapper from "./wrapper";
import CountDown from "../../_CountDown";
import TimeDuration from "../../TimeDuration";
import usePercentage from "./usePercentage";

export default function PreparingCountdown({ detail }) {
  const { secondaryBlue500, secondaryBlue100 } = useTheme();
  const latestHeight = useSelector(latestHeightSelector);
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
        foregroundColor={secondaryBlue500}
        backgroundColor={secondaryBlue100}
        tooltipContent={
          remaining > 0 ? (
            <span>
              Preparing end in <TimeDuration blocks={remaining} /> #
              {prepareEnd?.toLocaleString()}
            </span>
          ) : <span>Preparation ended{ hasPutDecisionDeposit ? "" : ", waiting for decision deposit" }</span>
        }
      />
    </Wrapper>
  );
}
