import { useAssetHubApi } from "next-common/context/assetHub";
import useCall from "next-common/utils/hooks/useCall";

export default function useQueryAssetHubAssets(assetId, address) {
  const api = useAssetHubApi();

  const { loaded: isAccountLoaded, value: account } = useCall(
    api?.query.assets?.account,
    [assetId, address],
  );
  const { loaded: isMetaLoaded, value: meta } = useCall(
    api?.query.assets?.metadata,
    [assetId],
  );

  return {
    isLoading: !isAccountLoaded || !isMetaLoaded,
    balance: account?.toJSON()?.balance || 0,
    decimals: meta?.toJSON()?.decimals || 0,
  };
}
