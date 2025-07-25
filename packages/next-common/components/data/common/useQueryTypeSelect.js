import { useCallback } from "react";
import Select from "next-common/components/select";
import { addRouterQuery, getRouterQuery } from "next-common/utils/router";
import { useRouter } from "next/router";

const queryTypeOptions = [
  { value: "account", label: "Multisig Address" },
  { value: "signatory", label: "Signatory" },
];

export default function useQueryTypeSelect(initialValue = "account") {
  const router = useRouter();
  const queryType = getRouterQuery(router, "query_by") || initialValue;

  const handleQueryTypeChange = useCallback(
    (item) => {
      const newValue = item?.value;

      addRouterQuery(router, "query_by", newValue);
    },
    [router],
  );

  const component = (
    <div className="flex items-center gap-x-2">
      <span className="text12Medium text-textSecondary">Query By</span>
      <Select
        value={queryType}
        options={queryTypeOptions}
        onChange={handleQueryTypeChange}
        className="w-[160px]"
        itemHeight={28}
      />
    </div>
  );

  return {
    queryType,
    component,
  };
}
