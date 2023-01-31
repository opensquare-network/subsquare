import React from "react";
import Select from "./select";

const DEFAULT_OPTIONS = [
  {
    label: "0.1x, no lockup period",
    value: 0,
  },
  {
    label: "1x, locked for 1 enactment period(s)",
    value: 1,
  },
  {
    label: "2x, locked for 2 enactment period(s)",
    value: 2,
  },
  {
    label: "3x, locked for 4 enactment period(s)",
    value: 3,
  },
  {
    label: "4x, locked for 8 enactment period(s)",
    value: 4,
  },
  {
    label: "5x, locked for 16 enactment period(s)",
    value: 5,
  },
  {
    label: "6x, locked for 32 enactment period(s)",
    value: 6,
  },
];

export default function ConvictionSelect({
  value,
  setValue,
  options,
  disabled,
}) {
  return (
    <Select
      disabled={disabled}
      value={value}
      options={options ?? DEFAULT_OPTIONS}
      onChange={(item) => setValue(item.value)}
    />
  );
}
