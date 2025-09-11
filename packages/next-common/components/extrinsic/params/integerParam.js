import NumberInput from "next-common/lib/input/number";
import { useCallback } from "react";

export default function IntegerParam({ title, value, setValue }) {
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
      <NumberInput value={data ?? ""} onValueChange={_setValue} />
    </>
  );
}
