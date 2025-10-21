import { gql } from "@apollo/client";
import { useMultisigLazyQuery } from "next-common/hooks/apollo";
import { useState, useEffect } from "react";
import { isAddress } from "@polkadot/util-crypto";

const GET_MULTISIGS_ACTIVE_COUNT = gql`
  query GetMultisigsActiveCount($account: String, $signatory: String) {
    multisigs(
      account: $account
      signatory: $signatory
      limit: 10
      offset: 0
      multisigState: APPROVING
    ) {
      total
    }
  }
`;

export default function useUserMultisigsActiveCount({
  address,
  queryType = "multisig",
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(null);
  const [getMultisigs, { data, loading }] = useMultisigLazyQuery(
    GET_MULTISIGS_ACTIVE_COUNT,
  );

  useEffect(() => {
    if (address !== "" && !isAddress(address)) {
      setIsLoading(false);
      setTotal(null);
      return;
    }

    const variables = {
      account: queryType === "multisig" ? address : "",
      signatory: queryType === "signatory" ? address : "",
    };

    getMultisigs({ variables });
  }, [getMultisigs, address, queryType]);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    setTotal(data?.multisigs?.total);
    setIsLoading(false);
  }, [loading, data]);

  return {
    total,
    isLoading,
  };
}
