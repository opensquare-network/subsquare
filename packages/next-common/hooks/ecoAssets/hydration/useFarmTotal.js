import { createSdkContext, findNestedKey } from "@galacticcouncil/sdk";
import { ApiPromise, WsProvider } from "@polkadot/api";
import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect, useMemo } from "react";

//  Hydration SDK in provider?
const ws = "wss://rpc.hydradx.cloud";
const wsProvider = new WsProvider(ws, 2_500, {}, 60_000, 102400, 10 * 60_000);

const api = await ApiPromise.create({
  provider: wsProvider,
});

const sdk = await createSdkContext(api);

const NATIVE_ASSET_ID = "0";
const bannedAssets = ["1000042"];

async function getUniqueIds() {
  const [miningNftId] = await Promise.all([
    api.consts.omnipoolLiquidityMining.nftCollectionId,
  ]);

  return {
    miningNftId: miningNftId.toString(),
  };
}

const parseNfts = (nfts) =>
  nfts.map(([storageKey]) => {
    const [owner, classId, instanceId] = storageKey.args;

    return {
      owner: owner.toString(),
      classId: classId.toString(),
      instanceId: instanceId.toString(),
    };
  });

const parceLiquidityPositions = (positions, ids, metadata) => (
  (acc, pos, i) => {
    if (!pos.isNone) {
      const data = pos.unwrap();

      acc.push({
        id: ids[i],
        amount: data.amount.toString(),
        shares: data.shares.toString(),
        price: data.price.map((e) => e.toString()),
        assetId: data.assetId.toString(),
        ...(metadata ? metadata[i] : {}),
      });
    }

    return acc;
  },
  []
);

const parseDepositData = (api, nfts, values, isXyk) => {
  return nfts
    .reduce((acc, nft, index) => {
      const dataRaw = values[index];

      if (!dataRaw.isNone) {
        const dataUnwraped = api.registry.createType(
          isXyk ? "XykLMDeposit" : "OmnipoolLMDeposit",
          dataRaw.unwrap(),
        );
        const data = {
          ammPoolId: dataUnwraped.ammPoolId.toString(),
          shares: dataUnwraped.shares.toString(),
          yieldFarmEntries: dataUnwraped.yieldFarmEntries.map((farmEntry) => ({
            globalFarmId: farmEntry.globalFarmId.toString(),
            yieldFarmId: farmEntry.yieldFarmId.toString(),
            enteredAt: farmEntry.enteredAt.toString(),
            updatedAt: farmEntry.updatedAt.toString(),
            valuedShares: farmEntry.valuedShares.toString(),
            accumulatedRpvs: farmEntry.accumulatedRpvs.toString(),
            accumulatedClaimedRewards:
              farmEntry.accumulatedClaimedRewards.toString(),
            stoppedAtCreation: farmEntry.stoppedAtCreation.toString(),
          })),
        };
        acc.push({
          id: nft.instanceId,
          data,
          isXyk,
        });
      }

      return acc;
    }, [])
    .sort((a, b) => {
      const firstFarmLastBlock = a.data.yieldFarmEntries.reduce(
        (acc, curr) =>
          acc.lt(curr.enteredAt) ? BigNumber(curr.enteredAt) : acc,
        BigNumber(0),
      );

      const secondFarmLastBlock = b.data.yieldFarmEntries.reduce(
        (acc, curr) =>
          acc.lt(curr.enteredAt) ? BigNumber(curr.enteredAt) : acc,
        BigNumber(0),
      );

      return secondFarmLastBlock.minus(firstFarmLastBlock).toNumber();
    });
};

const useAccountPositions = (address) => {
  const [data, setData] = useState(null);

  const fetchAccountPositions = useCallback(async () => {
    const { miningNftId } = await getUniqueIds();
    const [miningNftsRaw] = await api.query.uniques.account.entries(
      address,
      miningNftId,
    );
    const miningNfts = parseNfts(miningNftsRaw);

    const omniPositionIdsRaw =
      await api.query.omnipoolLiquidityMining.omniPositionId.multi(
        miningNfts.map((nft) => nft.instanceId),
      );

    const omniPositionIds = omniPositionIdsRaw.map((id) => id.toString());

    const depositLiquidityPositions = parceLiquidityPositions(
      await api.query.omnipool.positions.multi(omniPositionIds),
      omniPositionIds,
      miningNfts.map((nft) => ({ depositId: nft.instanceId })),
    );

    const accountAssetsMap = new Map([]);

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

    setData({
      depositLiquidityPositions,
    });
  }, [address]);

  useEffect(() => {
    fetchAccountPositions();
  }, [fetchAccountPositions]);

  return { data };
};

const useAllOmnipoolDeposits = (address) => {
  const { data: accountPositions } = useAccountPositions(address);
  const { depositLiquidityPositions = [] } = accountPositions ?? {};

  const { getData } = useLiquidityPositionData();

  const data = useMemo(
    () =>
      depositLiquidityPositions.reduce((memo, position) => {
        const positionData = getData(position);

        if (positionData) {
          const index = position.assetId;

          memo[index] = [
            ...(memo[index] ?? []),
            {
              ...positionData,
              depositId: position.depositId,
            },
          ];
        }

        return memo;
      }, {}),

    [getData, depositLiquidityPositions],
  );

  return data;
};

// Farm Total Balance
export default function useFarmTotal(address) {
  const [assetsBalance, setAssetsBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // setAssetsBalance(totalBalance);
      const { omnipoolNftId, miningNftId, xykMiningNftId } =
        await getUniqueIds();
      console.log(
        "::::omnipoolNftId, miningNftId, xykMiningNftId,",
        omnipoolNftId,
        miningNftId,
        xykMiningNftId,
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { balance: assetsBalance, isLoading };
}
