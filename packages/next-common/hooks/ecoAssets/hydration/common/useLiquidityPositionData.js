import { useCallback, useMemo, useState, useEffect } from "react";
import { BN_NAN, scale } from "../utils";
import { queryAssetPrice } from "../useAssetsTotal";
import { useAllAssetsFunc } from "./useAllAssets";
import BigNumber from "bignumber.js";
import {
  calculate_liquidity_lrna_out,
  calculate_liquidity_out,
} from "@galacticcouncil/math-omnipool";
import { useOmniPoolTokens } from "./useHydrationPools";
import { useHydrationSDK } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

function useHubPrice(hub, loading) {
  const [price, setPrice] = useState(null);
  const sdk = useHydrationSDK();

  const fetchPrice = useCallback(async () => {
    if (loading || !sdk) {
      return;
    }

    try {
      const price = await queryAssetPrice(sdk, hub.id);
      setPrice(price);
    } catch (error) {
      console.error(error);
    }
  }, [hub.id, loading, sdk]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  return price;
}

function useOmnipoolAssetsPrice(assets, loading) {
  const [pricesMap, setPricesMap] = useState(null);
  const sdk = useHydrationSDK();

  const fetchPrices = useCallback(async () => {
    if (loading || !assets || !assets?.length || !sdk) {
      return;
    }

    try {
      const assetPrices = await Promise.all(
        assets.map(async (asset) => {
          const price = await queryAssetPrice(sdk, asset.id);
          return {
            id: asset.id,
            price,
          };
        }),
      );
      setPricesMap(assetPrices);
    } catch (error) {
      console.error(error);
    }
  }, [assets, loading, sdk]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return pricesMap;
}

export default function useLiquidityPositionData() {
  const {
    hub,
    getAssetWithFallback,
    loading: allAssetsLoading,
  } = useAllAssetsFunc();
  const hubPrice = useHubPrice(hub, allAssetsLoading);

  const { data: omnipoolTokens, isLoading: omniPoolTokensLoading } =
    useOmniPoolTokens();
  const dataMap = useMemo(() => {
    if (omniPoolTokensLoading || !omnipoolTokens) {
      return undefined;
    }

    return new Map(omnipoolTokens.map((asset) => [asset.id, asset]));
  }, [omniPoolTokensLoading, omnipoolTokens]);

  const assetsPriceMap = useOmnipoolAssetsPrice(
    omnipoolTokens,
    omniPoolTokensLoading,
  );

  const getData = useCallback(
    (position, options) => {
      if (allAssetsLoading || !hub || !hubPrice || !assetsPriceMap) {
        return undefined;
      }

      const omnipoolAsset = dataMap?.get(position.assetId);

      if (!omnipoolAsset) return undefined;

      const spotPrice = assetsPriceMap?.find(
        (asset) => asset.id === omnipoolAsset.id,
      )?.price;

      const meta = getAssetWithFallback(omnipoolAsset.id);

      if (!spotPrice || !meta) return undefined;

      const [nom, denom] = position.price.map(
        (n) => new BigNumber(n.toString()),
      );
      const price = nom.div(denom);

      const shares = position.shares;

      const positionPrice = scale(price, "q");

      let lernaOutResult = "-1";
      let liquidityOutResult = "-1";

      const params = [
        omnipoolAsset.balance.toString(),
        omnipoolAsset.hubReserve,
        omnipoolAsset.shares,
        position.amount.toString(),
        position.shares.toString(),
        positionPrice.toFixed(0),
        options?.sharesValue ?? position.shares.toString(),
        options?.fee ?? "0",
      ];

      lernaOutResult = calculate_liquidity_lrna_out.apply(this, params);
      liquidityOutResult = calculate_liquidity_out.apply(this, params);

      const lrna =
        lernaOutResult !== "-1" ? new BigNumber(lernaOutResult) : BN_NAN;
      const lrnaShifted = lrna.shiftedBy(-hub.decimals);

      const value =
        liquidityOutResult !== "-1"
          ? new BigNumber(liquidityOutResult)
          : BN_NAN;
      const valueShifted = value.shiftedBy(-meta.decimals);

      let valueDisplay = BN_NAN;
      let valueDisplayWithoutLrna = BN_NAN;
      let lrnaDisplay = BN_NAN;
      let totalValue = value;
      let totalValueShifted = valueShifted;

      const amount = position.amount;
      const amountShifted = BigNumber(amount).shiftedBy(-meta.decimals);
      const amountDisplay = amountShifted.times(spotPrice);

      if (liquidityOutResult !== "-1") {
        valueDisplay = valueShifted.times(spotPrice);

        valueDisplayWithoutLrna = valueDisplay;

        if (lrnaShifted.gt(0)) {
          lrnaDisplay = lrnaShifted.times(hubPrice);
          valueDisplay = valueDisplay.plus(lrnaDisplay);

          totalValueShifted = valueDisplay.div(spotPrice);
          totalValue = scale(valueDisplay.div(spotPrice), meta.decimals);
        }
      }

      return {
        id: position.id,
        symbol: meta.symbol,
        name: meta.name,
        assetId: position.assetId,
        lrna,
        lrnaShifted,
        lrnaDisplay,
        value,
        valueShifted,
        valueDisplay,
        valueDisplayWithoutLrna,
        price: position.price,
        amount,
        amountDisplay,
        amountShifted,
        shares,
        totalValue,
        totalValueShifted,
        meta,
      };
    },
    [
      allAssetsLoading,
      assetsPriceMap,
      dataMap,
      getAssetWithFallback,
      hub,
      hubPrice,
    ],
  );

  return { getData };
}
