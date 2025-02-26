import { gql } from "@apollo/client";
import { useMultisigLazyQuery } from "next-common/hooks/apollo";
import { useState, useEffect } from "react";
import { isAddress } from "@polkadot/util-crypto";

const GET_ALL_MULTISIGS = gql`
  query GetAllMultisigs($account: String!, $limit: Int!, $offset: Int!) {
    multisigs(account: $account, limit: $limit, offset: $offset) {
      total
      offset
      limit
      multisigs {
        address
        approvals
        call
        callHash
        callHex
        signatories
        threshold
        when {
          index
          height
        }
        state {
          name
          args
        }
        updateAt {
          blockHeight
          eventIndex
          extrinsicIndex
        }
      }
    }
  }
`;

export default function useQueryAllMultisigData(account = "", offset, limit) {
  const [isLoading, setIsLoading] = useState(true);
  const [multisigs, setMultisigs] = useState(null);
  const [getMultisigs, { data, loading }] =
    useMultisigLazyQuery(GET_ALL_MULTISIGS);

  useEffect(() => {
    if (account !== "" && !isAddress(account)) {
      setIsLoading(false);
      setMultisigs({ multisigs: [], total: 0 });
      return;
    }

    getMultisigs({
      variables: {
        account,
        offset,
        limit,
      },
    });
  }, [account, offset, limit, getMultisigs]);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    setMultisigs(data?.multisigs);
    setIsLoading(false);
  }, [loading, data]);

  return {
    data: multisigs,
    isLoading,
  };
}
