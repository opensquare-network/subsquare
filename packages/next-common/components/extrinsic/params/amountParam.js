import InputNumber from "next-common/components/inputNumber";
import { useState } from "react";

export default function AmountParam() {
  const [value, setValue] = useState(0);
  return <InputNumber value={value} setValue={setValue} min={0} step={1} />;
}
