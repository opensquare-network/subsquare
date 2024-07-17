import { useMemo } from "react";
import useQueryAllAssetDetail from "next-common/hooks/assets/useQueryAllAssetDetail";
import { useAllAssetMetadata } from "./context/assetMetadata";

export default function useAssets() {
  const metadata = useAllAssetMetadata();
  const details = useQueryAllAssetDetail();
  return useMemo(() => {
    if (!metadata || !details) {
      return;
    }

    return metadata.map((item) => {
      const detail = details.find((d) => d.assetId === item.assetId);
      return {
        ...item,
        ...detail,
      };
    });
  }, [metadata, details]);
}
