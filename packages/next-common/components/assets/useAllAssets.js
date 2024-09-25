import { useMemo } from "react";
import useQueryAllAssetDetail from "next-common/hooks/assets/useQueryAllAssetDetail";
import { useKnownAssetHubAssets } from "./known";
import useAllAssetMetadata from "next-common/components/assets/context/assetMetadata";

export default function useAllAssets() {
  const [metadata] = useAllAssetMetadata();
  const details = useQueryAllAssetDetail();
  const knownAssetDefs = useKnownAssetHubAssets();

  return useMemo(() => {
    if (!metadata || !details) {
      return;
    }

    const assets = metadata.map((item) => {
      const detail = details.find((d) => d.assetId === item.assetId);
      return {
        ...item,
        ...detail,
      };
    });

    // Sort known asset to the front
    assets.sort((a, b) => {
      const aPos = knownAssetDefs.findIndex((def) => def.assetId === a.assetId);
      const bPos = knownAssetDefs.findIndex((def) => def.assetId === b.assetId);
      if (aPos >= 0 && bPos >= 0) {
        return aPos - bPos;
      }
      if (aPos >= 0) {
        return -1;
      }
      if (bPos >= 0) {
        return 1;
      }
      return a.assetId - b.assetId;
    });

    return assets;
  }, [metadata, details, knownAssetDefs]);
}
