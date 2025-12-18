import useUniqueIds from "./useUniqueIds";
import { useHydrationApi } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";
import { useEffect, useState, useCallback } from "react";
import { parseNfts, parceLiquidityPositions, parseDepositData } from "../utils";

export default function useAccountPositions(address) {
  const api = useHydrationApi();
  const { data: uniqueIds } = useUniqueIds();
  const [data, setData] = useState({
    omnipoolDeposits: [],
    xykDeposits: [],
    liquidityPositions: [],
    accountAssetsMap: new Map([]),
    accountAddress: address,
    isAnyPositions: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchAccountPositions = useCallback(async () => {
    if (!address || !uniqueIds || !api) {
      return;
    }

    setIsLoading(true);
    const { omnipoolNftId, miningNftId, xykMiningNftId } = uniqueIds;
    const [omnipoolNftsRaw, miningNftsRaw, xykMiningNftsRaw] =
      await Promise.all([
        api.query.uniques.account.entries(address, omnipoolNftId),
        api.query.uniques.account.entries(address, miningNftId),
        api.query.uniques.account.entries(address, xykMiningNftId),
      ]);

    const omnipoolNfts = parseNfts(omnipoolNftsRaw);
    const miningNfts = parseNfts(miningNftsRaw);
    const xykMiningNfts = parseNfts(xykMiningNftsRaw);

    const liquidityPositionIds = omnipoolNfts.map((nft) => nft.instanceId);
    const omnipoolKeys = miningNfts.map((nft) =>
      api.query.omnipoolWarehouseLM.deposit.key(nft.instanceId),
    );
    const xykKeys = xykMiningNfts.map((nft) =>
      api.query.xykWarehouseLM.deposit.key(nft.instanceId),
    );

    const [liquidityPos, omniPositionIdsRaw, omnipoolData = [], xykData = []] =
      await Promise.all([
        api.query.omnipool.positions.multi(liquidityPositionIds),
        api.query.omnipoolLiquidityMining.omniPositionId.multi(
          miningNfts.map((nft) => nft.instanceId),
        ),
        omnipoolKeys.length ? api.rpc.state.queryStorageAt(omnipoolKeys) : [],
        xykKeys.length ? api.rpc.state.queryStorageAt(xykKeys) : undefined,
      ]);

    const omniPositionIds = omniPositionIdsRaw.map((id) => id.toString());

    const depositLiquidityPositions = parceLiquidityPositions(
      await api.query.omnipool.positions.multi(omniPositionIds),
      omniPositionIds,
      miningNfts.map((nft) => ({ depositId: nft.instanceId })),
    );

    const liquidityPositions = parceLiquidityPositions(
      liquidityPos,
      liquidityPositionIds,
    );

    const omnipoolDeposits = parseDepositData(
      api,
      miningNfts,
      omnipoolData,
      false,
    );

    const xykDeposits = parseDepositData(api, xykMiningNfts, xykData, true);

    const accountAssetsMap = new Map([]);

    xykDeposits.forEach((deposit) => {
      const id = deposit.data.ammPoolId;
      const balance = accountAssetsMap.get(id);

      accountAssetsMap.set(id, {
        ...(balance ?? {}),
        xykDeposits: [...(balance?.xykDeposits ?? []), deposit],
        isPoolPositions: true,
      });
    });

    omnipoolDeposits.forEach((omnipoolDeposit) => {
      const id = omnipoolDeposit.data.ammPoolId;

      const balance = accountAssetsMap.get(id);

      accountAssetsMap.set(id, {
        ...(balance ?? {}),

        omnipoolDeposits: [
          ...(balance?.omnipoolDeposits ?? []),
          omnipoolDeposit,
        ],
        isPoolPositions: true,
      });
    });

    liquidityPositions.forEach((liquidityPosition) => {
      const id = liquidityPosition.assetId;

      const balance = accountAssetsMap.get(id);

      accountAssetsMap.set(id, {
        ...(balance ?? {}),

        liquidityPositions: [
          ...(balance?.liquidityPositions ?? []),
          liquidityPosition,
        ],
        isPoolPositions: true,
      });
    });

    depositLiquidityPositions.forEach((depositLiquidityPosition) => {
      const id = depositLiquidityPosition.assetId;

      const balance = accountAssetsMap.get(id);

      accountAssetsMap.set(id, {
        ...(balance ?? {}),

        depositLiquidityPositions: [
          ...(balance?.depositLiquidityPositions ?? []),
          depositLiquidityPosition,
        ],
        isPoolPositions: true,
      });
    });

    const isAnyPositions =
      !!xykDeposits.length ||
      !!omnipoolDeposits.length ||
      !!liquidityPositions.length;

    setData({
      omnipoolDeposits,
      xykDeposits,
      liquidityPositions,
      accountAssetsMap,
      accountAddress: address,
      isAnyPositions,
      depositLiquidityPositions,
    });

    setIsLoading(false);
  }, [address, api, uniqueIds]);

  useEffect(() => {
    fetchAccountPositions();
  }, [fetchAccountPositions]);

  return { data, isLoading };
}
