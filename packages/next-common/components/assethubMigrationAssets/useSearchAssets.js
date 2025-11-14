import { useState, useMemo } from "react";
import { useDebounce } from "react-use";
import Input from "next-common/lib/input";
import { SystemSearch } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search for asset",
}) {
  return (
    <Input
      size="small"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      prefix={<SystemSearch className="text-textTertiary w-5 h-5" />}
    />
  );
}

export default function useSearchAssets(list, value, options = {}) {
  const { assetIdToString = false } = options;
  const [debouncedValue, setDebouncedValue] = useState("");

  useDebounce(
    () => {
      setDebouncedValue(value);
    },
    500,
    [value],
  );

  const filteredList = useMemo(() => {
    if (isNil(list)) {
      return list;
    }

    return list.filter((item) => {
      const symbol = item?.symbol?.toLowerCase() || "";
      const name = item?.name?.toLowerCase() || "";
      const assetId = assetIdToString
        ? item?.assetId?.toString() || ""
        : item?.assetId?.toLowerCase() || "";

      const searchTerm = debouncedValue.toLowerCase();

      return (
        symbol.includes(searchTerm) ||
        name.includes(searchTerm) ||
        assetId.includes(assetIdToString ? debouncedValue : searchTerm)
      );
    });
  }, [list, debouncedValue, assetIdToString]);

  return filteredList;
}
