import IndentPanel from "next-common/components/callTreeView/indentPanel";
import ItemParam from "./itemParam";
import { noop } from "lodash-es";
import { useCallback } from "react";

export default function Params({ params, value, setValue = noop }) {
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

  if (!params || params?.length === 0) {
    return null;
  }

  return (
    <IndentPanel className="flex flex-col gap-[8px]">
      {params.map((param, index) => (
        <ItemParam
          key={index}
          name={param?.name}
          def={param?.type}
          index={index}
          value={data}
          setValue={_setValue}
        />
      ))}
    </IndentPanel>
  );
}
