import { useState, useEffect } from "react";
import { gql, request } from "graphql-request";
import { useChainSettings } from "next-common/context/chain";

const nominationsQuery = gql`
  query GetAccountStakingNominations($address: String!) {
    stakingNominations(address: $address) {
      validators {
        active
        address
        nominator_stake
        total_stake
        self_stake
        commission
        nominator_count
      }
    }
  }
`;

export default function useStakingNominations(address) {
  const { graphqlApiSubDomain, assethubMigration } = useChainSettings();
  const stakingSubDomain =
    assethubMigration?.graphqlApiSubDomain || graphqlApiSubDomain;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || !stakingSubDomain) {
      setLoading(false);
      return;
    }

    const url = `https://${stakingSubDomain}.statescan.io/graphql`;
    setLoading(true);

    request(url, nominationsQuery, { address })
      .then((data) => {
        setList(data?.stakingNominations?.validators ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [address, stakingSubDomain]);

  return { list, loading };
}
