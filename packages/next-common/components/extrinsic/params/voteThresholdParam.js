import React, { useState } from "react";

import Select from "next-common/components/select/index.js";

const options = [
  { label: "Super majority approval", value: 0 },
  { label: "Super majority rejection", value: 1 },
  { label: "Simple majority", value: 2 },
];

export const textMap = options.reduce((textMap, { text, value }) => {
  textMap[value] = text;

  return textMap;
}, {});

export default function VoteThresholdParam() {
  const [value, setValue] = useState(0);
  return (
    <Select
      options={options}
      value={value}
      onChange={(item) => setValue(item.value)}
    />
  );
}
