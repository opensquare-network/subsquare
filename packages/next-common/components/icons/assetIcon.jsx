import { find } from "lodash-es";
import { AssetIconPlaceholder } from "@osn/icons/subsquare";
import knownPolkadotAssetHubAssets from "../assethubMigrationAssets/known/polkadot";
import knownHydrationAssets from "../assethubMigrationAssets/known/hydration";
import { useNativeTokenIcon } from "next-common/components/assethubMigrationAssets/known";

const knownAssets = [...knownPolkadotAssetHubAssets, ...knownHydrationAssets];

export default function AssetIcon({ symbol, className = "", type = "" }) {
  const NativeAssetIcon = useNativeTokenIcon();
  const foundAsset = find(knownAssets, {
    symbol,
  });

  if (type === "native") {
    // eslint-disable-next-line react-hooks/static-components
    return <NativeAssetIcon className={className} />;
  }

  const Icon = foundAsset?.icon ?? AssetIconPlaceholder;
  return <Icon className={className} />;
}
