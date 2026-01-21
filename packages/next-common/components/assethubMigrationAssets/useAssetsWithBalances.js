import { useMemo } from "react";
import useAllAssetMetadata from "next-common/components/assethubMigrationAssets/context/assetMetadata";
import { useKnownAssetHubAssets } from "next-common/components/assethubMigrationAssets/known";

export default function useSortedAssetMetadata() {
  const [allMetadata] = useAllAssetMetadata();
  const knownAssetDefs = useKnownAssetHubAssets();

  return useMemo(() => {
    if (!allMetadata) {
      return null;
    }

    const knownAssetIds = knownAssetDefs.map((def) => def.assetId);
    const knownAssets = knownAssetDefs.reduce((result, def) => {
      const find = allMetadata.find((asset) => asset.assetId === def.assetId);
      if (find) {
        return [...result, find];
      }
      return result;
    }, []);
    const otherAssets = allMetadata.filter(
      (asset) => !knownAssetIds.includes(asset.assetId),
    );

    return [...knownAssets, ...otherAssets];
  }, [allMetadata, knownAssetDefs]);
}
