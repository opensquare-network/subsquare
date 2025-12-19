import BigNumber from "bignumber.js";

export const BN_0 = new BigNumber(0);
export const BN_NAN = new BigNumber(NaN);

export const NATIVE_ASSET_ID = "0";
export const HUB_ID = "1";
export const TRILL = 12;
export const QUINTILL = 18;
export const USD_DECIMALS = 8;

export const bannedAssets = ["1000042"];

export const ASSETHUB_ID_BLACKLIST = [
  "34",
  "41",
  "43",
  "47",
  "49",
  "52",
  "53",
  "54",
  "65",
  "73",
  "74",
  "75",
  "92",
  "92",
  "97",
  "22222000",
  "22222001",
  "22222002",
  "22222003",
  "22222004",
  "50000019",
  "50000030",
  "50000031",
  "50000032",
  "50000033",
  "50000034",
];

export const TYPE_MAPPING = {
  aave: "Aave",
  xyk: "Xyk",
  omnipool: "Omnipool",
  stableswap: "Stableswap",
  hsm: "Hsm",
};
