import {
  useAssetsContext,
  useTotalCounts,
} from "next-common/components/assets/context/assetHubTabsProvider";
import useSingleAccountAssets from "./useSingleAccountAssets";
import { useEffect } from "react";

// TODO: use subscribe
const useAssetHubTabsAssets = (address) => {
  const [assets, setAssets] = useAssetsContext();
  const [, setTotalCount] = useTotalCounts();
  const fetchedAssets = useSingleAccountAssets(address);

  useEffect(() => {
    if (fetchedAssets) {
      setAssets(fetchedAssets);
      setTotalCount("assets", fetchedAssets?.length || 0);
    }
  }, [fetchedAssets, setAssets, setTotalCount]);

  return assets;
};

export default useAssetHubTabsAssets;
