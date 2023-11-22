import useApi from "next-common/utils/hooks/useApi";
import useParamDefs from "./useParamDefs";
import Params from ".";
import { useCallback } from "react";

export default function StructParam({ def, value, setValue }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);
  const v = Object.values(value || {});

  const _setValue = useCallback(
    (valuesOrFunction) => {
      if (typeof valuesOrFunction === "function") {
        setValue((prev) => {
          const newValue = valuesOrFunction(Object.values(prev || {}));

          let isValid = true;
          const struct = {};
          for (let i = 0; i < params.length; i++) {
            struct[params[i].name] = newValue[i];
            isValid = isValid && !newValue[i].isValid;
          }

          return {
            isValid,
            data: struct,
          };
        });
        return;
      }

      let isValid = true;
      const struct = {};
      for (let i = 0; i < params.length; i++) {
        struct[params[i].name] = valuesOrFunction[i];
        isValid = isValid && !valuesOrFunction[i].isValid;
      }
      setValue({
        isValid,
        data: struct,
      });
    },
    [params, setValue],
  );

  return <Params params={params} value={v} setValue={_setValue} />;
}
