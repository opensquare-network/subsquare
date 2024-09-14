import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "./tokenSymbolAsset";

export default function DotTokenSymbolAsset({ free = 0 }) {
  const { decimals, symbol } = useChainSettings();
  const value = toPrecision(free || 0, decimals);

  return (
    <div>
      <TokenSymbolAsset amount={value} symbol={symbol} />
    </div>
  );
}
