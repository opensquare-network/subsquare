import { useChainSettings } from "next-common/context/chain";
import { fetchIdentity } from "next-common/services/identity";
import { getIdentityDisplay } from "next-common/utils/identity";
import { useEffect, useMemo, useState } from "react";

async function fetchBatchIdentities(identityChain, accounts = []) {
  const results = await Promise.all(
    accounts.map(async (account) => {
      const identity = await fetchIdentity(identityChain, account);
      const display = getIdentityDisplay(identity);

      return { account, display: display?.toLowerCase() || null };
    }),
  );

  return results.reduce((acc, { account, display }) => {
    if (display) {
      acc[account] = display;
    }

    return acc;
  }, {});
}

export default function useSearchByAddressIdentity(
  searchValue = "",
  allProxies = [],
) {
  const [identityMapping, setIdentityMapping] = useState({});
  const { identity: identityChain } = useChainSettings();

  useEffect(() => {
    const allAccounts = new Set();

    allProxies?.forEach(({ delegator, items }) => {
      allAccounts.add(delegator);
      items.forEach(({ delegatee }) => allAccounts.add(delegatee));
    });

    const accountList = Array.from(allAccounts);

    const fetchIdentities = async () => {
      const identities = await fetchBatchIdentities(identityChain, accountList);
      setIdentityMapping(identities);
    };

    fetchIdentities();
  }, [allProxies, identityChain]);

  return useMemo(() => {
    const search = (searchValue || "").toLowerCase();
    if (!search) {
      return allProxies;
    }

    return allProxies?.filter(({ delegator, items }) => {
      const addressMatch =
        delegator.toLowerCase().includes(search) ||
        items.some(({ delegatee }) => delegatee.toLowerCase().includes(search));

      const identityMatch =
        identityMapping[delegator]?.includes(search) ||
        items.some(({ delegatee }) =>
          identityMapping[delegatee]?.includes(search),
        );

      return addressMatch || identityMatch;
    });
  }, [searchValue, allProxies, identityMapping]);
}
