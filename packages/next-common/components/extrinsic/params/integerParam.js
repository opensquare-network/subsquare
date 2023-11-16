import InputNumber from "next-common/components/inputNumber";

export default function IntegerParam({ value, setValue }) {
  return <InputNumber value={value} setValue={setValue} step={1} />;
}
