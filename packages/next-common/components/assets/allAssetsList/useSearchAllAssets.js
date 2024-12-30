import { useState, useMemo } from "react";
import { useDebounce } from "react-use";
import Input from "next-common/components/input";
import { SystemSearch } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";

export function SearchInput({ value, onChange }) {
  return (
    <Input
      className="h-[30px] flex rounded-md bg-neutral100"
      value={value}
      onChange={onChange}
      placeholder="Search for asset"
      prefixClassName="!ml-1"
      prefix={<SystemSearch className="text-textTertiary w-5 h-5" />}
    />
  );
}

export default function useSearchAllAssets(list, value) {
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
      const assetId = item?.assetId?.toString() || "";

      return (
        symbol.includes(debouncedValue.toLowerCase()) ||
        name.includes(debouncedValue.toLowerCase()) ||
        assetId.includes(debouncedValue)
      );
    });
  }, [list, debouncedValue]);

  return filteredList;
}
