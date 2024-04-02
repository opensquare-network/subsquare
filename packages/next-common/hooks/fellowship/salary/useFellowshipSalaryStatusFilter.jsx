import { lowerFirst } from "lodash-es";
import Select from "next-common/components/select";
import { useState } from "react";

export function useFellowshipSalaryMemberStatusFilter(statusValues = []) {
  const options = [
    {
      label: "All",
      value: null,
    },
    ...statusValues.map((value) => {
      return {
        label: value,
        value: lowerFirst(value),
      };
    }),
  ];

  const [status, setStatus] = useState(options[0].value);

  const component = (
    <div className="text12Medium text-textPrimary flex items-center gap-x-2">
      <div>Status</div>
      <Select
        className="w-32"
        small
        value={status}
        options={options}
        onChange={(option) => {
          setStatus(option.value);
        }}
      />
    </div>
  );

  return {
    status,
    component,
  };
}
