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
 * @type {typeof useQuery}
 */
export function useDoTreasuryEcoQuery(query, options = {}, ...args) {
  options.client = options.client || doTreasuryEcoClient;
  return useQuery(query, options, ...args);
}

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useLazyQuery}
 */
export function useDoTreasuryEcoLazyQuery(query, options = {}, ...args) {
  options.client = options.client || doTreasuryEcoClient;
  return useLazyQuery(query, options, ...args);
}
