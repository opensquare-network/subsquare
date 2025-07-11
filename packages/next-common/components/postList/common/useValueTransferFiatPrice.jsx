import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import { createGlobalState } from "react-use";

export const useRealTimeFiatPrice = createGlobalState(0);

export default function useValueTransferFiatPrice(value, decimals, symbol) {
  const [price] = useRealTimeFiatPrice();
  const chainConfig = useChainSettings();

  if (!price || !value || chainConfig.symbol !== symbol) {
    return null;
  }

  const valueFiatPrice = abbreviateBigNumber(
    BigNumber(value).dividedBy(Math.pow(10, decimals)).multipliedBy(price),
  );

  return `( ≈ $${valueFiatPrice} )`;
}
