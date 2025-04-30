import { ApolloClient, InMemoryCache } from "@apollo/client";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import getChainSettings from "next-common/utils/consts/settings";

function getSearchIdentityApiUrl(chain) {
  const settings = getChainSettings(chain);

  if (isPolkadotChain(chain) || isKusamaChain(chain)) {
    return `https://${settings.graphqlApiSubDomain}.statescan.io/graphql`;
  }

  return null;
}

function getDefaultOptions() {
  return {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  };
}

export default function getIdentitySearchClient(chain) {
  const chainSettings = getChainSettings(chain);

  let searchIdentityClient;
  if (chainSettings?.graphqlApiSubDomain) {
    searchIdentityClient = new ApolloClient({
      uri: getSearchIdentityApiUrl(chain),
      cache: new InMemoryCache(),
      defaultOptions: getDefaultOptions(),
    });
  }

  return searchIdentityClient;
}
