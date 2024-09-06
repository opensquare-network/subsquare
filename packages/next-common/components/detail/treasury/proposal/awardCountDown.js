import React, { useEffect, useState, useMemo } from "react";
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
import { useTreasuryPallet } from "next-common/context/treasury";

export default function TreasuryAwardCountDown() {
  const api = useContextApi();
  const blockHeight = useSelector(chainOrScanHeightSelector);

  const { proposalIndex } = useOnchainData();
  const pallet = useTreasuryPallet();

  const { approvalsQuery, spendPeriod } = useMemo(() => {
    const query = api?.query?.[pallet]?.approvals;
    const period = api?.consts?.[pallet]?.spendPeriod;

    return { approvalsQuery: query, spendPeriod: period?.toNumber() || null };
  }, [api, pallet]);

  const [gone, setGone] = useState(null);
  const estimatedBlocksTime = useEstimateBlocksTime(spendPeriod - gone);

  useEffect(() => {
    if (spendPeriod && blockHeight) {
      setGone(new BigNumber(blockHeight).mod(spendPeriod).toNumber());
    }
  }, [blockHeight, spendPeriod]);

  const { value: rawApprovals } = useCall(approvalsQuery, []);

  if (!gone || !rawApprovals) return null;

  const approvalsList = rawApprovals.toJSON() || [];
  if (!approvalsList.includes(proposalIndex)) return null;

  const shortText = `Next award in ${estimatedBlocksTime}`;
  const longText = `${shortText}, #${bigNumber2Locale(
    new BigNumber(blockHeight + spendPeriod - gone).toString(),
  )}`;

  return (
    <CountDownWrapper>
      <CountDown
        numerator={gone}
        denominator={spendPeriod}
        tooltipContent={longText}
      />
      <span>{shortText}</span>
    </CountDownWrapper>
  );
}
