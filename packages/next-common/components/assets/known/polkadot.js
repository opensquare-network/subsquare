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
const AssetIconDot = dynamic(() => import("@osn/icons/subsquare/AssetIconDot"));
const AssetIconMyth = dynamic(() =>
  import("@osn/icons/subsquare/AssetIconMyth"),
);

const knownPolkadotAssetHubAssets = [
  {
    symbol: "USDt",
    assetId: 1984,
    icon: AssetIconUsdt,
  },
  {
    symbol: "USDC",
    assetId: 1337,
    icon: AssetIconUsdc,
  },
  {
    symbol: "DED",
    assetId: 30,
    icon: AssetIconDed,
  },
  {
    symbol: "DOTA",
    assetId: 18,
    icon: AssetIconDota,
  },
  {
    symbol: "PINK",
    assetId: 23,
    icon: AssetIconPink,
  },
  {
    symbol: "DOT",
    assetId: 3,
    icon: AssetIconDot,
  },
  {
    symbol: "MYTH",
    assetId: null, // Foreign Asset
    icon: AssetIconMyth,
  },
];

export default knownPolkadotAssetHubAssets;
