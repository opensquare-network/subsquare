import BigNumber from "bignumber.js";
import { useChainSettings } from "next-common/context/chain";
import { useFiatPriceSnapshot } from "next-common/hooks/useFiatPrice";
import { toPrecision } from "next-common/utils";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { useMemo } from "react";

// support native and asset symbols
export default function useSumExtractedAssetKinds(extracteds = []) {
  const { decimals } = useChainSettings();
  const { price: fiatPrice } = useFiatPriceSnapshot();

  return useMemo(() => {
    return extracteds?.reduce((acc, item) => {
      const { assetKind, amount } = item ?? {};
      if (assetKind?.type === "native") {
        const amountInFiat = BigNumber(
          toPrecision(amount, decimals),
        ).multipliedBy(fiatPrice ?? 0);
        return acc.plus(amountInFiat ?? 0);
      } else if (SYMBOL_DECIMALS[assetKind?.symbol]) {
        return acc.plus(
          toPrecision(amount, SYMBOL_DECIMALS[assetKind?.symbol]),
        );
      }
      return acc;
    }, BigNumber(0));
  }, [extracteds, decimals, fiatPrice]);
}
