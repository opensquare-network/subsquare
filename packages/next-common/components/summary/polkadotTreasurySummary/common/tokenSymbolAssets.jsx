import AssetIcon from "next-common/components/icons/assetIcon";
import ValueDisplay from "next-common/components/valueDisplay";

export default function TokenSymbolAssets({ amount, symbol }) {
  return (
    <div className="flex items-center gap-x-2">
      <AssetIcon symbol={symbol} className="w-4 h-4" />
      <ValueDisplay
        value={amount}
        symbol={symbol}
        className={"text12Medium text-textTertiary"}
      />
    </div>
  );
}
