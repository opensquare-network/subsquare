import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";

const EMPTY_RESULT = {
  badge: "",
  signatories: [],
};

export async function fetchMultisigData(currentAddress) {
  if (isNil(currentAddress)) {
    return EMPTY_RESULT;
  }

  const { graphqlApiSubDomain } = getChainSettings(CHAIN);

  if (!graphqlApiSubDomain) {
    console.error("Unsupported chain");
    return EMPTY_RESULT;
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
    const signatoriesList = multisigAddress?.signatories || [];
    const badgeCount = multisigAddress
      ? `${multisigAddress.threshold}/${signatoriesList.length}`
      : "";

    return { badge: badgeCount, signatories: signatoriesList };
  } catch (error) {
    console.error(error);
    return EMPTY_RESULT;
  }
}

export function useCuratorMultisigAddress(address) {
  const { graphqlApiSubDomain } = useChainSettings();
  const api = useContextApi();

  const [badge, setBadge] = useState(null);
  const [signatories, setSignatories] = useState([]);
  const [delegateAddress, setDelegateAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isNil(address)) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const { badge: initialBadge, signatories: initialSignatories } =
          await fetchMultisigData(address);

        if (initialSignatories.length === 0 && api) {
          const data = await api.query.proxy.proxies(address);
          const [proxies] = data.toJSON() || [];

          if (proxies.length === 1) {
            const proxyDelegateAddress = proxies[0]?.delegate || "";
            setDelegateAddress(proxyDelegateAddress);

            const { badge: delegateBadge, signatories: delegateSignatories } =
              await fetchMultisigData(proxyDelegateAddress);

            if (delegateSignatories.length > 0) {
              setBadge(delegateBadge);
              setSignatories(delegateSignatories);
            } else {
              setBadge(initialBadge);
              setSignatories(initialSignatories);
            }
          } else {
            setBadge(initialBadge);
            setSignatories(initialSignatories);
          }
        } else {
          setBadge(initialBadge);
          setSignatories(initialSignatories);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [address, graphqlApiSubDomain, api]);

  return { badge, signatories, delegateAddress, loading, error };
}
