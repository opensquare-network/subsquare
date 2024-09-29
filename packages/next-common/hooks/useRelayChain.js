import { useChain } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";

export function useRelayChain() {
  const chain = useChain();
  return getRelayChain(chain);
}
