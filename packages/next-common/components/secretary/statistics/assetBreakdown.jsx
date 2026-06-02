import BigNumber from "bignumber.js";
import { cn, formatNum } from "next-common/utils";
import TokenSymbolAsset from "next-common/components/summary/polkadotTreasurySummary/common/tokenSymbolAsset";

export default function AssetBreakdown({
  rows = [],
  usdExtra,
  align = "left",
}) {
  const usdFromRows = (rows || []).reduce((acc, row) => {
    const amount = new BigNumber(row.value || 0);
    const formattedAmount = amount.div(new BigNumber(10).pow(row.decimals));
    if (row.symbol === "USDT") {
      return acc.plus(formattedAmount);
    }
    if (row.price) {
      return acc.plus(formattedAmount.times(row.price));
    }
    return acc;
  }, new BigNumber(0));

  const totalUsd = usdExtra ? usdFromRows.plus(usdExtra) : usdFromRows;

  const nonEmptyRows = (rows || []).filter((r) => {
    const val = new BigNumber(r.value || 0);
    return val.gt(0);
  });

  if (nonEmptyRows.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col", { "items-end": align === "right" })}>
      <div className="text-textPrimary mb-2">
        ${formatNum(totalUsd.toFixed(2))}
      </div>
      <div
        className={cn("flex flex-col gap-1", {
          "items-end": align === "right",
        })}
      >
        {nonEmptyRows.map((row, i) => (
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
