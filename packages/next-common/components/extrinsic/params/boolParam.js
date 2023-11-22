import React, { useCallback } from "react";

import Select from "next-common/components/select/index.js";

const options = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

export default function BoolParam({ title, value, setValue }) {
  const { data } = value || {};
  const _setValue = useCallback(
    (data) => {
      setValue({
        isValid: true,
        data,
      });
    },
    [setValue],
  );

  return (
    <>
      {title}

      <Select
        options={options}
        value={data}
        onChange={(item) => _setValue(item.value)}
      />
    </>
  );
}
