import InputNumber from "next-common/components/inputNumber";

export default function AmountParam({ value, setValue }) {
  return (
    <InputNumber
      value={value}
      setValue={(v) => setValue(parseInt(v))}
      min={0}
      step={1}
    />
  );
}
