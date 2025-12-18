import { GHO_SYMBOL } from "./constants";

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
