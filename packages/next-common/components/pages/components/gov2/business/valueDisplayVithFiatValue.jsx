import { toPrecisionNumber } from "next-common/utils";
import useFiatValueTooltipContent from "next-common/components/postList/common/useFiatValueTooltipContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { useIsReferendumFinalState } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function ValueDisplayWithFiatValue({
  amount,
  decimals,
  symbol,
  className,
}) {
  const value = toPrecisionNumber(amount, decimals);
  const fiatValueTooltip = useFiatValueTooltipContent(amount, decimals, symbol);
  const isInFinalState = useIsReferendumFinalState();

  return (
    <ValueDisplay
      value={value}
      symbol={symbol}
      tooltipOtherContent={!isInFinalState && fiatValueTooltip}
      className={className}
    />
  );
}
