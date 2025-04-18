import getChainSettings from "next-common/utils/consts/settings";
import {
  isKusamaChain,
  isPolkadotChain,
  isPaseoChain,
} from "next-common/utils/chain";

export default function getPeopleIdentityApiUrl(chain) {
  const settings = getChainSettings(chain);

  if (isPolkadotChain(chain) || isKusamaChain(chain) || isPaseoChain(chain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }

  return null;
}
