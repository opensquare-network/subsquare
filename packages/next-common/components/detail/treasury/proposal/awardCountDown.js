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
import { useContextApi } from "next-common/context/api";
import { useProposalsSection } from "next-common/context/treasury/proposals";

export default function TreasuryAwardCountDown() {
  const api = useContextApi();
  const blockHeight = useSelector(chainOrScanHeightSelector);
  const [period, setPeriod] = useState(null);
  const [gone, setGone] = useState(null);
  const estimatedBlocksTime = useEstimateBlocksTime(period - gone);
  const { proposalIndex } = useOnchainData();
  const section = useProposalsSection();

  const isCommunityTreasurySection = section === "communityTreasury";
  const approvalsQuery = isCommunityTreasurySection
    ? api?.query?.communityTreasury?.approvals
    : api?.query?.treasury?.approvals;

  useEffect(() => {
    if (!api || !api.consts) {
      return;
    }

    const spendPeriod = isCommunityTreasurySection
      ? api.consts.communityTreasury?.spendPeriod
      : api.consts.treasury?.spendPeriod;

    if (spendPeriod) {
      setPeriod(spendPeriod.toNumber());
    }
  }, [api, section]);

  useEffect(() => {
    if (period && blockHeight) {
      setGone(new BigNumber(blockHeight).mod(period).toNumber());
    }
  }, [blockHeight, period]);

  const { value: rawApprovals } = useCall(approvalsQuery, []);

  if (!gone) {
    return null;
  }

  if (!rawApprovals || !(rawApprovals.toJSON() || []).includes(proposalIndex)) {
    return null;
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
