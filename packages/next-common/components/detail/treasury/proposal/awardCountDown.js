import useApi from "next-common/utils/hooks/useApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale } from "next-common/utils";
import CountDown from "next-common/components/_CountDown";
import useCall from "next-common/utils/hooks/useCall";
import { useOnchainData } from "next-common/context/post";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";

export default function TreasuryAwardCountDown() {
  const api = useApi();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [period, setPeriod] = useState(null);
  const [gone, setGone] = useState(null);
  const estimatedBlocksTime = useEstimateBlocksTime(period - gone);
  const [rawApprovals] = useCall(api?.query?.treasury?.approvals, []);
  const { proposalIndex } = useOnchainData();

  useEffect(() => {
    if (!api || !api.consts.treasury) {
      return;
    }

    setPeriod(api.consts.treasury.spendPeriod.toNumber());
  }, [api]);

  useEffect(() => {
    if (period && blockHeight) {
      setGone(new BigNumber(blockHeight).mod(period).toNumber());
    }
  }, [blockHeight, period]);

  if (!gone) {
    return null;
  }

  if (!rawApprovals || !(rawApprovals.toJSON() || []).includes(proposalIndex)) {
    return;
  }

  const shortText = `Next award in ${estimatedBlocksTime}`;
  const longText = `${shortText}, #${bigNumber2Locale(
    new BigNumber(blockHeight + period - gone).toString(),
  )}`;
  return (
    <CountDownWrapper>
      <CountDown
        numerator={gone}
        denominator={period}
        tooltipContent={longText}
      />
      <span>{shortText}</span>
    </CountDownWrapper>
  );
}
