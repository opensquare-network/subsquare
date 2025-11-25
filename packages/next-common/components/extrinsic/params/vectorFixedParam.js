import React, { useCallback, useState } from "react";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import useParamDefs from "./useParamDefs";
import ItemParam from "./itemParam";
import { useContextApi } from "next-common/context/api";

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

export default function VectorFixedParam({ title, def, value, setValue }) {
  const api = useContextApi();
  const registry = api?.registry;
  const inputParams = useParamDefs(registry, def);
  const [params] = useState(
    getParams(inputParams, [], inputParams[0].length || 1),
  );

  const { data = [] } = value || {};
  const _setValue = useCallback(
    (valuesOrFunction) => {
      if (typeof valuesOrFunction === "function") {
        setValue(({ data } = {}) => {
          const newData = valuesOrFunction(data);
          const isValid = newData?.every((item) => item?.isValid);
          return {
            isValid,
            data: newData,
          };
        });
        return;
      }

      const isValid = valuesOrFunction?.every((item) => item?.isValid);
      setValue({
        isValid,
        data: valuesOrFunction,
      });
    },
    [setValue],
  );

  return (
    <>
      {title}

      <div className="flex flex-col">
        <IndentPanel className="flex flex-col gap-[8px]">
          {params.map((param, index) => (
            <ItemParam
              key={param.name}
              index={index}
              name={param?.name}
              def={param?.type}
              value={data}
              setValue={_setValue}
            />
          ))}
        </IndentPanel>
      </div>
    </>
  );
}
