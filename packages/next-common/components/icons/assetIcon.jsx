import { find } from "lodash-es";
import knownPolkadotAssetHubAssets from "../assethubMigrationAssets/known/polkadot";
import { useNativeTokenIcon } from "next-common/components/assethubMigrationAssets/known";

export default function AssetIcon({ symbol, className = "", type = "" }) {
  const NativeAssetIcon = useNativeTokenIcon();
  const foundAsset = find(knownPolkadotAssetHubAssets, {
    symbol,
  });

  if (type === "native") {
    return <NativeAssetIcon className={className} />;
  }

  return foundAsset?.icon && <foundAsset.icon className={className} />;
}
