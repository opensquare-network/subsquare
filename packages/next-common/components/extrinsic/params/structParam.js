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
          const struct = {};
          for (let i = 0; i < params.length; i++) {
            struct[params[i].name] = newValue[i];
          }
          return struct;
        });
        return;
      }

      const struct = {};
      for (let i = 0; i < params.length; i++) {
        struct[params[i].name] = valuesOrFunction[i];
      }
      setValue(struct);
    },
    [params, setValue],
  );

  return <Params params={params} value={v} setValue={_setValue} />;
}
