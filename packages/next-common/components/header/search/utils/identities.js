import { ApolloClient, InMemoryCache } from "@apollo/client";
import getChainSettings from "next-common/utils/consts/settings";

function getSearchIdentityApiUrl(chain) {
  const { graphql } = getChainSettings(chain);

  return `https://${graphql.domain}.statescan.io/graphql`;
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
  const { graphql } = getChainSettings(chain);

  if (!graphql || !graphql.identity || !graphql.domain) {
    return null;
  }

  return new ApolloClient({
    uri: getSearchIdentityApiUrl(chain),
    cache: new InMemoryCache(),
    defaultOptions: getDefaultOptions(),
  });
}
