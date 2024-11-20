import ForeignAssetIcon from "next-common/components/icons/foreignAssetIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn } from "next-common/utils";

export default function TokenSymbolForeignAsset({ amount, symbol, className }) {
  return (
    <div className="flex items-center gap-x-2">
      <ForeignAssetIcon symbol={symbol} className="w-4 h-4" />
      <ValueDisplay
        value={amount}
        symbol={symbol}
        className={cn("text12Medium text-textTertiary", className)}
        tooltipClassName={"inline-flex items-center"}
      />
    </div>
  );
}
