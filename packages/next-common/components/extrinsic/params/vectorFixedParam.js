import React, { useCallback, useState } from "react";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import useParamDefs from "./useParamDefs";
import useApi from "next-common/utils/hooks/useApi";
import Param from "./param";

function getParam([{ name, type }], index) {
  return {
    name: `${index}: ${name || type.type}`,
    type,
  };
}

export function getParams(inputParams, prev, max) {
  if (prev.length === max) {
    return prev;
  }

  const params = [];

  for (let index = 0; index < max; index++) {
    params.push(getParam(inputParams, index));
  }

  return params;
}

export default function VectorFixedParam({ def, value, setValue }) {
  const api = useApi();
  const registry = api?.registry;
  const inputParams = useParamDefs(registry, def);
  const [params] = useState(
    getParams(inputParams, [], inputParams[0].length || 1),
  );

  const _setValue = useCallback(
    (index, v) => {
      const newValue = [...value];
      newValue[index] = v;
      setValue(newValue);
    },
    [value, setValue],
  );

  return (
    <div className="flex flex-col">
      <IndentPanel className="flex flex-col gap-[8px]">
        {params.map((param) => (
          <Param
            key={param.name}
            name={param?.name}
            def={param?.type}
            value={value}
            setValue={_setValue}
          />
        ))}
      </IndentPanel>
    </div>
  );
}
