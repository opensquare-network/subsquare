import InputText from "next-common/components/inputText";
import { useCallback } from "react";

export default function TextParam({ value, setValue, placeholder }) {
  const { data } = value || {};

  const _setValue = useCallback(
    (data) => {
      if (!data) {
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
    <InputText
      value={data ?? ""}
      setValue={_setValue}
      placeholder={placeholder}
    />
  );
}
