import { useState } from "react";
import Input from "next-common/components/input";
import { SystemSearch } from "@osn/icons/subsquare";

export default function useSearchAllAssets(list = []) {
  const [value, setValue] = useState("");

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const filteredList = list.filter(
    (item) =>
      item.symbol.toLowerCase().includes(value.toLowerCase()) ||
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.assetId.toString().includes(value),
  );

  return {
    result: filteredList,
    component: (
      <Input
        className="w-40 h-[30px] rounded-md bg-neutral100 inline-flex"
        value={value}
        onChange={handleInputChange}
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
    ),
  };
}
