import { useRealAddress } from "next-common/hooks/account/useRealAddress";
import { useSubAsset } from "./useSubAsset";

export function useSubMyAsset() {
  const address = useRealAddress();
  return useSubAsset(address);
}
