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

    const mergedById = [...metadata, ...details].reduce((acc, item) => {
      const id = item.assetId;
      acc[id] = { assetId: id, ...(acc[id] || {}), ...item };
      return acc;
    }, {});

    const rank = (id) => (foreignAssetInfo[id] ? 0 : 1);

    return Object.values(mergedById).sort(
      (a, b) =>
        rank(a.assetId) - rank(b.assetId) ||
        String(a.assetId || "").localeCompare(String(b.assetId || "")),
    );
  }, [metadata, details]);

  return {
    data: assets,
    loading: metadataLoading || detailsLoading,
  };
}
