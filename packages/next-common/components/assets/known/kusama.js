import dynamic from "next/dynamic";

const AssetIconKsm = dynamic(() => import("@osn/icons/subsquare/AssetIconKsm"));

const knownKusamaAssetHubAssets = [
  {
    symbol: "KSM",
    assetId: 0,
    icon: AssetIconKsm,
  },
];

export default knownKusamaAssetHubAssets;
