import { useChainSettings } from "next-common/context/chain";
import { useEffect, useMemo, useState } from "react";
import { isAddress } from "@polkadot/util-crypto";
import { useDebounce } from "react-use";
import fetchBatchIdentities from "next-common/components/data/common/fetchBatchIdentities";

export default function useSearchFellowshipMember(
  searchValue = "",
  members = [],
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

    members?.forEach(({ address }) => {
      allAccounts.add(address);
    });

    const accountList = Array.from(allAccounts);

    const fetchIdentities = async () => {
      const identities = await fetchBatchIdentities(identityChain, accountList);
      setIdentityMapping(identities);
    };

    fetchIdentities();
  }, [members, identityChain]);

  return useMemo(() => {
    const search = (debouncedSearchValue || "").toLowerCase();

    if (!search) {
      return members;
    }

    if (isAddress(debouncedSearchValue)) {
      return members?.filter(({ address }) => address.toLowerCase() === search);
    }

    return members?.filter(({ address }) => {
      return identityMapping[address]?.includes(search);
    });
  }, [debouncedSearchValue, members, identityMapping]);
}
