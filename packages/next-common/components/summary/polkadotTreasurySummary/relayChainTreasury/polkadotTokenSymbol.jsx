import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TokenSymbolAssets from "../common/tokenSymbolAssets";

export default function PolkadotTokenSymbol({ free = 0 }) {
  const { decimals, symbol } = useChainSettings();
  const value = toPrecision(free || 0, decimals);

  return (
    <div>
      <TokenSymbolAssets amount={value} symbol={symbol} />
    </div>
  );
}
