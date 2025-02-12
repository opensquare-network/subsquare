import AssetIcon from "next-common/components/icons/assetIcon";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn } from "next-common/utils";
import { useNativeTokenIcon } from "next-common/components/assets/known";

export default function TokenSymbolAsset({
  amount,
  symbol,
  valueClassName,
  type = "",
}) {
  const NativeAssetIcon = useNativeTokenIcon();

  return (
    <div className="flex items-center gap-x-2">
      {type === "native" ? (
        <NativeAssetIcon symbol={symbol} className="w-4 h-4 flex-none" />
      ) : (
        <AssetIcon symbol={symbol} className="w-4 h-4 flex-none" />
      )}
      <ValueDisplay
        value={amount}
        symbol={symbol}
        className={cn("text12Medium text-textTertiary", valueClassName)}
        tooltipClassName={"inline-flex items-center"}
      />
    </div>
  );
}
