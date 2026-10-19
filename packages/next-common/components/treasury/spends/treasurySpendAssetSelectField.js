import { useMemo } from "react";
import { noop } from "lodash-es";
import Select from "next-common/components/select";

export default function TreasurySpendAssetSelectField({
  value = "",
  symbols = [],
  onChange = noop,
}) {
  const options = useMemo(() => {
    const list = [...symbols];
    if (value && !list.includes(value)) {
      list.push(value);
    }

    return [
      { value: "", label: "All assets" },
      ...list.map((symbol) => ({ value: symbol, label: symbol })),
    ];
  }, [symbols, value]);

  return (
    <Select
      small
      className="w-40 text12Medium"
      value={value}
      options={options}
      onChange={({ value: symbol }) => onChange(symbol)}
    />
  );
}
