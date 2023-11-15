import React from "react";

import Select from "next-common/components/select/index.js";

const options = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

export default function BoolParam({ value, setValue }) {
  return (
    <Select
      options={options}
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}
