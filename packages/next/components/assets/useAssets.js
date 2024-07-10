import {
  AssetIconDed,
  AssetIconDot,
  AssetIconPink,
  AssetIconUsdc,
  AssetIconUsdt,
} from "@osn/icons/subsquare";

export default function useAssets() {
  return [
    {
      symbol: "DOT",
      name: "Polkadot",
      balance: "111111111111",
      decimals: 10,
      type: "native",
      icon: AssetIconDot,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "111111111111",
      decimals: 6,
      type: "asset",
      assetId: 1337,
      icon: AssetIconUsdc,
    },
    {
      symbol: "USDt",
      name: "Tether USD",
      balance: "111111111111",
      decimals: 6,
      type: "asset",
      assetId: 1984,
      icon: AssetIconUsdt,
    },
    {
      symbol: "DED",
      name: "DED",
      balance: "111111111111",
      decimals: 10,
      type: "asset",
      assetId: 30,
      icon: AssetIconDed,
    },
    {
      symbol: "DOTA",
      name: "DOTA",
      balance: "111111111111",
      decimals: 4,
      type: "asset",
      assetId: 18,
      icon: AssetIconDed,
    },
    {
      symbol: "PINK",
      name: "PINK",
      balance: "111111111111",
      decimals: 10,
      type: "asset",
      assetId: 23,
      icon: AssetIconPink,
    },
  ];
}
