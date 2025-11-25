import React, { useCallback, useEffect, useState } from "react";
import PlusIcon from "next-common/components/callTreeView/plus";
import SubtractIcon from "next-common/components/callTreeView/subtract";
import IndentPanel from "next-common/components/callTreeView/indentPanel";
import useParamDefs from "./useParamDefs";
import IconButton from "next-common/components/iconButton";
import ItemParam from "./itemParam";
import { noop } from "lodash-es";
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

export default function VectorParam({ title, def, value, setValue = noop }) {
  const api = useContextApi();
  const registry = api?.registry;
  const inputParams = useParamDefs(registry, def);

  const [count, setCount] = useState(1);
  const [params, setParams] = useState([]);

  useEffect(() => {
    setParams((prev) => getParams(inputParams, prev, count));
  }, [inputParams, count]);

  useEffect(() => {
    setValue(({ data = [] } = {}) => {
      const newData = data?.slice(0, count);
      const isValid = newData?.every((item) => item?.isValid);
      return {
        isValid,
        data: newData,
      };
    });
  }, [setValue, count]);

  const _rowAdd = useCallback(() => setCount((count) => count + 1), []);
  const _rowRemove = useCallback(
    () => setCount((count) => Math.max(count - 1, 0)),
    [],
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
      <div className="flex items-center justify-between">
        {title}
        <div className="flex justify-end gap-[8px]">
          <IconButton onClick={_rowAdd}>
            <PlusIcon size={12} />
            Add
          </IconButton>
          <IconButton onClick={_rowRemove}>
            <SubtractIcon size={12} />
            Remove
          </IconButton>
        </div>
      </div>
      <div className="flex flex-col">
        <IndentPanel className="flex flex-col gap-[8px]">
          {params.map((param, index) => (
            <ItemParam
              key={param.name}
              name={param?.name}
              def={param?.type}
              index={index}
              value={data}
              setValue={_setValue}
            />
          ))}
        </IndentPanel>
      </div>
    </>
  );
}
