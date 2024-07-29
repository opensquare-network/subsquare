import dynamic from "next/dynamic";

const AssetIconDed = dynamic(() => import("@osn/icons/subsquare/AssetIconDed"));
const AssetIconDota = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconDota"),
);
const AssetIconPink = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconPink"),
);
const AssetIconUsdc = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconUsdc"),
);
const AssetIconUsdt = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconUsdt"),
);

const knownPolkadotAssetHubAssets = [
  {
    // symbol: "USDt",
    assetId: 1984,
    icon: AssetIconUsdt,
  },
  {
    // symbol: "USDC",
    assetId: 1337,
    icon: AssetIconUsdc,
  },
  {
    // symbol: "DED",
    assetId: 30,
    icon: AssetIconDed,
  },
  {
    // symbol: "DOTA",
    assetId: 18,
    icon: AssetIconDota,
  },
  {
    // symbol: "PINK",
    assetId: 23,
    icon: AssetIconPink,
  },
];

export default knownPolkadotAssetHubAssets;
