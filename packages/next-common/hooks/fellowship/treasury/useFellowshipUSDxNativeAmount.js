import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { getAssetBySymbol } from "next-common/hooks/treasury/useAssetHubTreasuryBalance";
import { getFellowshipUSDxAssetKindParam } from "next-common/components/preImages/createPreimagePopup/templates/newFellowshipUSDxTreasuryProposalPopup";
import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";

// FixedU128 scale used by AssetRate.conversionRateToNative.
const fixedU128Accuracy = Math.pow(10, 18);

function getNativeAmount(inputBalance, assetDecimals, nativeDecimals, rate) {
  const assetAmount = new BigNumber(inputBalance).times(
    new BigNumber(10).pow(assetDecimals),
  );

  if (!assetAmount.isFinite() || !assetAmount.isInteger()) {
    return null;
  }

  const nativeAmount = assetAmount
    .times(rate)
    .dividedBy(fixedU128Accuracy)
    .integerValue(BigNumber.ROUND_FLOOR);

  return nativeAmount
    .dividedBy(new BigNumber(10).pow(nativeDecimals))
    .toString();
}

export function useFellowshipUSDxNativeAmount(inputBalance, symbol) {
  const api = useContextApi();
  const { decimals: nativeDecimals } = useChainSettings();
  const [rate, setRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const asset = useMemo(() => getAssetBySymbol(symbol), [symbol]);
  const assetKind = useMemo(
    () => asset && getFellowshipUSDxAssetKindParam(asset),
    [asset],
  );

  useEffect(() => {
    if (!api?.query?.assetRate?.conversionRateToNative || !assetKind) {
      setRate(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setRate(null);
    setIsLoading(true);

    api.query.assetRate
      .conversionRateToNative(assetKind)
      .then((value) => {
        if (cancelled) {
          return;
        }

        setRate(value.isSome ? value.unwrap().toString() : null);
      })
      .catch(() => {
        if (!cancelled) {
          setRate(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, assetKind]);

  const nativeAmount = useMemo(() => {
    if (!inputBalance || !asset || rate == null) {
      return null;
    }

    return getNativeAmount(inputBalance, asset.decimals, nativeDecimals, rate);
  }, [inputBalance, asset, nativeDecimals, rate]);

  return {
    nativeAmount,
    isLoading,
  };
}
