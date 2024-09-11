import AssetIcon from "next-common/components/icons/assetIcon";
import TreasurySpendValueDisplay from "next-common/components/gov2/business/treasurySpendValueDisplay";

export default function TokenSymbolAssets({ amount, symbol, type }) {
  return (
    <div className="flex items-center gap-x-2">
      <AssetIcon symbol={symbol} className="w-4 h-4" />
      <TreasurySpendValueDisplay
        type={type}
        amount={amount}
        symbol={symbol}
        className="text12Medium text-textTertiary"
      />
    </div>
  );
}
