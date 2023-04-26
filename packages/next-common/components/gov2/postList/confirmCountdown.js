import React from "react";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import TimeDuration from "../../TimeDuration";
import CountDown from "../../_CountDown";
import Wrapper from "./wrapper";
import getRemaining from "./common";
import usePercentage from "./usePercentage";

export default function ConfirmCountdown({ detail }) {
  const { secondaryGreen500, secondaryGreen100 } = useTheme();

  const latestHeight = useSelector(latestHeightSelector);
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const confirmPeriod = trackInfo?.confirmPeriod;
  const confirmSince = onchain?.lastConfirmStartedAt?.blockHeight;
  const confirmEnd = confirmSince + confirmPeriod;

  const confirmRemaining = getRemaining(latestHeight, confirmSince, confirmPeriod);
  const confirmPercentage = usePercentage(confirmSince, confirmPeriod);

  return (
    <Wrapper>
      <CountDown
        denominator={100}
        numerator={confirmPercentage}
        foregroundColor={secondaryGreen500}
        backgroundColor={secondaryGreen100}
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
