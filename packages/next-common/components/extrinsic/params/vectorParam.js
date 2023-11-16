import React, { useCallback, useEffect, useState } from "react";
import PlusIcon from "next-common/components/callTreeView/plus";
import SubtractIcon from "next-common/components/callTreeView/subtract";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import useParamDefs from "./useParamDefs";
import useApi from "next-common/utils/hooks/useApi";
import IconButton from "next-common/components/iconButton";
import ItemParam from "./itemParam";
import noop from "lodash.noop";

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

export default function VectorParam({ def, value = [], setValue = noop }) {
  const api = useApi();
  const registry = api?.registry;
  const inputParams = useParamDefs(registry, def);

  const [count, setCount] = useState(1);
  const [params, setParams] = useState([]);

  useEffect(() => {
    setParams((prev) => getParams(inputParams, prev, count));
  }, [inputParams, count]);

  const _rowAdd = useCallback(() => setCount((count) => count + 1), []);
  const _rowRemove = useCallback(
    () => setCount((count) => Math.max(count - 1, 0)),
    [],
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
        <div className="flex justify-end gap-[8px]">
          <IconButton onClick={_rowAdd}>
            <PlusIcon size={20} />
          </IconButton>
          <IconButton onClick={_rowRemove}>
            <SubtractIcon size={20} />
          </IconButton>
        </div>
        {params.map((param, index) => (
          <ItemParam
            key={param.name}
            name={param?.name}
            def={param?.type}
            index={index}
            value={value[index]}
            setValue={_setValue}
          />
        ))}
      </IndentPanel>
    </div>
  );
}
