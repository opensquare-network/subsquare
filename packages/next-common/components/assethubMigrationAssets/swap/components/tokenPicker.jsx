import { useMemo } from "react";
import Select from "next-common/components/select";
import TokenIcon from "./tokenIcon";

export default function TokenPicker({
  disabled = false,
  onChange,
  token,
  tokens,
}) {
  const options = useMemo(
    () =>
      tokens.map((item) => ({
        value: item.key,
        label: item.symbol,
        icon: <TokenIcon token={item} />,
        token: item,
      })),
    [tokens],
  );

  return (
    <Select
      className="shrink-0"
      disabled={disabled}
      maxDisplayItem={6}
      onChange={(option) => onChange(option.token)}
      options={options}
      optionsPadding="right"
      placeholder="Select"
      value={token?.key}
    />
  );
}
