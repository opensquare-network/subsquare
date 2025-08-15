import { useMemo } from "react";
import { groupBy } from "lodash-es";
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

    const groupedById = groupBy([...metadata, ...details], "assetId");

    const mergedAssets = Object.entries(groupedById).map(([assetId, items]) =>
      items.reduce((acc, item) => ({ ...acc, ...item }), { assetId }),
    );

    const getSortKey = (asset) => {
      const isKnown = !!foreignAssetInfo[asset.assetId];
      const hasSymbol = !!asset.symbol;
      const symbol = hasSymbol ? String(asset.symbol).toLowerCase() : "";
      const assetId = String(asset.assetId || "");

      return {
        isKnown: isKnown ? 0 : 1,
        hasSymbol: hasSymbol ? 0 : 1,
        symbol,
        assetId,
      };
    };

    return mergedAssets.sort((a, b) => {
      const keyA = getSortKey(a);
      const keyB = getSortKey(b);

      return (
        keyA.isKnown - keyB.isKnown ||
        keyA.hasSymbol - keyB.hasSymbol ||
        keyA.symbol.localeCompare(keyB.symbol) ||
        keyA.assetId.localeCompare(keyB.assetId)
      );
    });
  }, [metadata, details]);

  return {
    data: assets,
    loading: metadataLoading || detailsLoading,
  };
}
