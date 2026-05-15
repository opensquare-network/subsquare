import { useState, useEffect } from "react";
import { gql, request } from "graphql-request";
import { useChainSettings } from "next-common/context/chain";
import { defaultPageSize } from "next-common/utils/constants";

const stakingRewardsQuery = gql`
  query GetAccountTabStakingRewards(
    $limit: Int!
    $offset: Int!
    $address: String
  ) {
    stakingRewards(limit: $limit, offset: $offset, address: $address) {
      items {
        amount
        dest
        era
        indexer {
          blockHeight
          blockTime
          eventIndex
          extrinsicIndex
          blockHash
        }
        validator
        bonded
        isValidator
        who
      }
      total
    }
  }
`;

export default function useStakingRewards(
  address,
  page = 0,
  pageSize = defaultPageSize,
) {
  const { graphqlApiSubDomain, assethubMigration } = useChainSettings();
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);

  const graphqlApiDomain =
    assethubMigration?.graphqlApiSubDomain || graphqlApiSubDomain;

  useEffect(() => {
    if (!address || !graphqlApiDomain) {
      setLoading(false);
      return;
    }

    const url = `https://${graphqlApiDomain}.statescan.io/graphql`;
    setLoading(true);

    request(url, stakingRewardsQuery, {
      limit: pageSize,
      offset: page * pageSize,
      address,
    })
      .then((data) => {
        setList(data?.stakingRewards?.items ?? []);
        setTotal(data?.stakingRewards?.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [address, graphqlApiDomain, page, pageSize]);

  return { list, total, loading };
}
