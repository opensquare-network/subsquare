import React, { useState } from "react";

import Select from "next-common/components/select/index.js";

const options = [
  { label: "No", value: false },
  { label: "Yes", value: true },
];

export default function BoolParam() {
  const [value, setValue] = useState(0);

  return (
    <Select
      options={options}
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}
