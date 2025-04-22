import getChainSettings from "next-common/utils/consts/settings";
import Chains from "next-common/utils/consts/chains";
import { getRelayChain } from "next-common/utils/chain";

export default function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  const relayChain = getRelayChain(chain);

  if ([Chains.kusama, Chains.polkadot, Chains.paseo].includes(relayChain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}
