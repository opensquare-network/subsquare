import { isKintsugiChain } from "next-common/utils/chain";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";

export default function useAccountUrl() {
  const chain = useChain();
  const isKintsugi = isKintsugiChain(chain);

  let uri = "votes";
  if (
    isKintsugi ||
    [Chains.collectives, Chains["westend-collectives"]].includes(chain)
  ) {
    uri = "deposits";
  }

  return `/account/${uri}`;
}
