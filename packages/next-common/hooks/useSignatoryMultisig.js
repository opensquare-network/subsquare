import { gql } from "@apollo/client";
import { useMultisigQuery } from "next-common/hooks/apollo";
import { useEffect, useState } from "react";

const GET_MULTISIG_ADDRESSES = gql`
  query MyQuery($limit: Int!, $offset: Int!, $signatory: String) {
    multisigAddresses(limit: $limit, offset: $offset, signatory: $signatory) {
      limit
      multisigAddresses {
        address
        signatories
        threshold
      }
      offset
      total
    }
  }
`;

export default function useSignatoryMultisig(address) {
  const [result, setResult] = useState(null);
  const { data, loading } = useMultisigQuery(GET_MULTISIG_ADDRESSES, {
    variables: {
      signatory: address,
      limit: 100,
      offset: 0,
    },
  });

  useEffect(() => {
    if (loading || !address) {
      return;
    }

    const { multisigAddresses } = data || {};
    setResult(multisigAddresses);
  }, [address, data, loading]);

  return {
    result,
    loading,
  };
}
