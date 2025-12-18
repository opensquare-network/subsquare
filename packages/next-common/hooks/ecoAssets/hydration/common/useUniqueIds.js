import { useCallback, useEffect, useState } from "react";
import { useHydrationApi } from "next-common/hooks/ecoAssets/hydration/context/hydrationSDKContext";

export default function useUniqueIds() {
  const [data, setData] = useState(null);
  const api = useHydrationApi();

  const fetchUniqueIds = useCallback(async () => {
    const [omnipoolNftId, miningNftId, xykMiningNftId] = await Promise.all([
      api.consts.omnipool.nftCollectionId,
      api.consts.omnipoolLiquidityMining.nftCollectionId,
      api.consts.xykLiquidityMining.nftCollectionId,
    ]);

    setData({
      omnipoolNftId: omnipoolNftId.toString(),
      miningNftId: miningNftId.toString(),
      xykMiningNftId: xykMiningNftId.toString(),
    });
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }
    fetchUniqueIds();
  }, [fetchUniqueIds, api]);

  return { data };
}
