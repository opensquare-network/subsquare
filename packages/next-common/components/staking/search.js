import { useMemo, useState } from "react";
import SearchBox from "../searchBox";

export default function useSearchedValidators(validatorsWithIdentity) {
  const [searchValue, setSearchValue] = useState("");

  const searchedValidators = useMemo(() => {
    if (!validatorsWithIdentity) {
      return null;
    }
    if (!searchValue || searchValue.length < 3) {
      return validatorsWithIdentity;
    }
    const lowerSearch = searchValue.toLowerCase();
    return validatorsWithIdentity.filter(
      (v) =>
        v.account.toLowerCase().includes(lowerSearch) ||
        v.name?.toLowerCase().includes(lowerSearch),
    );
  }, [validatorsWithIdentity, searchValue]);

  const component = (
    <SearchBox
      value={searchValue}
      setValue={setSearchValue}
      isDebounce={true}
      placeholder="Search identity, address"
    />
  );

  return { searchedValidators, component };
}
