import { useChainSettings } from "next-common/context/chain";
import { useEffect, useMemo, useState } from "react";
import { isAddress } from "@polkadot/util-crypto";
import { useDebounce } from "react-use";
import fetchBatchIdentities from "../../common/fetchBatchIdentities";

export default function useSearchByAddressIdentity(
  searchValue = "",
  allItems = [],
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
    const allAddresses = allItems?.map((item) => item.address);

    const fetchIdentities = async () => {
      const identities = await fetchBatchIdentities(
        identityChain,
        allAddresses,
      );
      setIdentityMapping(identities);
    };

    fetchIdentities();
  }, [allItems, identityChain]);

  return useMemo(() => {
    const search = (debouncedSearchValue || "").toLowerCase();

    if (!search) {
      return allItems;
    }

    if (isAddress(debouncedSearchValue)) {
      return allItems?.filter(
        ({ address }) =>
          address.toLowerCase() === debouncedSearchValue.toLowerCase(),
      );
    }

    return allItems?.filter(({ address }) => {
      const identityMatch = identityMapping[address]
        ?.toLowerCase()
        .includes(search);

      return identityMatch;
    });
  }, [debouncedSearchValue, allItems, identityMapping]);
}
