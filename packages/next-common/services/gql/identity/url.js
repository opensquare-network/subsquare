import getChainSettings from "next-common/utils/consts/settings";
import { getRelayChain } from "next-common/utils/chain";
import Chains from "next-common/utils/consts/chains";

export default function getPeopleIdentityApiUrl(chain) {
  const settings = getChainSettings(chain);
  const relayChain = getRelayChain(chain);

  if ([Chains.kusama, Chains.polkadot, Chains.paseo].includes(relayChain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }

  return null;
}
