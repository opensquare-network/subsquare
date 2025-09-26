import BigNumber from "bignumber.js";
import useChainOrScanHeight from "next-common/hooks/height";
import { useEstimateBlocksTime } from "next-common/utils/hooks";
import { bigNumber2Locale } from "next-common/utils";
import CountDown from "next-common/components/_CountDown";
import { CountDownWrapper } from "next-common/components/detail/common/styled";
import { useMemo } from "react";
import { useTreasuryPallet } from "next-common/context/treasury";
import { useTreasuryApprovals } from "next-common/context/treasury/approvals";
import useSpendPeriod from "../useSpendPeriod";

const DEFAULT_RESULT = {
  component: null,
};

export default function useAwardCountDown({ proposalIndex, showText = true }) {
  const { approvalsList = [] } = useTreasuryApprovals();
  const pallet = useTreasuryPallet();
  const blockHeight = useChainOrScanHeight();

  const spendPeriod = useSpendPeriod(pallet);

  const gone = useMemo(() => {
    if (!spendPeriod || !blockHeight) return null;
    return new BigNumber(blockHeight).mod(spendPeriod).toNumber();
  }, [blockHeight, spendPeriod]);

  const estimatedBlocksTime = useEstimateBlocksTime(spendPeriod - gone);

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
