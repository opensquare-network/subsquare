import InputNumber from "next-common/components/inputNumber";
import { useCallback } from "react";

export default function AmountParam({ title, value, setValue }) {
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

  return (
    <>
      {title}

      <InputNumber value={data ?? ""} setValue={_setValue} min={0} step={1} />
    </>
  );
}
