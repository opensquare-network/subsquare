import ForeignAssetIcon from "next-common/components/icons/foreignAssetIcon";
import ValueDisplay from "next-common/components/valueDisplay";

export default function TokenSymbolForeignAsset({ amount, symbol }) {
  return (
    <div className="flex items-center gap-x-2">
      <ForeignAssetIcon symbol={symbol} className="w-4 h-4" />
      <ValueDisplay
        value={amount}
        symbol={symbol}
        className={"text12Medium text-textTertiary"}
        tooltipClassName={"inline-flex items-center"}
      />
    </div>
  );
}
