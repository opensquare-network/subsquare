import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";

export function useCuratorMultisigAddress(address) {
  const { graphqlApiSubDomain } = useChainSettings();
  const [badge, setBadge] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!graphqlApiSubDomain) {
        setError(new Error("Unsupported chain"));
        setLoading(false);
        return;
      }

      const url = `https://${graphqlApiSubDomain}.statescan.io/graphql`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operationName: "GetMultisigAddress",
            variables: { account: address },
            query: `query GetMultisigAddress($account: String!) {
                multisigAddress(account: $account) {
                  signatories
                  threshold
                }
              }`,
          }),
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const result = await response.json();
        const { multisigAddress = {} } = result?.data || {};
        const signatoriesList = multisigAddress.signatories || [];
        const badgeCount = multisigAddress
          ? `${multisigAddress.threshold}/${signatoriesList.length}`
          : "";
        setBadge(badgeCount);
        setSignatories(signatoriesList);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [address, graphqlApiSubDomain]);

  return { badge, signatories, loading, error };
}
