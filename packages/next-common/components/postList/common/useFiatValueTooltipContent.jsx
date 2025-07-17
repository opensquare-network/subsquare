import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber } from "next-common/utils";
import { nativeTokenPriceSelector } from "next-common/store/reducers/common";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";

export default function useFiatValueTooltipContent(value, decimals, symbol) {
  const price = useSelector(nativeTokenPriceSelector);
  const chainConfig = useChainSettings();

  if (isNil(price) || !value || chainConfig.symbol !== symbol) {
    return null;
  }

  const valueFiatPrice = abbreviateBigNumber(
    BigNumber(value).dividedBy(Math.pow(10, decimals)).multipliedBy(price),
  );

  return `( ≈ $${valueFiatPrice} )`;
}
