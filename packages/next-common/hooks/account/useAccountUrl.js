import { isKintsugiChain } from "next-common/utils/chain";
import { CHAIN } from "next-common/utils/constants";
import Chains from "next-common/utils/consts/chains";

export function getAccountUrl() {
  const isKintsugi = isKintsugiChain(CHAIN);

  let uri = "votes";
  if (
    isKintsugi ||
    [Chains.collectives, Chains.westendCollectives].includes(CHAIN)
  ) {
    uri = "deposits";
  }

  return `/account/${uri}`;
}

export default function useAccountUrl() {
  return getAccountUrl();
}
