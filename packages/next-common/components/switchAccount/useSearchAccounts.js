import { useMemo, useState } from "react";
import { useDebounce } from "react-use";
import { isAddress } from "@polkadot/util-crypto";

export default function useSearchAccounts(searchValue = "", accounts = []) {
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useDebounce(
    () => {
      setDebouncedSearchValue(searchValue);
    },
    500,
    [searchValue],
  );

  return useMemo(() => {
    const search = (debouncedSearchValue || "").toLowerCase();

    if (!search || !accounts?.length) {
      return accounts;
    }

    if (isAddress(debouncedSearchValue)) {
      return accounts?.filter(
        ({ address }) => address.toLowerCase() === search,
      );
    }

    return accounts?.filter((account) => {
      const { name, meta } = account;

      return (
        meta?.name?.toLowerCase()?.includes(search) ||
        name?.toLowerCase()?.includes(search)
      );
    });
  }, [debouncedSearchValue, accounts]);
}
