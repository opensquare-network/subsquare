import { ApolloClient, useQuery } from "@apollo/client";

const doTreasuryEcoClient = new ApolloClient({
  uri: "https://eco-api.dotreasury.com/graphql",
});

/**
 * @description https://eco-api.dotreasury.com/graphql
 * @type {typeof useQuery}
 */
export function useDoTreasuryEcoQuery(query, options = {}, ...args) {
  options.client = options.client || doTreasuryEcoClient;

  return useQuery(query, options, ...args);
}
