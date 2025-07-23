import { useChainSettings } from "next-common/context/chain";
import BigNumber from "bignumber.js";
import { abbreviateBigNumber, toPrecisionNumber } from "next-common/utils";
import { nativeTokenPriceSelector } from "next-common/store/reducers/common";
import { useSelector } from "react-redux";
import { isNil } from "lodash-es";
import { useMemo } from "react";

export default function useTokenFiatValue(value, symbol) {
  const price = useSelector(nativeTokenPriceSelector);
  const chainConfig = useChainSettings();
  const tokenAmount = toPrecisionNumber(value, chainConfig.decimals);

  const tokenFiatValue = useMemo(() => {
    if (isNil(price) || !value || chainConfig.symbol !== symbol) {
      return null;
    }

    return abbreviateBigNumber(BigNumber(tokenAmount).multipliedBy(price));
  }, [chainConfig.symbol, price, symbol, tokenAmount, value]);

  return tokenFiatValue;
}
