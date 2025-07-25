import { gql } from "@apollo/client";
import { useMultisigLazyQuery } from "next-common/hooks/apollo";
import { useState, useEffect } from "react";
import { isAddress } from "@polkadot/util-crypto";

const GET_ALL_MULTISIGS = gql`
  query GetAllMultisigs(
    $account: String
    $signatory: String
    $limit: Int!
    $offset: Int!
  ) {
    multisigs(
      account: $account
      signatory: $signatory
      limit: $limit
      offset: $offset
    ) {
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

export default function useQueryAllMultisigData({
  search = "",
  queryType = "account",
  offset = 0,
  limit = 10,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [multisigs, setMultisigs] = useState(null);
  const [getMultisigs, { data, loading }] =
    useMultisigLazyQuery(GET_ALL_MULTISIGS);

  useEffect(() => {
    if (search !== "" && !isAddress(search)) {
      setIsLoading(false);
      setMultisigs({ multisigs: [], total: 0 });
      return;
    }

    const variables = {
      offset,
      limit,
    };

    if (queryType === "signatory") {
      variables.signatory = search;
    }

    if (queryType === "account") {
      variables.account = search;
    }

    getMultisigs({
      variables,
    });
  }, [offset, limit, getMultisigs, search, queryType]);

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
