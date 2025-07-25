import { useCallback } from "react";
import Select from "next-common/components/select";
import { addRouterQuery, getRouterQuery } from "next-common/utils/router";
import { useRouter } from "next/router";

const queryTypeOptions = [
  { value: "multisig", label: "Multisig Address" },
  { value: "signatory", label: "Signatory" },
];

export default function useQueryTypeSelect(initialValue = "multisig") {
  const router = useRouter();
  const queryType = getRouterQuery(router, "query_by") || initialValue;

  const handleQueryTypeChange = useCallback(
    (item) => {
      addRouterQuery(router, "query_by", item?.value);
    },
    [router],
  );

  const component = (
    <Select
      value={queryType}
      options={queryTypeOptions}
      onChange={handleQueryTypeChange}
      className="w-[160px] flex max-sm:w-full"
      itemHeight={40}
    />
  );

  return {
    queryType,
    component,
  };
}
