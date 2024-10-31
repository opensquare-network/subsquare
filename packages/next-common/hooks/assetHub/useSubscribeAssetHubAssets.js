import { useAssetHubApi } from "next-common/context/assetHub";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubscribeAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();

  const { loading: isLoadingAccount, result: account } = useSubStorage(
    "assets",
    "account",
    [assetId, address],
    { api },
  );
  const { loading: isLoadingMeta, result: meta } = useSubStorage(
    "assets",
    "metadata",
    [assetId],
    { api },
  );

  const loading = isLoadingAccount || isLoadingMeta;

  if (loading) {
    return { isLoading: true, balance: 0, decimals: 0 };
  }

  return {
    isLoading: false,
    balance: account?.toJSON()?.balance || 0,
    decimals: meta?.toJSON()?.decimals || 0,
  };
}
