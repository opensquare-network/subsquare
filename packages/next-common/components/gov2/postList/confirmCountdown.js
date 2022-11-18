import isNil from "lodash.isnil";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "styled-components";
import { latestHeightSelector } from "../../../store/reducers/chainSlice";
import TimeDuration from "../../TimeDuration";
import CountDown from "../../_CountDown";

export default function ConfirmCountdown({ detail }) {
  const { secondaryGreen500, secondaryGreen100 } = useTheme();

  const latestHeight = useSelector(latestHeightSelector);
  const onchain = detail?.onchainData;
  const info = onchain?.info;
  const trackInfo = onchain?.trackInfo;

  const confirmPeriod = trackInfo?.confirmPeriod;
  const confirmSince = info?.deciding?.confirming;
  const confirmEnd = confirmSince + confirmPeriod;

  const confirmRemaining = getConfirmRemaining(
    latestHeight,
    confirmSince,
    confirmPeriod
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
    <CountDown
      denominator={100}
      numerator={confirmPercentage}
      foregroundColor={secondaryGreen500}
      backgroundColor={secondaryGreen100}
      showTooltip={confirmRemaining > 0}
      tooltipContent={
        <span>
          Confirming end in <TimeDuration blocks={confirmRemaining} /> #
          {confirmEnd?.toLocaleString()}
        </span>
      }
    />
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
