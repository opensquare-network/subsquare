import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import Loading from "next-common/components/loading";
import { useRealTimeFiatPrice } from "next-common/context/realTimeFiatPrice";

export default function useValueTransferFiatPrice(value, decimals, symbol) {
  const { price, loading } = useRealTimeFiatPrice();
  const chainConfig = useChainSettings();

  if (loading || !value || chainConfig.symbol !== symbol) {
    return null;
  }

  const valueFiatPrice = abbreviateBigNumber(
    BigNumber(value).dividedBy(Math.pow(10, decimals)).multipliedBy(price),
  );

  return loading ? (
    <span className="pl-1 inline-flex items-center">
      <Loading size={14} color="var(--neutral100)" />
    </span>
  ) : (
    `( ≈ $${valueFiatPrice} )`
  );
}
