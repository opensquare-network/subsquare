import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { BN } from "@polkadot/util";

// TODO: consts?
export const BN_0 = new BigNumber(0);
export const BN_NAN = new BigNumber(NaN);

export const NATIVE_ASSET_ID = "0";
export const HUB_ID = "1";
export const TRILL = 12;
export const QUINTILL = 18;

export function normalizeBigNumber(value) {
  if (value == null) return null;

  // BigNumber.js instance
  if (BigNumber.isBigNumber(value)) return value;

  // BN.js instance returned from @polkadot-js/api
  if (BN.isBN(value)) return new BigNumber(value.toString());

  // string value or number
  return new BigNumber(value);
}

/**
 *
 * @param amount value to scale
 * @param decimals number of shifted places
 * @returns The shift is of the decimal point, i.e. of powers of ten, and is to the right.
 * eg.: 1.23456789 => 123456789
 */
export const scale = (amount, decimals) => {
  if (!amount) return BN_NAN;

  const _decimals =
    decimals === "t" ? TRILL : decimals === "q" ? QUINTILL : decimals;

  return normalizeBigNumber(amount).shiftedBy(_decimals);
};

export const scaleHuman = (amount, decimals) => {
  if (!amount) return BN_NAN;

  const _decimals =
    decimals === "t" ? TRILL : decimals === "q" ? QUINTILL : decimals;

  return normalizeBigNumber(amount).shiftedBy(-_decimals);
};

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

export const fallbackAsset = {
  id: "",
  name: "N/A",
  symbol: "N/a",
  decimals: 12,
  existentialDeposit: "0",
  parachainId: undefined,
  isToken: false,
  isBond: false,
  isStableSwap: false,
  isExternal: false,
  isShareToken: false,
  isErc20: false,
  iconId: "",
  isSufficient: false,
  isTradable: false,
  type: "Token",
  icon: "",
  externalId: undefined,
};

export async function fetchShareTokens(api) {
  if (!api) {
    return null;
  }

  try {
    const [shareToken, poolAssets] = await Promise.all([
      api.query.xyk.shareToken.entries(),
      api.query.xyk.poolAssets.entries(),
    ]);

    const data = shareToken
      .map(([key, shareTokenIdRaw]) => {
        const poolAddress = key.args[0].toString();
        const shareTokenId = shareTokenIdRaw.toString();

        const xykAssets = poolAssets.find(
          (xykPool) => xykPool[0].args[0].toString() === poolAddress,
        )?.[1];

        if (xykAssets)
          return {
            poolAddress,
            shareTokenId,
            assets: xykAssets.unwrap().map((asset) => asset.toString()),
          };

        return undefined;
      })
      .filter((item) => !isNil(item));

    return data;
  } catch (error) {
    console.error("Error fetching share tokens:", error);
    throw error;
  }
}
