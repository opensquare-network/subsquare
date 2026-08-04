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
          <TokenSymbolAsset key={i} amount={row.value} symbol={row.symbol} />
        ))}
      </div>
    </div>
  );
}
