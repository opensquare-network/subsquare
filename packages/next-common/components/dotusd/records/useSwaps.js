import { useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { defaultPageSize } from "next-common/utils/constants";
import { getStatescanGraphqlUrl } from "next-common/utils/statescan";

const swapsQuery = gql`
  query PsmSwaps($method: String!, $offset: Int!, $limit: Int!) {
    chainEvents(
      section: "psm"
      method: $method
      offset: $offset
      limit: $limit
    ) {
      events {
        method
        args
        indexer {
          blockHeight
          blockTime
          eventIndex
          extrinsicIndex
        }
      }
      total
    }
  }
`;

/**
 * One page of the swaps of the dotUSD PSM, newest first. They are read from the block scan
 * of Asset Hub, which indexes the `psm.Minted` and `psm.Redeemed` events, the same API the
 * holders of the dotUSD page come from.
 */
export default function useSwaps(method, page, pageSize = defaultPageSize) {
  const { assethubMigration } = useChainSettings();
  const url = getStatescanGraphqlUrl(assethubMigration?.graphqlApiSubDomain);
  const [state, setState] = useState({
    swaps: [],
    total: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (isNil(method) || !url) {
      setState({ swaps: [], total: 0, isLoading: false });
      return;
    }

    let isMounted = true;
    // Keep the total of the previous page around so the pager stays mounted while loading.
    setState((previous) => ({ ...previous, isLoading: true }));

    request(url, swapsQuery, {
      method,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setState({
          swaps: data?.chainEvents?.events ?? [],
          total: data?.chainEvents?.total ?? 0,
          // The page this data belongs to, which lags the requested one while loading.
          page,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch dotUSD swaps", error);

        if (isMounted) {
          setState({ swaps: [], total: 0, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [method, page, pageSize, url]);

  return state;
}
