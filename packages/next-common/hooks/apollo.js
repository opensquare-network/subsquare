import {
  ApolloClient,
  InMemoryCache,
  useQuery,
  useLazyQuery,
} from "@apollo/client";

const doTreasuryEcoClient = new ApolloClient({
  uri: "https://eco-api.dotreasury.com/graphql",
  cache: new InMemoryCache(),
});

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useQuery | typeof useLazyQuery}
 */
export function useDoTreasuryEcoQuery(
  query,
  options = {},
  lazy = false,
  ...args
) {
  options.client = options.client || doTreasuryEcoClient;

  if (lazy) {
    return useLazyQuery(query, options, ...args);
  } else {
    return useQuery(query, options, ...args);
  }
}
