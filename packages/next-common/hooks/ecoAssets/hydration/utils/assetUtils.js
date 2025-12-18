import { isNil } from "lodash-es";
import { findNestedKey } from "@galacticcouncil/sdk";

export const internalIds = new Map([
  ["9999", "1000106"],
  ["100", "1000053"],
  ["482", undefined],
  ["123", undefined],
  ["9000", "1000103"],
  ["69420", "1000062"],
  ["25518", "1000035"],
  ["420", "1000036"],
  ["10", undefined],
  ["256", "1000023"],
  ["4", "1000026"],
  ["21", undefined],
  ["20", undefined],
  ["999", undefined],
  ["30", "1000019"],
  ["101", undefined],
  ["99", undefined],
  ["7777", "1000095"],
  ["11", "1000027"],
  ["30035", "1000025"],
  ["111", undefined],
  ["555", "1000104"],
  ["14", "1000076"],
  ["6", undefined],
  ["65454", undefined],
  ["8889", "1000091"],
  ["8886", "1000108"],
  ["42069", "1000034"],
  ["77", undefined],
  ["9002", "1000105"],
  ["33", undefined],
  ["15", undefined],
  ["2", undefined],
  ["9527", undefined],
  ["868367", undefined],
  ["42", "1000060"],
  ["5", undefined],
  ["18", "1000038"],
  ["7", undefined],
  ["4294967295", "1000052"],
  ["1984", "10"],
  ["20090103", undefined],
  ["22", "1000055"],
  ["79", undefined],
  ["777", undefined],
  ["1230", undefined],
  ["9003", undefined],
  ["1313", undefined],
  ["24", undefined],
  ["2023", undefined],
  ["8", undefined],
  ["2820", undefined],
  ["404", "1000089"],
  ["1000", undefined],
  ["8008", undefined],
  ["6666", "1000078"],
  ["1", undefined],
  ["12", undefined],
  ["31337", "1000085"],
  ["3", undefined],
  ["6969", "1000054"],
  ["1983", undefined],
  ["1337", "22"],
  ["666", "1000029"],
  ["17", "1000082"],
  ["25", "1000069"],
  ["69", "1000094"],
  ["23", "1000021"],
  ["5417", "1000096"],
  ["9001", "1000102"],
  ["1980", undefined],
  ["4157", "1000065"],
  ["660301", undefined],
  ["9", "1000028"],
  ["862812", undefined],
  ["888", "1000059"],
  ["2024", "1000070"],
  ["2230", "1000073"],
]);

const pink = {
  decimals: 10,
  id: "23",
  name: "PINK",
  origin: 1000,
  symbol: "PINK",
  isWhiteListed: false,
};

const ded = {
  decimals: 10,
  id: "30",
  name: "DED",
  origin: 1000,
  symbol: "DED",
  isWhiteListed: false,
};

const dota = {
  decimals: 4,
  id: "18",
  name: "DOTA",
  origin: 1000,
  symbol: "DOTA",
  isWhiteListed: false,
};

export const external = [
  {
    ...ded,
    internalId: "1000019",
  },
  {
    ...pink,
    internalId: "1000021",
  },
  {
    ...dota,
    internalId: "1000038",
  },
];

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

export function getFullAsset(asset) {
  const isToken = asset.type === "Token";
  const isBond = asset.type === "Bond";
  const isStableSwap = asset.type === "StableSwap";
  const isExternal = asset.type === "External";
  const isErc20 = asset.type === "Erc20";
  const isShareToken = false;

  const parachainEntry = findNestedKey(asset.location, "parachain");

  let externalId = null;

  if (isExternal) {
    for (const [extId, intId] of internalIds.entries()) {
      if (intId === asset?.id) {
        externalId = extId;
        break;
      }
    }
  }

  return {
    ...asset,
    parachainId: parachainEntry?.parachain.toString() || undefined,
    existentialDeposit: asset.existentialDeposit,
    isToken,
    isBond,
    isStableSwap,
    isExternal,
    externalId,
    isErc20,
    isShareToken,
  };
}

export async function getTargetTypePools(api, type) {
  const pools = await api.router.getPools();
  if (!pools) {
    return [];
  }

  return pools.filter((pool) => pool.type === type);
}

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
