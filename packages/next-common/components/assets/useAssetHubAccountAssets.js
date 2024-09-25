import {
  useAssetsContext,
  useTotalCounts,
} from "next-common/components/assets/context/assetHubTabsProvider";
import useAccountAssets from "./useAccountAssets";
import { useEffect } from "react";

const useAssetHubAccountAssets = (address) => {
  const [assets, setAssets] = useAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const fetchedAssets = useAccountAssets(address);

  useEffect(() => {
    if (fetchedAssets) {
      setAssets(fetchedAssets);
      setTotalCount("assets", fetchedAssets?.length || 0);
    }
  }, [fetchedAssets, setAssets, setTotalCount]);

  return assets;
};

export default useAssetHubAccountAssets;
