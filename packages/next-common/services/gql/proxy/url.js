import getChainSettings from "next-common/utils/consts/settings";
import { getStatescanGraphqlUrl } from "next-common/utils/statescan";

export default function getProxyApiUrl(chain) {
  const settings = getChainSettings(chain);

  if (!settings?.graphqlApiSubDomain) {
    return null;
  }

  return getStatescanGraphqlUrl(settings.graphqlApiSubDomain);
}
