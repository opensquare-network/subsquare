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
      if (account?.address?.toLowerCase()?.includes(search)) {
        return true;
      }

      if (account?.name?.toLowerCase()?.includes(search)) {
        return true;
      }

      if (account?.meta?.name?.toLowerCase()?.includes(search)) {
        return true;
      }

      if (account?.evmAddress?.toLowerCase()?.includes(search)) {
        return true;
      }

      return false;
    });
  }, [debouncedSearchValue, accounts]);
}
