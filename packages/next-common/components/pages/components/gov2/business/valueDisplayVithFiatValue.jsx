import { toPrecisionNumber } from "next-common/utils";
import useFiatValueTooltipContent from "next-common/components/postList/common/useFiatValueTooltipContent";
import ValueDisplay from "next-common/components/valueDisplay";

export default function ValueDisplayWithFiatValue({
  amount,
  decimals,
  symbol,
  className,
}) {
  const value = toPrecisionNumber(amount, decimals);
  const fiatValueTooltip = useFiatValueTooltipContent(amount, decimals, symbol);

  return (
    <ValueDisplay
      value={value}
      symbol={symbol}
      tooltipOtherContent={fiatValueTooltip}
      className={className}
    />
  );
}
