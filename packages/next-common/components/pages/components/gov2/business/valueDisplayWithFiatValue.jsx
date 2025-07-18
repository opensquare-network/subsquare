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

  return (
    <ValueDisplay
      value={value}
      symbol={symbol}
      tooltipOtherContent={<FormatFiatValue amount={amount} symbol={symbol} />}
      className={className}
    />
  );
}

export function FormatFiatValue({ amount, symbol }) {
  const valueFiatPrice = useTokenFiatValue(amount, symbol);
  const isInFinalState = useIsReferendumFinalState();

  if (!valueFiatPrice || isInFinalState) {
    return null;
  }

  return `( ≈ $${valueFiatPrice} )`;
}
