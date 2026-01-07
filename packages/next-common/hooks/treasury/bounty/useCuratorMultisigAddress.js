import { useEffect, useState } from "react";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isNil } from "lodash-es";
import getChainSettings from "next-common/utils/consts/settings";
import { CHAIN } from "next-common/utils/constants";
import { fetchMultisigAddress } from "next-common/hooks/useMultisigAddress";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import getMultisigApiUrl from "next-common/services/multisig/url";

const EMPTY_RESULT = {
  badge: "",
  signatories: [],
  threshold: undefined,
};

function transformMultisigAddressData(multisigAddress) {
  if (!multisigAddress) {
    return EMPTY_RESULT;
  }

  const signatoriesList = multisigAddress?.signatories || [];
  const threshold = multisigAddress?.threshold;
  const badgeCount =
    threshold && signatoriesList.length > 0
      ? `${threshold}/${signatoriesList.length}`
      : "";

  return {
    badge: badgeCount,
    signatories: signatoriesList,
    threshold,
  };
}

export async function fetchMultisigDataFromGraphql(address) {
  const { multisigApiPrefix } = getChainSettings(CHAIN);
  if (isNil(address) || !multisigApiPrefix) {
    return EMPTY_RESULT;
  }

  try {
    const response = await fetch(getMultisigApiUrl(CHAIN), {
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

    return transformMultisigAddressData(multisigAddress);
  } catch (error) {
    console.error("Error fetching multisig data from GraphQL:", error);
    return EMPTY_RESULT;
  }
}

export async function fetchMultisigData(address) {
  if (isNil(address)) {
    return EMPTY_RESULT;
  }

  try {
    if (isKusamaChain(CHAIN) || isPolkadotChain(CHAIN)) {
      const result = await fetchMultisigAddress(address);
      return transformMultisigAddressData(result);
    }

    return fetchMultisigDataFromGraphql(address);
  } catch (error) {
    console.error("Error fetching multisig data from Backend API:", error);
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
