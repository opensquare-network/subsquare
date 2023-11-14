import InputNumber from "next-common/components/inputNumber";
import { useState } from "react";

export default function IntegerParam() {
  const [value, setValue] = useState(0);
  return <InputNumber value={value} setValue={setValue} step={1} />;
}
