import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import TokenSymbolAsset from "./tokenSymbolAsset";

export default function NativeTokenSymbolAsset({ free = 0, valueClassName }) {
  const { decimals, symbol } = useChainSettings();
  const value = toPrecision(free || 0, decimals);

  return (
    <TokenSymbolAsset
      amount={value}
      symbol={symbol}
      valueClassName={valueClassName}
      type="native"
    />
  );
}
