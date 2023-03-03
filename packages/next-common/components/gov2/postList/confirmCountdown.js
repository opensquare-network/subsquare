import React from "react";
import isNil from "lodash.isnil";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import styled, { useTheme } from "styled-components";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import Flex from "../../styled/flex";
import TimeDuration from "../../TimeDuration";
import CountDown from "../../_CountDown";

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0;
  }
`;

export default function ConfirmCountdown({ detail }) {
  const { secondaryGreen500, secondaryGreen100 } = useTheme();

  const latestHeight = useSelector(latestHeightSelector);
  const onchain = detail?.onchainData;
  const trackInfo = onchain?.trackInfo;

  const confirmPeriod = trackInfo?.confirmPeriod;
  const confirmSince = onchain?.lastConfirmStartedAt?.blockHeight;
  const confirmEnd = confirmSince + confirmPeriod;

  const confirmRemaining = getConfirmRemaining(
    latestHeight,
    confirmSince,
    confirmPeriod,
  );

  const confirmPercentage = useMemo(() => {
    if (isNil(latestHeight) || latestHeight <= confirmSince) {
      return 0;
    }

    if (latestHeight >= confirmEnd) {
      return 100;
    }

    const gone = latestHeight - confirmSince;
    return Number((gone / confirmPeriod) * 100).toFixed(2);
  }, [latestHeight]);

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

function getConfirmRemaining(latestHeight, confirmSince, confirmPeriod) {
  if (isNil(latestHeight) || latestHeight <= confirmSince) {
    return 0;
  }

  const gone = latestHeight - confirmSince;
  if (gone > confirmPeriod) {
    return 0;
  } else {
    return confirmPeriod - gone;
  }
}
