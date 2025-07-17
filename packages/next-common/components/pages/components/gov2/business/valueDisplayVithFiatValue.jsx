import { toPrecisionNumber } from "next-common/utils";
import useFiatValueTooltipContent from "next-common/components/postList/common/useFiatValueTooltipContent";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePostIsVoting } from "next-common/context/post";

export default function ValueDisplayWithFiatValue({
  amount,
  decimals,
  symbol,
  className,
}) {
  const value = toPrecisionNumber(amount, decimals);
  const fiatValueTooltip = useFiatValueTooltipContent(amount, decimals, symbol);
  const isVoting = usePostIsVoting();

  return (
    <ValueDisplay
      value={value}
      symbol={symbol}
      tooltipOtherContent={isVoting && fiatValueTooltip}
      className={className}
    />
  );
}
