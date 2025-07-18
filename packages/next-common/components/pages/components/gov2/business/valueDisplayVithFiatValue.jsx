import { toPrecisionNumber } from "next-common/utils";
import useTokenFiatValue from "next-common/hooks/balance/useTokenFiatValue";
import ValueDisplay from "next-common/components/valueDisplay";
import { useIsReferendumFinalState } from "next-common/context/post/referenda/useReferendumVotingFinishHeight";

export default function ValueDisplayWithFiatValue({
  amount,
  decimals,
  symbol,
  className,
}) {
  const value = toPrecisionNumber(amount, decimals);
  const valueFiatPrice = useTokenFiatValue(amount, symbol);
  const formattedFiatValue = valueFiatPrice && `( ≈ $${valueFiatPrice} )`;
  const isInFinalState = useIsReferendumFinalState();

  return (
    <ValueDisplay
      value={value}
      symbol={symbol}
      tooltipOtherContent={!isInFinalState && formattedFiatValue}
      className={className}
    />
  );
}
