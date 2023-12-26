import useApi from "next-common/utils/hooks/useApi";
import useParamDefs from "./useParamDefs";
import Params from ".";
import { useCallback } from "react";

export default function StructParam({ title, def, value, setValue }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);
  const structValues = {
    isValid: !!value?.isValid,
    data: Object.values(value?.data || {}),
  };

  const _setValue = useCallback(
    (valuesOrFunction) => {
      if (typeof valuesOrFunction === "function") {
        setValue((prev) => {
          const structValues = {
            isValid: !!prev?.isValid,
            data: Object.values(prev?.data || {}),
          };
          const newValue = valuesOrFunction(structValues);

          const isValid = newValue.isValid;
          const struct = {};
          for (let i = 0; i < params.length; i++) {
            struct[params[i].name] = newValue.data[i];
          }

          return {
            isValid,
            data: struct,
          };
        });
        return;
      }

      const newValue = valuesOrFunction;
      const isValid = newValue.isValid;
      const struct = {};
      for (let i = 0; i < params.length; i++) {
        struct[params[i].name] = newValue.data[i];
      }
      setValue({
        isValid,
        data: struct,
      });
    },
    [params, setValue],
  );

  return (
    <>
      {title}
      <Params params={params} value={structValues} setValue={_setValue} />
    </>
  );
}
