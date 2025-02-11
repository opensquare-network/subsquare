import { find } from "lodash-es";
import knownPolkadotAssetHubAssets from "../assets/known/polkadot";
import knownKusamaAssetHubAssets from "../assets/known/kusama";

export default function AssetIcon({ symbol, className = "" }) {
  const foundAsset = find(
    { ...knownPolkadotAssetHubAssets, ...knownKusamaAssetHubAssets },
    {
      symbol,
    },
  );

  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
