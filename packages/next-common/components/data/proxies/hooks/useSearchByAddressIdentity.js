import { useChainSettings } from "next-common/context/chain";
import { useEffect, useMemo, useState } from "react";
import { isAddress } from "@polkadot/util-crypto";
import { useDebounce } from "react-use";
import fetchBatchIdentities from "../../common/fetchBatchIdentities";

export default function useSearchByAddressIdentity(
  searchValue = "",
  allProxies = [],
) {
  const [identityMapping, setIdentityMapping] = useState({});
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const { identity: identityChain } = useChainSettings();

  useDebounce(
    () => {
      setDebouncedSearchValue(searchValue);
    },
    500,
    [searchValue],
  );

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
    const search = (debouncedSearchValue || "").toLowerCase();

    if (!search) {
      return allProxies;
    }

    if (isAddress(debouncedSearchValue)) {
      return allProxies?.filter(
        ({ delegator, items }) =>
          delegator.toLowerCase() === search ||
          items.some(({ delegatee }) => delegatee.toLowerCase() === search),
      );
    }

    return allProxies?.filter(({ delegator, items }) => {
      const identityMatch =
        identityMapping[delegator]?.includes(search) ||
        items.some(({ delegatee }) =>
          identityMapping[delegatee]?.includes(search),
        );

      return identityMatch;
    });
  }, [debouncedSearchValue, allProxies, identityMapping]);
}
