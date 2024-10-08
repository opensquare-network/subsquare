import { useHydrationApi } from "next-common/context/hydration";
import { useSubscribeAccountFree } from "./useSubscribeAssetHubTreasuryFree";

export function useSubscribeHydrationTreasuryFree(address) {
  const api = useHydrationApi();
  return useSubscribeAccountFree(api, address);
}
