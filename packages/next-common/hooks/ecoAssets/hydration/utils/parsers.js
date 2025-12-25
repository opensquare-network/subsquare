import BigNumber from "bignumber.js";
import { BN_0 } from "./constants";

export const parseNfts = (nfts) =>
  nfts.map(([storageKey]) => {
    const [owner, classId, instanceId] = storageKey.args;

    return {
      owner: owner.toString(),
      classId: classId.toString(),
      instanceId: instanceId.toString(),
    };
  });

export const parceLiquidityPositions = (positions, ids, metadata) => {
  return positions.reduce((acc, pos, i) => {
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
  }, []);
};

export const parseDepositData = (api, nfts, values, isXyk) => {
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
        BN_0,
      );

      const secondFarmLastBlock = b.data.yieldFarmEntries.reduce(
        (acc, curr) =>
          acc.lt(curr.enteredAt) ? BigNumber(curr.enteredAt) : acc,
        BN_0,
      );

      return secondFarmLastBlock.minus(firstFarmLastBlock).toNumber();
    });
};
