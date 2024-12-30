import { useState, useMemo } from "react";
import { useDebounce } from "react-use";
import Input from "next-common/components/input";
import { SystemSearch } from "@osn/icons/subsquare";
import { isNil } from "lodash-es";

export function SearchInput({ value, onChange }) {
  return (
    <Input
      className="w-40 h-[30px] rounded-md bg-neutral100 inline-flex"
      value={value}
      onChange={onChange}
      placeholder="Search for asset"
      prefixClassName="!ml-1"
      prefix={
        <SystemSearch
          width={20}
          height={20}
          className="[&_path]:fill-textTertiary"
        />
      }
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

    return list.filter(
      (item) =>
        item.symbol.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.name.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        item.assetId.toString().includes(debouncedValue),
    );
  }, [list, debouncedValue]);

  return filteredList;
}
