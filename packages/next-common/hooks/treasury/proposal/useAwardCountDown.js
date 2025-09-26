import BigNumber from "bignumber.js";
import useChainOrScanHeight from "next-common/hooks/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale } from "next-common/utils";
import CountDown from "next-common/components/_CountDown";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import { useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useTreasuryApprovals } from "next-common/context/treasury/approvals";

const DEFAULT_RESULT = {
  component: null,
};

export default function useAwardCountDown({ proposalIndex, showText = true }) {
  const { approvalsList = [] } = useTreasuryApprovals();
  const api = useContextApi();
  const pallet = useTreasuryPallet();
  const blockHeight = useChainOrScanHeight();

  const spendPeriod = useMemo(() => {
    return api?.consts?.[pallet]?.spendPeriod?.toNumber() || null;
  }, [api, pallet]);

  const [gone, setGone] = useState(null);
  const estimatedBlocksTime = useEstimateBlocksTime(spendPeriod - gone);

  useEffect(() => {
    if (spendPeriod && blockHeight) {
      setGone(new BigNumber(blockHeight).mod(spendPeriod).toNumber());
    }
  }, [blockHeight, spendPeriod]);

  if (!gone) return DEFAULT_RESULT;

  if (!approvalsList.includes(proposalIndex)) return DEFAULT_RESULT;

  const shortText = `Next award in ${estimatedBlocksTime}`;
  const longText = `${shortText}, #${bigNumber2Locale(
    new BigNumber(blockHeight + spendPeriod - gone).toString(),
  )}`;

  const BaseComponent = (
    <CountDown
      numerator={gone}
      denominator={spendPeriod}
      tooltipContent={longText}
    />
  );

  return {
    component: showText ? (
      <CountDownWrapper>
        {BaseComponent}
        <span>{shortText}</span>
      </CountDownWrapper>
    ) : (
      BaseComponent
    ),
  };
}
