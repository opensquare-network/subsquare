import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export function useCuratorMultisigAddress(address) {
  const { graphqlApiSubDomain } = useChainSettings();
  const api = useContextApi();

  const [badge, setBadge] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [delegateAddress, setDelegateAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMultisigData(currentAddress) {
      if (!graphqlApiSubDomain) {
        setError(new Error("Unsupported chain"));
        setLoading(false);
        return;
      }

      try {
        const url = `https://${graphqlApiSubDomain}.statescan.io/graphql`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            operationName: "GetMultisigAddress",
            variables: { account: currentAddress },
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

        if (signatoriesList.length === 0) {
          const data = await api.query.proxy.proxies(currentAddress);
          const [proxies] = data.toJSON() || [];
          if (proxies.length === 1) {
            setDelegateAddress(proxies[0]?.delegate || "");

            const delegateResult = await fetchMultisigData(
              proxies[0]?.delegate || "",
            );
            if (delegateResult.signatories.length > 0) {
              setBadge(delegateResult.badge);
              setSignatories(delegateResult.signatories);
            }
          }
        } else {
          setBadge(badgeCount);
          setSignatories(signatoriesList);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchMultisigData(address);
  }, [address, graphqlApiSubDomain, api]);

  return { badge, signatories, delegateAddress, loading, error };
}
