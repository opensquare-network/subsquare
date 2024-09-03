import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";

export default function TreasurySpendValueDisplay({
  className = "",
  type,
  amount,
  symbol,
  showTooltip,
}) {
  let { decimals } = useChainSettings();

  if (type !== "native") {
    decimals = SYMBOL_DECIMALS[symbol];
  }

  return (
    <ValueDisplay
      value={toPrecision(amount, decimals)}
      symbol={symbol}
      showTooltip={showTooltip}
      className={cn("inline-flex", className)}
    />
  );
}
