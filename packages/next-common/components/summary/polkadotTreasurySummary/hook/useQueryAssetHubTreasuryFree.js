import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import useCall from "next-common/utils/hooks/useCall";

export function useQueryAccountFree(api, address) {
  const { loaded, value } = useCall(api?.query.system?.account, [address]);

  return {
    free: value?.data?.free?.toJSON() || 0,
    isLoading: !loaded,
  };
}

export function useQueryAssetHubTreasuryFree(address) {
  const api = useAssetHubApi();
  return useQueryAccountFree(api, address);
}
