import { gql } from "@apollo/client";
import { useMultisigQuery } from "next-common/hooks/apollo";
import { useState, useEffect } from "react";

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
  const { data, loading } = useMultisigQuery(GET_ALL_MULTISIGS, {
    variables: {
      account,
      offset,
      limit,
    },
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    setMultisigs(data?.multisigs || []);
    setIsLoading(false);
  }, [loading, data, account, offset, limit]);

  return {
    data: multisigs,
    isLoading,
  };
}
