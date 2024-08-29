import NetworkIcon from "next-common/components/networkIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChain } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import Chains from "next-common/utils/consts/chains";
import getChainSettings from "next-common/utils/consts/settings";

export default function TreasurySpendValueDisplay({
  className = "",
  type,
  chain,
  amount,
  symbol,
}) {
  const currentChain = useChain();

  if (type === "assets") {
    chain = Chains.polkadotAssetHub;
  } else if (type === "native") {
    chain = currentChain;
  }

  const { decimals } = getChainSettings(chain);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-x-2",
        "text14Medium",
        className,
      )}
    >
      <NetworkIcon chain={chain} className="w-3 h-3" />

      <ValueDisplay value={toPrecision(amount, decimals)} symbol={symbol} />
    </div>
  );
}
