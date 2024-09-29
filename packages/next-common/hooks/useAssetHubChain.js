import { useChain } from "next-common/context/chain";
import { getAssetHubChain } from "next-common/utils/chain";

export function useAssetHubChain() {
  const chain = useChain();
  return getAssetHubChain(chain);
}
