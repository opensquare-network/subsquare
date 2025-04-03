import getChainSettings from "next-common/utils/consts/settings";

export default function getProxyApiUrl(chain) {
  const settings = getChainSettings(chain);

  if (!settings?.graphqlApiSubDomain) {
    return null;
  }

  return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
}
