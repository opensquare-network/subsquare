import { find } from "lodash-es";
import knownPolkadotAssetHubAssets from "../assets/known/polkadot";

export default function AssetIcon({ symbol, className = "" }) {
  const foundAsset = find(knownPolkadotAssetHubAssets, { symbol });

  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
