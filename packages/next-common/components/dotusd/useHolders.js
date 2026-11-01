import { useEffect, useState } from "react";
import { gql, request } from "graphql-request";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";

const assetHoldersQuery = gql`
  query DotUsdHolders($assetId: Int!, $limit: Int!, $offset: Int!) {
    assetHolders(assetId: $assetId, limit: $limit, offset: $offset) {
      holders {
        address
        balance
      }
      total
    }
  }
`;

/**
 * dotUSD is minted on Asset Hub, so its holders are indexed by the same statescan instance the
 * asset page uses, e.g. https://assethub-polkadot.statescan.io/#/assets/7873. Holders come back
 * ordered by balance, from the largest holding down.
 */
export default function useHolders(assetId, page, pageSize) {
  const { assethubMigration } = useChainSettings();
  const domain = assethubMigration?.graphqlApiSubDomain;
  const [state, setState] = useState({
    holders: [],
    total: 0,
    isLoading: true,
  });

  useEffect(() => {
    if (isNil(assetId) || !domain) {
      setState({ holders: [], total: 0, isLoading: false });
      return;
    }

    let isMounted = true;
    // Keep the total of the previous page around so the pager stays mounted while loading.
    setState((previous) => ({ ...previous, isLoading: true }));

    request(`https://${domain}.statescan.io/graphql`, assetHoldersQuery, {
      assetId,
      limit: pageSize,
      offset: (page - 1) * pageSize,
    })
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setState({
          holders: data?.assetHolders?.holders ?? [],
          total: data?.assetHolders?.total ?? 0,
          // The page this data belongs to, which lags the requested one while loading.
          page,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch dotUSD holders", error);

        if (isMounted) {
          setState({ holders: [], total: 0, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [assetId, page, pageSize, domain]);

  return state;
}
