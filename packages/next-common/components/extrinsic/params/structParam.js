import useApi from "next-common/utils/hooks/useApi";
import useParamDefs from "./useParamDefs";
import Params from ".";
import { useCallback } from "react";

export default function StructParam({ def, value, setValue }) {
  const api = useApi();
  const params = useParamDefs(api?.registry, def);
  const v = Object.values(value || {});

  const _setValue = useCallback(
    (values) => {
      const v = {};
      for (let i = 0; i < params.length; i++) {
        v[params[i].name] = values[i];
      }
      setValue(v);
    },
    [setValue],
  );

  return <Params params={params} value={v} setValue={_setValue} />;
}
