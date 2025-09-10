import { useAsync } from "react-use";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { CHAIN } from "next-common/utils/constants";
import getChainSettings from "next-common/utils/consts/settings";
import { hasProxiesGraphQL } from "next-common/utils/env/proxy";

const PROXIES_QUERY = gql`
  query AllProxiesQuery {
    proxies {
      delay
      delegator
      delegatee
      proxyType
    }
  }
`;

function getProxiesClient() {
  const { subsquareGraphql } = getChainSettings(CHAIN);
  if (!hasProxiesGraphQL()) {
    return null;
  }

  return new ApolloClient({
    ssrMode: true,
    uri: `https://${subsquareGraphql.domain}.subsquare.io/graphql`,
    cache: new InMemoryCache(),
  });
}

async function queryProxies() {
  const proxiesClient = getProxiesClient();
  if (!proxiesClient) {
    throw new Error("Intime module is not supported");
  }

  try {
    const { data } = await proxiesClient.query({
      query: PROXIES_QUERY,
      fetchPolicy: "no-cache",
    });

    return data?.proxies;
  } catch (e) {
    return null;
  }
}

export default function useAllGraphqlProxies() {
  const { value: proxies, loading } = useAsync(() => queryProxies(), []);

  return {
    loading,
    proxies,
  };
}
