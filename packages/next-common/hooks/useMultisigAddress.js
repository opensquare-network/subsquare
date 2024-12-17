import { gql } from "@apollo/client";
import { useMultisigQuery } from "next-common/hooks/apollo/multisig";
import { useEffect, useState } from "react";

const GET_MULTISIG_ADDRESS = gql`
  query GetMultisigAddress($account: String!) {
    multisigAddress(account: $account) {
      signatories
      threshold
    }
  }
`;

export default function useMultisigAddress(address) {
  const [result, setResult] = useState(null);
  const { data, loading } = useMultisigQuery(GET_MULTISIG_ADDRESS, {
    variables: {
      account: address,
    },
  });

  useEffect(() => {
    if (loading) {
      return;
    }

    const { multisigAddress } = data || {};
    setResult(multisigAddress);
  }, [data, loading]);

  return {
    result,
    loading,
  };
}
