import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { useIsRelativesApiAvailable } from "next-common/hooks/useIsPureProxy";
import { gql } from "@apollo/client";
import { useMultisigQuery } from "next-common/hooks/apollo";
import { useEffect, useState } from "react";

const GET_MULTISIG_ADDRESS = gql`
  query GetMultisigAddress($account: String!) {
    multisigAddress(account: $account) {
      signatories
      threshold
    }
  }
`;

export function useMultisigAddressFromGraphql(address) {
  const [result, setResult] = useState(null);
  const { data, loading } = useMultisigQuery(GET_MULTISIG_ADDRESS, {
    variables: {
      account: address,
    },
  });

  useEffect(() => {
    if (loading || !address) {
      return;
    }

    const { multisigAddress } = data || {};
    setResult(multisigAddress);
  }, [address, data, loading]);

  return {
    result,
    loading,
  };
}

export async function fetchMultisigAddress(address) {
  try {
    const { result } = await backendApi.fetch(`/multisig/addresses/${address}`);

    return result ?? null;
  } catch (error) {
    return null;
  }
}

export default function useMultisigAddress(address) {
  const isRelativesApiAvailable = useIsRelativesApiAvailable(address);

  const { value: result, loading } = useAsync(async () => {
    if (!isRelativesApiAvailable) {
      return null;
    }

    const result = await fetchMultisigAddress(address);
    return result ?? null;
  }, [address, isRelativesApiAvailable]);

  return { result, loading };
}
