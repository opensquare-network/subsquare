import BigNumber from "bignumber.js";
import { cn } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";

export default function AssetBreakdown({
  usdTotal,
  rows = [],
  align = "left",
}) {
  if (!rows || rows.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col", { "items-end": align === "right" })}>
      <div className="text-textPrimary mb-2">${usdTotal}</div>
      <div
        className={cn("flex flex-col gap-1", {
          "items-end": align === "right",
        })}
      >
        {rows.map((row, i) => (
          <TokenSymbolAsset
            key={i}
            amount={new BigNumber(row.value || 0)
              .div(new BigNumber(10).pow(row.decimals))
              .toFixed(row.decimals > 6 ? 4 : 2)}
            symbol={row.symbol}
          />
        ))}
      </div>
    </div>
  );
}
