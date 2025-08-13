import { useMemo } from "react";
import useQueryAllForeignAssetMetadata from "next-common/hooks/foreignAssets/useQueryAllForeignAssetMetadata";
import useQueryAllForeignAssetDetail from "next-common/hooks/foreignAssets/useQueryAllForeignAssetDetail";
import { foreignAssetInfo } from "next-common/utils/consts/foreignAssets";

export default function useAllForeignAssets() {
  const { data: metadata, loading: metadataLoading } =
    useQueryAllForeignAssetMetadata();
  const { data: details, loading: detailsLoading } =
    useQueryAllForeignAssetDetail();

  const assets = useMemo(() => {
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

    assets.sort((a, b) => {
      const aIsKnown = foreignAssetInfo[a.assetId];
      const bIsKnown = foreignAssetInfo[b.assetId];

      if (aIsKnown && bIsKnown) {
        return a.assetId.localeCompare(b.assetId);
      }
      if (aIsKnown) {
        return -1;
      }
      if (bIsKnown) {
        return 1;
      }
      return a.assetId.localeCompare(b.assetId);
    });

    return assets;
  }, [metadata, details]);

  return {
    data: assets,
    loading: metadataLoading || detailsLoading,
  };
}
