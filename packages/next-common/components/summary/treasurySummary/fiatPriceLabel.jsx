import BigNumber from "bignumber.js";
import { abbreviateBigNumber, cn } from "next-common/utils";

export default function TreasurySummaryFiatPriceLabel({
  value = 0,
  fiatPrice = 0,
  className = "",
}) {
  const bn = BigNumber(value);
  const totalPrice = bn.multipliedBy(fiatPrice);

  return (
    <div className={cn("text12Medium text-textTertiary", className)}>
      {!!(value && fiatPrice) && "≈"} ${abbreviateBigNumber(totalPrice)}
    </div>
  );
}
