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

    const byId = {};

    for (const item of metadata || []) {
      const id = item.assetId;
      byId[id] = { assetId: id, ...(byId[id] || {}), ...item };
    }

    for (const item of details || []) {
      const id = item.assetId;
      byId[id] = { assetId: id, ...(byId[id] || {}), ...item };
    }

    const list = Object.values(byId);

    list.sort((a, b) => {
      const aKnown = !!foreignAssetInfo[a.assetId];
      const bKnown = !!foreignAssetInfo[b.assetId];
      if (aKnown !== bKnown) {
        return aKnown ? -1 : 1;
      }
      return String(a.assetId || "").localeCompare(String(b.assetId || ""));
    });

    return list;
  }, [metadata, details]);

  return {
    data: assets,
    loading: metadataLoading || detailsLoading,
  };
}
