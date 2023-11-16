import InputNumber from "next-common/components/inputNumber";
import { useCallback, useEffect, useState } from "react";

export default function IntegerParam({ setValue }) {
  const [num, setNum] = useState(0);
  const _setNum = useCallback((v) => {
    setNum(v);
  }, []);
  useEffect(() => {
    setValue(num);
  }, [num]);

  return <InputNumber value={num} setValue={_setNum} step={1} />;
}
