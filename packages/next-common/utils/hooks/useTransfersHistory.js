import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useChain } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";

export const ASSET_TRANSFERS_QUERY = gql`
  query MyQuery($limit: Int!, $offset: Int!, $address: String!) {
    assetTransfers(limit: $limit, offset: $offset, address: $address) {
      transfers {
        from
        to
        assetId
        balance
        indexer {
          blockTime
        }
      }
      total
    }
  }
`;

const assethubStateScanClient = new ApolloClient({
  uri: "https://statemint-gh-api.statescan.io/graphql",
  cache: new InMemoryCache(),
});

/**
 * @description https://statemint-gh-api.statescan.io/graphql
 * @type {typeof useQuery}
 */
export function useAssethubStateScanClientQuery(query, options = {}, ...args) {
  options.client = options.client || assethubStateScanClient;
  return useQuery(query, options, ...args);
}

export default function useTransfersHistory(page = 0, page_size = 25) {
  const address = useRealAddress();
  const chain = useChain();

  if (chain !== Chains.polkadotAssetHub) {
    throw new Error(`Chain ${chain} is not supported.`);
  }

  const { data, loading, error } = useAssethubStateScanClientQuery(
    ASSET_TRANSFERS_QUERY,
    {
      variables: {
        limit: page_size,
        offset: (page - 1) * page_size,
        address,
      },
    },
  );

  const value = data?.assetTransfers?.transfers || [];
  const total = data?.assetTransfers?.total || 0;

  return { value, total, loading, error };
}
