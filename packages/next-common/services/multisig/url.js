import getChainSettings from "next-common/utils/consts/settings";
import Chains from "next-common/utils/consts/chains";

export default function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if ([Chains.kusama, Chains.polkadot, Chains.paseo].includes(chain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}
