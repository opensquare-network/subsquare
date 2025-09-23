import { useCallback } from "react";
import { BN_NAN, scale } from "../utils";
import { getAllAssets, queryAssetPrice } from "../useAssetsTotal";
import BigNumber from "bignumber.js";
import {
  calculate_liquidity_lrna_out,
  calculate_liquidity_out,
} from "@galacticcouncil/math-omnipool";

import { createSdkContext } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

async function getAllPools(api) {
  const pools = await api.router.getPools();
  return pools;
}

async function getOmnipoolTokens() {
  if (!sdk) {
    return null;
  }

  const { api } = sdk;
  const pools = await getAllPools(api);

  const omnipoolTokens = pools.filter((pool) => pool.type === "Omnipool");

  const dataMap = omnipoolTokens
    ? new Map(omnipoolTokens.map((asset) => [asset.id, asset]))
    : undefined;

  return {
    data: omnipoolTokens,
    dataMap,
  };
}

export default function useLiquidityPositionData() {
  const getData = useCallback(
    async (position, options) => {
      const { hub, getAssetWithFallback } = await getAllAssets();
      console.log("::::hub", hub, getAllAssets());
      const omnipoolAssets = getOmnipoolTokens();

      const hubPrice = queryAssetPrice(hub.id);

      const omnipoolAsset = omnipoolAssets.dataMap?.get(position.assetId);

      if (!omnipoolAsset) return undefined;

      const spotPrice = queryAssetPrice(omnipoolAsset.id);

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
    [],
  );

  return { getData };
}
