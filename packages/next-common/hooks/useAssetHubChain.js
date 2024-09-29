import { getAssetHubChain } from "next-common/utils/chain";
import { useChain } from "../chain";

export function useAssetHubChain() {
  const chain = useChain();
  return getAssetHubChain(chain);
}
