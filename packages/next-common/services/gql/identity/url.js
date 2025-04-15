import getChainSettings from "next-common/utils/consts/settings";
import {
  isKusamaPeopleChain,
  isPolkadotPeopleChain,
} from "next-common/utils/chain";

export default function getPeopleIdentityApiUrl(chain) {
  const settings = getChainSettings(chain);

  if (isKusamaPeopleChain(chain) || isPolkadotPeopleChain(chain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }

  return null;
}
