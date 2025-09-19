import { useState, useEffect, useCallback } from "react";
import { WsProvider, ApiPromise } from "@polkadot/api";
import BN from "bignumber.js";
import { createSdkContext } from "@galacticcouncil/sdk";
import { queryAssetPrice } from "./useAssetsTotal";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const BN_0 = new BN(0);

// 计算流动性头寸价值
const calculateLPPositionValue = (
  position,
  omnipoolAsset,
  assetPrice,
  hubPrice,
) => {
  if (!position || !omnipoolAsset || !assetPrice) return BN_0;

  try {
    const amount = new BN(position.amount || 0);
    const shares = new BN(position.shares || 0);
    const [priceNom, priceDenom] = position.price || ["0", "1"];

    // 计算头寸价值
    const positionPrice = new BN(priceNom).div(new BN(priceDenom));
    const assetValue = amount
      .shiftedBy(-omnipoolAsset.decimals)
      .times(assetPrice);

    // 计算 LRNA 奖励价值
    const lrnaValue = calculateLRNAValue(position, omnipoolAsset, hubPrice);

    return assetValue.plus(lrnaValue);
  } catch (error) {
    console.error("Error calculating LP position value:", error);
    return BN_0;
  }
};

// 计算 LRNA 价值
const calculateLRNAValue = (position, omnipoolAsset, hubPrice) => {
  try {
    // 这里需要实现 LRNA 计算逻辑
    // 基于 hydration-ui 的 calculate_liquidity_lrna_out 逻辑
    return BN_0; // 简化实现
  } catch (error) {
    console.error("Error calculating LRNA value:", error);
    return BN_0;
  }
};

export default function useLPTotal(address) {
  const [lpBalance, setLpBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLPData = useCallback(async () => {
    if (!address) {
      setLpBalance(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // const { api } = sdk ?? {};

      const collectionId = await api.consts.omnipool.nftCollectionId;

      console.log("::::collectionId", collectionId.toString());

      // 获取所有流动性头寸
      const [positions, uniques] = await Promise.all([
        api.query.omnipool.positions.entries(),
        api.query.uniques.asset.entries(collectionId.toString()),
      ]);

      // 过滤用户的头寸
      const userPositions = [];
      for (const [idRaw, dataRaw] of positions) {
        const id = idRaw.args[0].toString();
        const owner = uniques
          .find(([key]) => {
            const [, itemId] = key.args;
            return itemId.toString() === id;
          })?.[1]
          ?.unwrap()
          ?.owner.toString();

        if (owner === address) {
          const data = dataRaw.unwrap();
          userPositions.push({
            id,
            amount: data.amount.toString(),
            shares: data.shares.toString(),
            price: data.price.map((e) => e.toString()),
            assetId: data.assetId.toString(),
          });
        }
      }

      const omnipoolAssets = await api.query.omnipool.assets.entries();
      const assetsMap = new Map();
      for (const [keyRaw, valueRaw] of omnipoolAssets) {
        const assetId = keyRaw.args[0].toString();
        const assetData = valueRaw.unwrap();
        assetsMap.set(assetId, {
          balance: assetData.balance.toString(),
          hubReserve: assetData.hubReserve.toString(),
          shares: assetData.shares.toString(),
          decimals: 12, // todo decimals
        });
      }

      let totalValue = BN_0;
      const positionDetails = [];

      for (const position of userPositions) {
        const omnipoolAsset = assetsMap.get(position.assetId);
        if (omnipoolAsset) {
          const assetPrice = await queryAssetPrice(position.assetId);
          const hubPrice = new BN(1);

          const positionValue = calculateLPPositionValue(
            position,
            omnipoolAsset,
            assetPrice,
            hubPrice,
          );

          totalValue = totalValue.plus(positionValue);
          positionDetails.push({
            ...position,
            value: positionValue.toString(),
          });
        }
      }

      setLpBalance({
        value: totalValue.toString(),
        positions: positionDetails,
        totalPositions: userPositions.length,
      });
    } catch (err) {
      console.error("Error fetching LP data:", err);
      setError(err.message);
      setLpBalance(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchLPData();
  }, [fetchLPData]);

  console.log(":::::lpBalance", lpBalance);

  return {
    value: lpBalance?.value || "0",
    isLoading,
    error,
    data: lpBalance,
    refetch: fetchLPData,
  };
}
