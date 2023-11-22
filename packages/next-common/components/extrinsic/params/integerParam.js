import InputNumber from "next-common/components/inputNumber";
import { useCallback } from "react";

export default function IntegerParam({ value, setValue }) {
  const { data } = value || {};
  const _setValue = useCallback(
    (data) => {
      if (data === "") {
        setValue({
          isValid: false,
          data,
        });
        return;
      }

      setValue({
        isValid: true,
        data,
      });
    },
    [setValue],
  );

  return <InputNumber value={data ?? ""} setValue={_setValue} step={1} />;
}
