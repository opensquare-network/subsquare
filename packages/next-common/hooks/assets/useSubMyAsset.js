import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useSubAsset } from "./useSubAsset";

export function useSubMyAsset() {
  const address = useRealAddress();
  return useSubAsset(address);
}
