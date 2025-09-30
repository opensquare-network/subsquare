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
export const GHO_SYMBOL = "HOLLAR";
export const GDOT_STABLESWAP_ASSET_ID = "690";
export const GETH_STABLESWAP_ASSET_ID = "4200";

function numToBuffer(num) {
  const arr = new Uint8Array(4);
  for (let i = 0; i < 4; i++) arr.set([num / 0x100 ** i], 3 - i);
  return Buffer.from(arr);
}

export function getAddressFromAssetId(assetId) {
  try {
    const tokenAddress = Buffer.from(
      "0000000000000000000000000000000100000000",
      "hex",
    );
    const assetIdBuffer = numToBuffer(+assetId);
    assetIdBuffer.copy(tokenAddress, 16);

    return "0x" + tokenAddress.toString("hex");
  } catch {
    return "";
  }
}

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

export const PASEO_WS_URL = "wss://paseo-rpc.play.hydration.cloud";

export const TESTNET_URL = ["wss://rpc.nice.hydration.cloud", PASEO_WS_URL];

export const isPaseoRpcUrl = (rpcUrl) => rpcUrl === PASEO_WS_URL;

export const isTestnetRpcUrl = (rpcUrl) => {
  const dataEnv = TESTNET_URL.includes(rpcUrl) ? "testnet" : "mainnet";
  return dataEnv === "testnet";
};

export const AaveV3HydrationTestnet = {
  POOL_ADDRESSES_PROVIDER: "0x82db570265c37bE24caf5bc943428a6848c3e9a6",
  POOL: "0xf550bCd9B766843D72fC4C809a839633fD09b643",
  WETH_GATEWAY: "",
  FAUCET: "",
  WALLET_BALANCE_PROVIDER: "0x98C63E4299fF188572Fffdc471f23B39a30342b4",
  UI_POOL_DATA_PROVIDER: "0x5a21aFD0fF9E5D76F58BEd8aE34AABE0c41e65bc",
  UI_INCENTIVE_DATA_PROVIDER: "0xc7A1dB5Aa56a5F07E758D8d8804B17B4cA7c889B",
  GHO_TOKEN_ADDRESS: "0xC130c89F2b1066a77BD820AAFebCF4519D0103D8",
  GHO_UI_DATA_PROVIDER: "0x5bA1854d06757D734c2b8B791d04353c336c4A07",
  COLLECTOR: "",
};

export const AaveV3HydrationMainnet = {
  POOL_ADDRESSES_PROVIDER: "0xf3Ba4D1b50f78301BDD7EAEa9B67822A15FCA691",
  POOL: "0x1b02E051683b5cfaCå5929C25E84adb26ECf87B38",
  WETH_GATEWAY: "",
  FAUCET: "",
  WALLET_BALANCE_PROVIDER: "0x0AFCD36f29BbC1Ae40007ff289901Ae442558796",
  UI_POOL_DATA_PROVIDER: "0x112b087b60C1a166130d59266363C45F8aa99db0",
  UI_INCENTIVE_DATA_PROVIDER: "0x23711ED88aFd7C9930a7337e5AacA3DAcC780FEc",
  GHO_TOKEN_ADDRESS: "",
  GHO_UI_DATA_PROVIDER: "",
  COLLECTOR: "0xE52567fF06aCd6CBe7BA94dc777a3126e180B6d9",
};

/**
 * removes the marketPrefix from a symbol
 * @param symbol
 * @param prefix
 */
export const unPrefixSymbol = (symbol, prefix) => {
  return symbol
    .toUpperCase()
    .replace(RegExp(`^(${prefix[0]}?${prefix.slice(1)})`), "");
};

export const reserveSortFn = (a, b) => {
  if (a.symbol === GHO_SYMBOL) return -1;
  if (b.symbol === GHO_SYMBOL) return 1;
  const numA = parseFloat(a.totalLiquidityUSD);
  const numB = parseFloat(b.totalLiquidityUSD);

  return numB > numA ? 1 : -1;
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
