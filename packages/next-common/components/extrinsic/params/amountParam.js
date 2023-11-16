import InputNumber from "next-common/components/inputNumber";

export default function AmountParam({ value, setValue }) {
  return (
    <InputNumber
      value={value}
      setValue={(v) => setValue(v ? parseInt(v) : undefined)}
      min={0}
      step={1}
    />
  );
}
